//! Installation sur iPhone par câble, avec un compte Apple — façon
//! Sideloadly / AltServer, sans passer par AltStore.
//!
//! La mécanique vient d'`isideload` (utilisé par iloader) :
//!   connexion Apple (SRP + 2FA)  →  session développeur (équipe, certificat,
//!   appareil, identifiants d'app)  →  re-signature de l'IPA  →  envoi par
//!   usbmuxd (service Apple Mobile Device, installé avec iTunes / iCloud).
//!
//! Limites d'un compte Apple gratuit, qu'on ne contourne pas : app valable
//! 7 jours, 3 apps actives, 10 identifiants d'app par semaine.
//!
//! Choix délibérés :
//!  - certificats pleins → on REFUSE (`MaxCertsBehavior::Error`) plutôt que
//!    de révoquer : révoquer casserait les apps d'AltStore / Sideloadly ;
//!  - chaque opération isideload tourne sur son propre fil avec son propre
//!    runtime : ses futures ne sont pas garanties `Send`, ce qu'exige une
//!    commande Tauri asynchrone ;
//!  - le mot de passe n'est gardé (coffre Windows) que si l'utilisateur le
//!    demande : il sert à re-signer les apps chaque semaine.

use std::collections::{HashMap, HashSet};
use std::future::Future;
use std::path::PathBuf;
use std::sync::atomic::AtomicBool;
use std::sync::Mutex;

use idevice::lockdown::LockdownClient;
use idevice::provider::IdeviceProvider;
use idevice::usbmuxd::{Connection, UsbmuxdAddr, UsbmuxdConnection};
use idevice::IdeviceService;
use isideload::auth::apple_account::{AppleAccount, TwoFactorCallbackParams, TwoFactorCallbackResponse};
use isideload::dev::developer_session::DeveloperSession;
use isideload::dev::devices::DevicesApi;
use isideload::util::device::IdeviceInfo;
use isideload::sideload::builder::MaxCertsBehavior;
use isideload::sideload::{SideloaderBuilder, TeamSelection};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::sync::oneshot;

const KEYRING_SERVICE: &str = "CordLauncher Apple ID";
/// Ancien emplacement (un seul compte, JSON email + mot de passe) : migré au premier accès.
const LEGACY_KEYRING_USER: &str = "account";
const TWO_FACTOR_EVENT: &str = "apple://2fa";
const PROGRESS_EVENT: &str = "iphone://progress";
const SIGNED_IN_EVENT: &str = "apple://signed-in";

#[derive(Default)]
pub struct AppleState {
    /// Sessions ouvertes pendant cette exécution, par identifiant (en minuscules).
    /// Le verrou sert aussi de garde « une seule opération Apple à la fois ».
    sessions: tokio::sync::Mutex<HashMap<String, AppleAccount>>,
    /// Copie des clés de `sessions`, lisible même pendant une opération.
    connected: Mutex<HashSet<String>>,
    /// Réponse attendue par la 2FA en cours.
    pending_2fa: Mutex<Option<oneshot::Sender<TwoFactorCallbackResponse>>>,
}

// ── Profils Apple ───────────────────────────────────────────────────────────
// Plusieurs identifiants Apple, dont un actif (celui qui signe les apps).
// La liste (sans secret) vit dans `apple-profiles.json` ; chaque mot de passe
// mémorisé a sa propre entrée du coffre Windows (utilisateur = identifiant).

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct ProfileMeta {
    email: String,
    added_at: u64,
    last_used_at: Option<u64>,
}

#[derive(Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
struct ProfileIndex {
    active: Option<String>,
    profiles: Vec<ProfileMeta>,
}

impl ProfileIndex {
    fn upsert(&mut self, email: &str) {
        let now = unix_now();
        match self.profiles.iter_mut().find(|p| profile_key(&p.email) == profile_key(email)) {
            Some(p) => { p.email = email.to_string(); p.last_used_at = Some(now); }
            None => self.profiles.push(ProfileMeta { email: email.to_string(), added_at: now, last_used_at: Some(now) }),
        }
        self.active = Some(email.to_string());
    }
    fn find(&self, email: &str) -> Option<&ProfileMeta> {
        self.profiles.iter().find(|p| profile_key(&p.email) == profile_key(email))
    }
}

