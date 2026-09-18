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
use isideload::sideload::builder::MaxCertsBehavior;
use isideload::sideload::{SideloaderBuilder, TeamSelection};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::sync::oneshot;

const KEYRING_SERVICE: &str = "CordLauncher Apple ID";
const KEYRING_USER: &str = "account";
const TWO_FACTOR_EVENT: &str = "apple://2fa";
const PROGRESS_EVENT: &str = "iphone://progress";

#[derive(Default)]
pub struct AppleState {
    /// Session ouverte (connexion faite pendant cette exécution).
    account: tokio::sync::Mutex<Option<AppleAccount>>,
    email: Mutex<Option<String>>,
    /// Réponse attendue par la 2FA en cours.
    pending_2fa: Mutex<Option<oneshot::Sender<TwoFactorCallbackResponse>>>,
}

#[derive(Serialize, Deserialize)]
struct SavedCredentials {
    email: String,
    password: String,
}

fn saved_credentials() -> Option<SavedCredentials> {
    let entry = keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER).ok()?;
    serde_json::from_str(&entry.get_password().ok()?).ok()
}

/// Premier paragraphe d'une erreur isideload (les rapports complets sont
/// très bavards) ; le détail part dans la console.
fn short_error(e: impl std::fmt::Display + std::fmt::Debug) -> String {
    let full = e.to_string();
    let debug = format!("{e:?}");
    eprintln!("[iphone] {full}\n[iphone details] {debug}");
    let detail = if debug != full { debug } else { full.clone() };
    detail.lines().filter(|line| !line.trim().is_empty()).take(3).map(str::trim).collect::<Vec<_>>().join(" — ")
}

/// Exécute un futur non-`Send` sur un fil dédié et rend son résultat.
async fn on_own_thread<F, Fut, T>(make: F) -> Result<T, String>
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
pub struct AppleStatus {
    email: Option<String>,
    /// Session ouverte dans cette exécution de CordLauncher.
    connected: bool,
    /// Identifiants gardés dans le coffre Windows (reconnexion automatique).
    remembered: bool,
}

#[tauri::command]
pub async fn apple_status(state: State<'_, AppleState>) -> Result<AppleStatus, String> {
    let connected = state.account.lock().await.is_some();
    let saved = saved_credentials();
    let email = state.email.lock().unwrap().clone().or_else(|| saved.as_ref().map(|c| c.email.clone()));
    Ok(AppleStatus { email, connected, remembered: saved.is_some() })
}