fn profile_key(email: &str) -> String {
    email.trim().to_lowercase()
}

fn launcher_dir() -> Option<PathBuf> {
    Some(PathBuf::from(std::env::var_os("LOCALAPPDATA")?).join("app.cordsuite.launcher"))
}

fn password_entry(email: &str) -> Result<keyring::Entry, String> {
    keyring::Entry::new(KEYRING_SERVICE, &profile_key(email)).map_err(|e| format!("Coffre Windows inaccessible : {e}"))
}

fn saved_password(email: &str) -> Option<String> {
    password_entry(email).ok()?.get_password().ok()
}

fn forget_password(email: &str) {
    if let Ok(entry) = password_entry(email) {
        let _ = entry.delete_credential();
    }
}

fn load_profiles() -> ProfileIndex {
    let path = launcher_dir().map(|d| d.join("apple-profiles.json"));
    let mut index: ProfileIndex = path
        .as_ref()
        .and_then(|p| std::fs::read(p).ok())
        .and_then(|bytes| serde_json::from_slice(&bytes).ok())
        .unwrap_or_default();

    // Migration de l'ancien compte unique mémorisé.
    #[derive(Deserialize)]
    struct Legacy { email: String, password: String }
    if let Ok(entry) = keyring::Entry::new(KEYRING_SERVICE, LEGACY_KEYRING_USER) {
        if let Some(legacy) = entry.get_password().ok().and_then(|json| serde_json::from_str::<Legacy>(&json).ok()) {
            if password_entry(&legacy.email).and_then(|e| e.set_password(&legacy.password).map_err(|e| e.to_string())).is_ok() {
                if index.find(&legacy.email).is_none() {
                    index.upsert(&legacy.email);
                }
                if index.active.is_none() {
                    index.active = Some(legacy.email.clone());
                }
                if save_profiles(&index).is_ok() {
                    let _ = entry.delete_credential();
                }
            }
        }
    }
    index
}

fn save_profiles(index: &ProfileIndex) -> Result<(), String> {
    let dir = launcher_dir().ok_or("Dossier de CordLauncher introuvable.")?;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let json = serde_json::to_vec_pretty(index).map_err(|e| e.to_string())?;
    std::fs::write(dir.join("apple-profiles.json"), json).map_err(|e| format!("Profils Apple non enregistrés : {e}"))
}

/// Erreur isideload lisible : les rapports `rootcause` sont des arbres
/// (message, `├ fichier.rs:ligne`, `│`…) ; on garde toute la chaîne des
/// messages, sans la décoration ni les emplacements de code. Le rapport
/// complet part dans la console et dans `%LOCALAPPDATA%\app.cordsuite.launcher\logs\iphone.log`.
fn short_error(e: impl std::fmt::Display + std::fmt::Debug) -> String {
    let full = e.to_string();
    let debug = format!("{e:?}");
    eprintln!("[iphone] {full}\n[iphone details] {debug}");
    log_error(&debug);
    let mut messages: Vec<String> = Vec::new();
    for line in full.lines() {
        let text = line.trim_start_matches(|c: char| "│├╰└─●•┬┴┼ \t".contains(c)).trim();
        let location = text.contains(".rs:") && !text.contains(' ');
        if text.is_empty() || location || messages.iter().any(|m| m == text) { continue; }
        messages.push(text.to_string());
    }
    if messages.is_empty() { return full.trim().to_string(); }
    messages.truncate(6);
    messages.join(" → ")
}

fn log_error(detail: &str) {
    use std::io::Write;
    let Some(base) = std::env::var_os("LOCALAPPDATA") else { return };
    let dir = std::path::PathBuf::from(base).join("app.cordsuite.launcher").join("logs");
    if std::fs::create_dir_all(&dir).is_err() { return; }
    let stamp = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0);
    if let Ok(mut file) = std::fs::OpenOptions::new().create(true).append(true).open(dir.join("iphone.log")) {
        let _ = writeln!(file, "── {stamp} ──\n{detail}\n");
    }
}

/// Exécute un futur non-`Send` sur un fil dédié et rend son résultat.
pub(crate) async fn on_own_thread<F, Fut, T>(make: F) -> Result<T, String>
where
    F: FnOnce() -> Fut + Send + 'static,
    Fut: Future<Output = Result<T, String>> + 'static,
    T: Send + 'static,
{
    let (tx, rx) = oneshot::channel();
    std::thread::spawn(move || {
        let result = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .map_err(|e| e.to_string())
            .and_then(|rt| rt.block_on(make()));
        let _ = tx.send(result);
    });
    rx.await.unwrap_or_else(|_| Err("L'opération iPhone s'est interrompue.".into()))
}

// ── Compte Apple ────────────────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppleProfile {
    email: String,
    /// Compte qui signe les apps.
    active: bool,
    /// Session ouverte dans cette exécution de CordLauncher.
    connected: bool,
    /// Mot de passe gardé dans le coffre Windows (reconnexion automatique).
    remembered: bool,
    added_at: u64,
    last_used_at: Option<u64>,
    /// Secondes avant de pouvoir retenter la connexion (pause après des 429).
    paused_for: Option<u64>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppleStatus {
    active: Option<String>,
    profiles: Vec<AppleProfile>,
}

fn status_of(state: &AppleState, index: &ProfileIndex) -> AppleStatus {
    let connected = state.connected.lock().unwrap().clone();
    let active = index.active.as_deref().map(profile_key);
    let mut profiles: Vec<AppleProfile> = index
        .profiles
        .iter()
        .map(|p| AppleProfile {
            email: p.email.clone(),
            active: active.as_deref() == Some(profile_key(&p.email).as_str()),
            connected: connected.contains(&profile_key(&p.email)),
            remembered: saved_password(&p.email).is_some(),
            added_at: p.added_at,
            last_used_at: p.last_used_at,
            paused_for: apple_cooldown_left(&p.email),
        })
        .collect();
    // Actif d'abord, puis du plus récemment utilisé au plus ancien.
    profiles.sort_by_key(|p| (!p.active, std::cmp::Reverse(p.last_used_at.unwrap_or(p.added_at))));
    AppleStatus { active: index.active.clone(), profiles }
}

#[tauri::command]
pub fn apple_status(state: State<'_, AppleState>) -> AppleStatus {
    status_of(&state, &load_profiles())
}

/// Change le compte actif, sans contacter Apple : la connexion se fera à la
/// prochaine installation (avec le mot de passe mémorisé) ou tout de suite si
/// une session est déjà ouverte.
#[tauri::command]
pub fn apple_switch(state: State<'_, AppleState>, email: String) -> Result<AppleStatus, String> {
    let mut index = load_profiles();
    let email = index.find(&email).map(|p| p.email.clone()).ok_or("Ce compte Apple n'est plus enregistré.")?;
    index.upsert(&email);
    save_profiles(&index)?;
    Ok(status_of(&state, &index))
}

/// Oublie un compte : session fermée, mot de passe retiré du coffre.
#[tauri::command]
pub async fn apple_forget(state: State<'_, AppleState>, email: String) -> Result<AppleStatus, String> {
    let mut sessions = state.sessions.try_lock().map_err(|_| "Une opération Apple est déjà en cours.")?;
    let key = profile_key(&email);
    sessions.remove(&key);
    state.connected.lock().unwrap().remove(&key);
    forget_password(&email);
    let mut index = load_profiles();
    index.profiles.retain(|p| profile_key(&p.email) != key);
    if index.active.as_deref().map(profile_key).as_deref() == Some(key.as_str()) {
        index.active = index.profiles.iter().max_by_key(|p| p.last_used_at.unwrap_or(p.added_at)).map(|p| p.email.clone());
    }
    save_profiles(&index)?;
    Ok(status_of(&state, &index))
}