/// Connexion. La 2FA arrive dans l'interface par l'évènement `apple://2fa` ;
/// la réponse revient par `apple_2fa_respond`.
async fn login(app: &AppHandle, email: String, password: String) -> Result<AppleAccount, String> {
    let app = app.clone();
    on_own_thread(move || async move {
        isideload::auth::builder::AppleAccountBuilder::new(&email)
            .login(&password, move |params: TwoFactorCallbackParams| {
                let app = app.clone();
                async move {
                    let (tx, rx) = oneshot::channel();
                    *app.state::<AppleState>().pending_2fa.lock().unwrap() = Some(tx);
                    let _ = app.emit(TWO_FACTOR_EVENT, &params);
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
    let mut guard = state.account.try_lock().map_err(|_| "Une opération Apple est déjà en cours.")?;
    let email = email.trim().to_string();
    let account = login(&app, email.clone(), password.clone()).await?;
    *guard = Some(account);
    *state.email.lock().unwrap() = Some(email.clone());

    let entry = keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER).map_err(|e| e.to_string())?;
    if remember {
        let json = serde_json::to_string(&SavedCredentials { email: email.clone(), password }).map_err(|e| e.to_string())?;
        entry.set_password(&json).map_err(|e| format!("Coffre Windows inaccessible : {e}"))?;
    } else {
        let _ = entry.delete_credential();
    }
    Ok(AppleStatus { email: Some(email), connected: true, remembered: remember })
}

#[tauri::command]
pub fn apple_2fa_respond(state: State<'_, AppleState>, response: TwoFactorCallbackResponse) -> Result<(), String> {
    let sender = state.pending_2fa.lock().unwrap().take().ok_or("Aucune vérification en attente.")?;
    sender.send(response).map_err(|_| "La vérification a expiré.".to_string())
}

#[tauri::command]
pub async fn apple_logout(state: State<'_, AppleState>) -> Result<(), String> {
    *state.account.lock().await = None;
    *state.email.lock().unwrap() = None;
    if let Ok(entry) = keyring::Entry::new(KEYRING_SERVICE, KEYRING_USER) {
        let _ = entry.delete_credential();
    }
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

#[tauri::command]
pub async fn iphone_sideload(
    app: AppHandle,
    state: State<'_, AppleState>,
    id: String,
    ipa_url: String,
    udid: String,
) -> Result<(), String> {
    crate::apps::validate_id(&id)?;
    // Session : celle ouverte, sinon reconnexion avec les identifiants gardés.
    let mut guard = state.account.try_lock().map_err(|_| "Une opération Apple est déjà en cours.")?;
    if guard.is_none() {
        let saved = saved_credentials().ok_or("Connecte d'abord ton compte Apple.")?;
        *guard = Some(login(&app, saved.email.clone(), saved.password).await?);
        *state.email.lock().unwrap() = Some(saved.email);
    }
    let email = state.email.lock().unwrap().clone().unwrap_or_default();

    // 1. IPA
    let ipa = std::env::temp_dir().join("CordLauncher").join(format!("{id}.ipa"));
    std::fs::create_dir_all(ipa.parent().unwrap()).map_err(|e| e.to_string())?;
    let never = AtomicBool::new(false);
    crate::apps::download(&ipa_url, None, &ipa, &never, |r, t| {
        let progress = if t > 0 { r as f32 / t as f32 } else { -1.0 };
        let _ = app.emit(PROGRESS_EVENT, IphoneProgress { id: &id, phase: "downloading", progress });
    })
    .await?;

    // 2 + 3. Signature et envoi, sur un fil dédié. Le compte y part et revient.
    let account = guard.take().expect("session ouverte ci-dessus");
    let (app2, id2, ipa2) = (app.clone(), id.clone(), ipa.clone());
    let (result, account) = on_own_thread(move || async move {
        let r = sign_and_install(&app2, &id2, account, email, ipa2, udid).await;
        Ok(r)
    })
    .await?;
    *guard = account;
    let _ = std::fs::remove_file(&ipa);
    result
}

async fn sign_and_install(
    app: &AppHandle,
    id: &str,
    mut account: AppleAccount,
    email: String,
    ipa: PathBuf,
    udid: String,
) -> (Result<(), String>, Option<AppleAccount>) {
    let emit = |phase: &str, progress: f32| {
        let _ = app.emit(PROGRESS_EVENT, IphoneProgress { id, phase, progress });
    };
    emit("signing", -1.0);

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

        let mut sideloader = SideloaderBuilder::new(session, email)
            .team_selection(TeamSelection::First)
            .max_certs_behavior(MaxCertsBehavior::Error)
            .machine_name("CordLauncher".to_string())
            .build();

        let app_for_cb = app.clone();
        let id_for_cb = id.to_string();
        sideloader
            .install_app(
                &provider,
                ipa,
                false,
                Some(move |p: f32| {
                    let app = app_for_cb.clone();
                    let id = id_for_cb.clone();
                    async move {
                        // La signature finit vers 100 % ; l'envoi suit sans progression fine.
                        let phase = if p >= 1.0 { "installing" } else { "signing" };
                        let _ = app.emit(
                            PROGRESS_EVENT,
                            IphoneProgress { id: &id, phase, progress: if p >= 1.0 { -1.0 } else { p } },
                        );
                    }
                }),
            )
            .await
            .map(|_| ())
            .map_err(short_error)
    }
    .await;

    (result, Some(account))
}