/// Connexion. La 2FA arrive dans l'interface par l'évènement `apple://2fa` ;
/// la réponse revient par `apple_2fa_respond`.
async fn login(app: &AppHandle, email: String, password: String) -> Result<AppleAccount, String> {
    // Si Apple répond encore 429 après les nouveaux essais d'isideload, on
    // s'interdit de retenter ce compte quelques minutes (pause par identifiant).
    if let Some(left) = apple_cooldown_left(&email) {
        return Err(format!(
            "Apple bloque encore les connexions à ce compte Apple (trop de tentatives). Réessaie dans {}, sans relancer d'ici là.",
            duration_fr(left)
        ));
    }
    let result = login_attempt(app.clone(), email.clone(), password).await;
    if result.is_ok() {
        // Ferme la fenêtre du code (animation de réussite) sans attendre la suite de l'opération.
        let _ = app.emit(SIGNED_IN_EVENT, &email);
    }
    if let Err(message) = &result {
        if message.contains("429") || message.contains("Too Many Requests") {
            // isideload 0.4 a déjà relancé 10 fois chaque requête : les serveurs d'Apple
            // refusent en rafale depuis le 2026-09-10, on laisse passer 10 minutes.
            let seconds = 10 * 60;
            set_apple_cooldown(&email, seconds);
            return Err(format!(
                "Les serveurs d'Apple refusent les connexions en ce moment (erreur 429, qui touche tous les outils de sideload). \
                 CordLauncher a déjà réessayé 10 fois : réessaie dans {}.",
                duration_fr(seconds)
            ));
        }
    }
    result
}

fn duration_fr(seconds: u64) -> String {
    let minutes = seconds / 60 + 1;
    if minutes < 90 { format!("{minutes} min") } else { format!("{} h", (minutes + 30) / 60) }
}

/// Un fichier par identifiant Apple (`apple-cooldown-<email>`) contenant l'heure unix de fin.
fn apple_cooldown_file(email: &str) -> Option<std::path::PathBuf> {
    let id: String = email.trim().to_lowercase().chars().map(|c| if c.is_ascii_alphanumeric() { c } else { '_' }).collect();
    Some(std::path::PathBuf::from(std::env::var_os("LOCALAPPDATA")?).join("app.cordsuite.launcher").join(format!("apple-cooldown-{id}")))
}
fn unix_now() -> u64 {
    std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0)
}
fn apple_cooldown_left(email: &str) -> Option<u64> {
    let until: u64 = std::fs::read_to_string(apple_cooldown_file(email)?).ok()?.trim().parse().ok()?;
    until.checked_sub(unix_now()).filter(|left| *left > 0)
}
fn set_apple_cooldown(email: &str, seconds: u64) {
    let Some(file) = apple_cooldown_file(email) else { return };
    let until = unix_now() + seconds;
    let written = std::fs::create_dir_all(file.parent().unwrap()).and_then(|_| std::fs::write(&file, until.to_string()));
    log_error(&format!("Apple 429 : pause jusqu'à {until} ({seconds} s) → {written:?}"));
}

/// Évènement de 2FA : les paramètres d'isideload + le compte concerné et le
/// délai laissé pour répondre (la fenêtre du code affiche le compte à rebours).
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct TwoFactorEvent<'a> {
    email: &'a str,
    expires_in: u64,
    #[serde(flatten)]
    params: &'a TwoFactorCallbackParams,
}

async fn login_attempt(app: AppHandle, email: String, password: String) -> Result<AppleAccount, String> {
    on_own_thread(move || async move {
        let for_callback = email.clone();
        isideload::auth::builder::AppleAccountBuilder::new(&email)
            .login(&password, move |params: TwoFactorCallbackParams| {
                let app = app.clone();
                let email = for_callback.clone();
                async move {
                    let (tx, rx) = oneshot::channel();
                    *app.state::<AppleState>().pending_2fa.lock().unwrap() = Some(tx);
                    let _ = app.emit(TWO_FACTOR_EVENT, TwoFactorEvent { email: &email, expires_in: 180, params: &params });
                    let response = tokio::time::timeout(std::time::Duration::from_secs(180), rx).await;
                    app.state::<AppleState>().pending_2fa.lock().unwrap().take();
                    Ok(response.ok().and_then(Result::ok).unwrap_or(TwoFactorCallbackResponse::Abort))
                }
            })
            .await
            .map_err(short_error)
    })
    .await
}

#[tauri::command]
pub async fn apple_login(
    app: AppHandle,
    state: State<'_, AppleState>,
    email: String,
    password: String,
    remember: bool,
) -> Result<AppleStatus, String> {
    let mut sessions = state.sessions.try_lock().map_err(|_| "Une opération Apple est déjà en cours.")?;
    let email = email.trim().to_string();
    if email.is_empty() || password.is_empty() {
        return Err("Entre l'identifiant et le mot de passe du compte Apple.".into());
    }
    let account = login(&app, email.clone(), password.clone()).await?;
    sessions.insert(profile_key(&email), account);
    state.connected.lock().unwrap().insert(profile_key(&email));

    if remember {
        password_entry(&email)?.set_password(&password).map_err(|e| format!("Coffre Windows inaccessible : {e}"))?;
    } else {
        forget_password(&email);
    }
    let mut index = load_profiles();
    index.upsert(&email);
    save_profiles(&index)?;
    Ok(status_of(&state, &index))
}

#[tauri::command]
pub fn apple_2fa_respond(state: State<'_, AppleState>, response: TwoFactorCallbackResponse) -> Result<(), String> {
    let sender = state.pending_2fa.lock().unwrap().take().ok_or("Aucune vérification en attente.")?;
    sender.send(response).map_err(|_| "La vérification a expiré.".to_string())
}

/// Oublie l'« appareil » que CordLauncher présente à Apple (identité anisette
/// gardée par isideload dans le coffre Windows) : la prochaine connexion en crée
/// un nouveau, et Apple redemandera un code de vérification. Lève aussi les pauses.
#[tauri::command]
pub async fn apple_reset_device(state: State<'_, AppleState>) -> Result<(), String> {
    let mut sessions = state.sessions.try_lock().map_err(|_| "Une opération Apple est déjà en cours.")?;
    sessions.clear();
    state.connected.lock().unwrap().clear();
    match keyring::Entry::new("isideload", "anisette_state").and_then(|e| e.delete_credential()) {
        Ok(()) | Err(keyring::Error::NoEntry) => {}
        Err(e) => return Err(format!("Coffre Windows inaccessible : {e}")),
    }
    let dir = std::env::var_os("LOCALAPPDATA").map(|d| std::path::PathBuf::from(d).join("app.cordsuite.launcher"));
    for entry in dir.and_then(|d| std::fs::read_dir(d).ok()).into_iter().flatten().flatten() {
        if entry.file_name().to_string_lossy().starts_with("apple-cooldown") {
            let _ = std::fs::remove_file(entry.path());
        }
    }
    log_error("Appareil Apple réinitialisé (identité anisette supprimée)");
    Ok(())
}

// ── iPhone branchés ─────────────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IphoneDevice {
    udid: String,
    name: Option<String>,
    ios_version: Option<String>,
    /// "usb" ou "wifi".
    connection: &'static str,
    /// Faux tant que l'iPhone n'a pas répondu « Se fier à cet ordinateur ».
    trusted: bool,
}

async fn device_details(provider: &impl IdeviceProvider) -> Option<(String, Option<String>)> {
    let mut lockdown = LockdownClient::connect(provider).await.ok()?;
    let pairing = provider.get_pairing_file().await.ok()?;
    lockdown.start_session(&pairing).await.ok()?;
    let name = lockdown.get_value(Some("DeviceName"), None).await.ok()?.as_string()?.to_string();
    let version = lockdown
        .get_value(Some("ProductVersion"), None)
        .await
        .ok()
        .and_then(|v| v.as_string().map(str::to_string));
    Some((name, version))
}

#[tauri::command]
pub async fn iphone_list() -> Result<Vec<IphoneDevice>, String> {
    on_own_thread(|| async {
        let mut mux = UsbmuxdConnection::default().await.map_err(|_| {
            "Service Apple Mobile Device introuvable : installe iTunes ou « Appareils Apple » depuis le Microsoft Store."
                .to_string()
        })?;
        let devices = mux.get_devices().await.map_err(short_error)?;
        let mut out = Vec::new();
        for d in devices {
            let connection = match d.connection_type {
                Connection::Usb => "usb",
                _ => "wifi",
            };
            // Un iPhone vu à la fois en USB et en Wi-Fi n'apparaît qu'une fois (USB d'abord).
            if out.iter().any(|x: &IphoneDevice| x.udid == d.udid) {
                continue;
            }
            let provider = d.to_provider(UsbmuxdAddr::default(), "CordLauncher");
            let details = device_details(&provider).await;
            out.push(IphoneDevice {
                udid: d.udid.clone(),
                trusted: details.is_some(),
                name: details.as_ref().map(|(n, _)| n.clone()),
                ios_version: details.and_then(|(_, v)| v),
                connection,
            });
        }
        out.sort_by_key(|d| d.connection != "usb");
        Ok(out)
    })
    .await
}

// ── Installation ────────────────────────────────────────────────────────────

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct IphoneProgress<'a> {
    id: &'a str,
    /// downloading · signing · installing
    phase: &'a str,
    /// 0 → 1, ou -1 quand on ne sait pas.
    progress: f32,
}

/// Installe une app sur l'iPhone : soit depuis `ipa_url` (téléchargée), soit
/// depuis `ipa_path` (fichier .ipa local choisi par l'utilisateur — sert aux
/// apps en bêta fermée dont l'IPA n'est pas publique, comme Passcord).
#[tauri::command]
pub async fn iphone_sideload(
    app: AppHandle,
    state: State<'_, AppleState>,
    id: String,
    ipa_url: Option<String>,
    ipa_path: Option<String>,
    udid: String,
    name: Option<String>,
    device_name: Option<String>,
    build: Option<String>,
    asset: Option<String>,
) -> Result<(), String> {
    crate::apps::validate_id(&id)?;
    // Compte actif : sa session ouverte, sinon reconnexion avec le mot de passe mémorisé.
    let mut sessions = state.sessions.try_lock().map_err(|_| "Une opération Apple est déjà en cours.")?;
    let mut index = load_profiles();
    let email = index.active.clone().ok_or("Connecte d'abord un compte Apple.")?;
    let key = profile_key(&email);
    if !sessions.contains_key(&key) {
        let _ = app.emit(PROGRESS_EVENT, IphoneProgress { id: &id, phase: "account", progress: -1.0 });
        let password = saved_password(&email)
            .ok_or_else(|| format!("Reconnecte {email} : son mot de passe n'est pas mémorisé sur ce PC."))?;
        sessions.insert(key.clone(), login(&app, email.clone(), password).await?);
        state.connected.lock().unwrap().insert(key.clone());
    }
    index.upsert(&email);
    let _ = save_profiles(&index);

    // 1. IPA : fichier local fourni, sinon téléchargement. Le fichier local
    //    n'est jamais supprimé (il appartient à l'utilisateur).
    let (ipa, remove_after) = match (ipa_path, ipa_url) {
        (Some(path), _) => {
            let p = PathBuf::from(&path);
            if !p.is_file() || !path.to_ascii_lowercase().ends_with(".ipa") {
                return Err("Fichier .ipa introuvable.".into());
            }
            (p, false)
        }
        (None, Some(url)) => {
            let dest = std::env::temp_dir().join("CordLauncher").join(format!("{id}.ipa"));
            std::fs::create_dir_all(dest.parent().unwrap()).map_err(|e| e.to_string())?;
            let never = AtomicBool::new(false);
            let (a, i) = (app.clone(), id.clone());
            crate::apps::download(&url, None, &dest, &never, move |r, t| {
                let progress = if t > 0 { r as f32 / t as f32 } else { -1.0 };
                let _ = a.emit(PROGRESS_EVENT, IphoneProgress { id: &i, phase: "downloading", progress });
            })
            .await?;
            (dest, true)
        }
        (None, None) => return Err("Aucune app à installer : fournis une URL ou un fichier .ipa.".into()),
    };

    // 2 + 3. Signature et envoi, sur un fil dédié. Le compte y part et revient.
    let account = sessions.remove(&key).expect("session ouverte ci-dessus");
    let (app2, id2, ipa2, email2, udid2) = (app.clone(), id.clone(), ipa.clone(), email.clone(), udid.clone());
    let outcome = on_own_thread(move || async move {
        let r = sign_and_install(&app2, &id2, account, email2, ipa2, udid2).await;
        Ok(r)
    })
    .await;
    let result = match outcome {
        Ok((result, Some(account))) => { sessions.insert(key, account); result }
        Ok((result, None)) => { state.connected.lock().unwrap().remove(&key); result }
        Err(e) => { state.connected.lock().unwrap().remove(&key); Err(e) }
    };
    // Onglet iPhone : on note l'installation (et on garde l'IPA pour renouveler)
    // avant de supprimer le téléchargement temporaire.
    let result = result.map(|signed| {
        crate::iphone_apps::record(&id, name.as_deref().unwrap_or(&id), &udid, device_name, &email, &ipa, signed, build, asset);
    });
    if remove_after {
        let _ = std::fs::remove_file(&ipa);
    }
    result
}

async fn sign_and_install(
    app: &AppHandle,
    id: &str,
    mut account: AppleAccount,
    email: String,
    ipa: PathBuf,
    udid: String,
) -> (Result<crate::iphone_apps::SignedInfo, String>, Option<AppleAccount>) {
    let emit = |phase: &str, progress: f32| {
        let _ = app.emit(PROGRESS_EVENT, IphoneProgress { id, phase, progress });
    };
    // Étapes émises vers l'interface (chacune de 0 à 1, ou -1 si inconnue) :
    // preparing (équipe, appareil) → signing → installing.
    emit("preparing", -1.0);

    let session = match DeveloperSession::from_account(&mut account).await {
        Ok(s) => s,
        Err(e) => return (Err(short_error(e)), Some(account)),
    };

    let result = async {
        let mut mux = UsbmuxdConnection::default().await.map_err(short_error)?;
        let device = mux
            .get_device(&udid)
            .await
            .map_err(|_| "L'iPhone n'est plus connecté.".to_string())?;
        let provider = device.to_provider(UsbmuxdAddr::default(), "CordLauncher");

        let mut sideloader = SideloaderBuilder::<isideload::util::callbacks::MaxCertsCallbackBox>::new(session, email)
            .team_selection(TeamSelection::First)
            .max_certs_behavior(MaxCertsBehavior::Error)
            .machine_name("CordLauncher".to_string())
            .build();

        // `Sideloader::install_app` enchaîne tout mais ne rapporte que la
        // signature (0,1 → 0,5) : on refait ses étapes pour suivre aussi l'envoi.
        let info = IdeviceInfo::from_device(&provider).await.map_err(short_error)?;
        let team = sideloader.get_team().await.map_err(short_error)?;
        sideloader
            .get_dev_session()
            .ensure_device_registered(&team, &info.name, &info.udid, None)
            .await
            .map_err(short_error)?;
        emit("signing", 0.0);

        let app_for_cb = app.clone();
        let id_for_cb = id.to_string();
        let (signed, _special) = sideloader
            .sign_app(
                ipa,
                Some(team),
                false,
                Some(move |p: f32| {
                    let app = app_for_cb.clone();
                    let id = id_for_cb.clone();
                    async move {
                        let _ = app.emit(PROGRESS_EVENT, IphoneProgress { id: &id, phase: "signing", progress: (p / 0.5).min(0.95) });
                    }
                }),
            )
            .await
            .map_err(short_error)?;
        emit("signing", 1.0);
        let info = crate::iphone_apps::read_signed(&signed);

        emit("installing", 0.0);
        let installed = isideload::sideload::install::install_app(&provider, &signed, |pct: u64| {
            emit("installing", (pct as f32 / 100.0).min(1.0));
        })
        .await
        .map_err(short_error);
        let _ = std::fs::remove_dir_all(&signed);
        installed?;
        emit("done", 1.0);
        Ok(info)
    }
    .await;

    (result, Some(account))
}
