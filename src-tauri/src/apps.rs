//! Moteur d'installation Windows des apps de la suite.
//!
//! Tout se fait au niveau utilisateur (HKCU, profil), sans droits admin :
//!  - détection : clé `Uninstall\<nom>` que crée l'installateur ;
//!  - installation : téléchargement en flux + SHA-256, puis installateur en
//!    mode silencieux (`/S`), dans le dossier choisi (`/D=`) ;
//!  - désinstallation : `UninstallString /S`, puis on attend que la clé
//!    disparaisse (l'uninstall.exe NSIS se recopie dans %TEMP% et rend la
//!    main tout de suite : attendre le processus ne suffit pas) ;
//!  - lancement : l'exe trouvé dans le registre.
//!
//! Vérifié sur l'installateur NSIS de Tauri (Drivecord) : `/D=` n'est
//! écrasé que si aucun dossier n'est imposé, et le mode silencieux ferme
//! l'app si elle tourne encore.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tauri::{AppHandle, Emitter, State};
use tokio::io::AsyncWriteExt;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

const PROGRESS_EVENT: &str = "apps://progress";
const INSTALL_TIMEOUT: Duration = Duration::from_secs(10 * 60);
const UNINSTALL_TIMEOUT: Duration = Duration::from_secs(2 * 60);

/// Opérations annulables en cours (par id d'app).
#[derive(Default)]
pub struct AppsState {
    cancels: Mutex<HashMap<String, Arc<AtomicBool>>>,
}

// ── Registre ────────────────────────────────────────────────────────────────

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DetectRequest {
    id: String,
    uninstall_key: String,
    exe: Option<String>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Installed {
    version: String,
    location: Option<String>,
    exe: Option<String>,
}

struct UninstallEntry {
    version: String,
    location: Option<String>,
    display_icon: Option<String>,
    main_binary: Option<String>,
    uninstall_string: Option<String>,
}

/// Les valeurs Tauri sont entourées de guillemets (`"D:\Logiciels\Drivecord"`).
fn unquote(s: &str) -> String {
    s.trim().trim_matches('"').to_string()
}

#[cfg(windows)]
fn read_uninstall_entry(key: &str) -> Option<UninstallEntry> {
    use winreg::enums::{HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE};
    use winreg::RegKey;

    const BASES: [&str; 2] = [
        r"Software\Microsoft\Windows\CurrentVersion\Uninstall",
        r"Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
    ];
    for hive in [HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE] {
        for base in BASES {
            let Ok(k) = RegKey::predef(hive).open_subkey(format!(r"{base}\{key}")) else {
                continue;
            };
            let get = |name: &str| -> Option<String> {
                k.get_value::<String, _>(name)
                    .ok()
                    .map(|v| unquote(&v))
                    .filter(|v| !v.is_empty())
            };
            let Some(version) = get("DisplayVersion") else { continue };
            return Some(UninstallEntry {
                version,
                location: get("InstallLocation"),
                display_icon: get("DisplayIcon"),
                main_binary: get("MainBinaryName"),
                uninstall_string: k.get_value::<String, _>("UninstallString").ok(),
            });
        }
    }
    None
}

#[cfg(not(windows))]
fn read_uninstall_entry(_key: &str) -> Option<UninstallEntry> {
    None
}

/// Exe à lancer : celui du catalogue dans le dossier d'installation, sinon
/// celui que l'installateur a noté, sinon l'icône (qui pointe sur l'exe).
fn resolve_exe(entry: &UninstallEntry, catalog_exe: Option<&str>) -> Option<String> {
    let in_location = |name: &str| {
        entry
            .location
            .as_ref()
            .map(|dir| Path::new(dir).join(name))
            .filter(|p| p.is_file())
            .map(|p| p.to_string_lossy().into_owned())
    };
    catalog_exe
        .and_then(in_location)
        .or_else(|| entry.main_binary.as_deref().and_then(in_location))
        .or_else(|| {
            entry
                .display_icon
                .as_ref()
                // « chemin.exe,0 » : on retire l'index d'icône.
                .map(|icon| icon_path(icon))
                .filter(|p| p.to_ascii_lowercase().ends_with(".exe") && Path::new(p).is_file())
        })
}

fn icon_path(icon: &str) -> String {
    let trimmed = icon.trim();
    let path = trimmed.rsplit_once(',')
        .filter(|(_, index)| index.trim().parse::<i32>().is_ok())
        .map_or(trimmed, |(path, _)| path);
    unquote(path)
}

pub(crate) fn validate_id(id: &str) -> Result<(), String> {
    if id.is_empty() || id.len() > 80 || !id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_') {
        return Err("Identifiant d’app invalide.".into());
    }
    Ok(())
}

fn installed_from_registry(key: &str, catalog_exe: Option<&str>) -> Option<Installed> {
    let entry = read_uninstall_entry(key)?;
    Some(Installed {
        exe: resolve_exe(&entry, catalog_exe),
        version: entry.version,
        location: entry.location,
    })
}

#[tauri::command(async)]
pub fn apps_detect(apps: Vec<DetectRequest>) -> HashMap<String, Option<Installed>> {
    apps.into_iter()
        .map(|a| {
            let found = installed_from_registry(&a.uninstall_key, a.exe.as_deref());
            (a.id, found)
        })
        .collect()
}

/// Dossier racine par défaut des apps (chaque installateur ajoute son nom).
#[tauri::command]
pub fn apps_default_dir() -> Option<String> {
    std::env::var("LOCALAPPDATA").ok()
}

// ── Installation ────────────────────────────────────────────────────────────

#[derive(Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct InstallRequest {
    id: String,
    url: String,
    sha256: Option<String>,
    size: Option<u64>,
    installer_type: String,
    silent_args: Option<Vec<String>>,
    /// Dossier final de l'app. `None` = celui que choisit l'installateur.
    install_dir: Option<String>,
    desktop_shortcut: bool,
    uninstall_key: String,
    exe: Option<String>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Progress<'a> {
    id: &'a str,
    phase: &'a str,
    received: u64,
    total: u64,
}

fn emit(app: &AppHandle, id: &str, phase: &str, received: u64, total: u64) {
    let _ = app.emit(PROGRESS_EVENT, Progress { id, phase, received, total });
}

fn downloads_dir() -> Result<PathBuf, String> {
    let dir = std::env::temp_dir().join("CordLauncher");
    std::fs::create_dir_all(&dir).map_err(|e| format!("Dossier temporaire inaccessible : {e}"))?;
    Ok(dir)
}

/// Télécharge `url` dans `dest` en calculant le SHA-256 au fil de l'eau.
/// `on_progress(reçu, total)` est appelé au plus toutes les 100 ms.
/// Renvoie l'empreinte hexadécimale.
pub(crate) async fn download(
    url: &str,
    expected_size: Option<u64>,
    dest: &Path,
    cancel: &AtomicBool,
    on_progress: impl Fn(u64, u64),
) -> Result<String, String> {
    if !url.starts_with("https://") {
        return Err("Adresse de téléchargement refusée : HTTPS obligatoire.".into());
    }
    let client = reqwest::Client::builder()
        .https_only(true)
        .connect_timeout(Duration::from_secs(30))
        .timeout(Duration::from_secs(20 * 60))
        .user_agent(concat!("CordLauncher/", env!("CARGO_PKG_VERSION")))
        .build()
        .map_err(|e| e.to_string())?;
    let res = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Téléchargement impossible : {e}"))?;
    if !res.status().is_success() {
        return Err(format!("Le serveur a répondu {}.", res.status()));
    }
    let total = res.content_length().or(expected_size).unwrap_or(0);

    let mut file = tokio::fs::File::create(dest)
        .await
        .map_err(|e| format!("Écriture impossible : {e}"))?;
    let mut hasher = Sha256::new();
    let mut received: u64 = 0;
    let mut last_emit = Instant::now() - Duration::from_secs(1);
    let mut stream = res.bytes_stream();

    while let Some(chunk) = stream.next().await {
        if cancel.load(Ordering::Relaxed) {
            drop(file);
            let _ = tokio::fs::remove_file(dest).await;
            return Err("__cancelled__".into());
        }
        let chunk = chunk.map_err(|e| format!("Connexion interrompue : {e}"))?;
        hasher.update(&chunk);
        file.write_all(&chunk).await.map_err(|e| format!("Écriture impossible : {e}"))?;
        received += chunk.len() as u64;
        if last_emit.elapsed() >= Duration::from_millis(100) {
            on_progress(received, total);
            last_emit = Instant::now();
        }
    }
    file.flush().await.map_err(|e| e.to_string())?;
    on_progress(received, total.max(received));
    Ok(hex::encode(hasher.finalize()))
}

fn run_installer(path: &Path, req: &InstallRequest) -> Result<i32, String> {
    let mut cmd = if req.installer_type == "msi" {
        let mut c = std::process::Command::new("msiexec");
        c.arg("/i").arg(path).arg("/qn").arg("/norestart");
        if let Some(dir) = &req.install_dir { c.arg(format!("INSTALLDIR={dir}")); }
        c
    } else {
        let mut c = std::process::Command::new(path);
        let default_args = vec!["/S".to_string()];
        c.args(req.silent_args.as_ref().unwrap_or(&default_args));
        if req.installer_type == "nsis" {
            if !req.desktop_shortcut {
                c.arg("/NS");
            }
            if let Some(dir) = &req.install_dir {
                // NSIS exige `/D=` en DERNIER et SANS guillemets, même avec
                // des espaces : `arg()` en ajouterait, d'où `raw_arg`.
                #[cfg(windows)]
                c.raw_arg(format!("/D={dir}"));
            }
        }
        c
    };
    let mut child = cmd.spawn().map_err(|e| {
        if e.raw_os_error() == Some(740) {
            "Cet installateur demande des droits administrateur, ce que CordLauncher ne fait pas.".to_string()
        } else {
            format!("Impossible de lancer l'installateur : {e}")
        }
    })?;

    let started = Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(status)) => return Ok(status.code().unwrap_or(-1)),
            Ok(None) if started.elapsed() > INSTALL_TIMEOUT => {
                let _ = child.kill();
                return Err("L'installateur ne répond plus (plus de 10 minutes).".into());
            }
            Ok(None) => std::thread::sleep(Duration::from_millis(250)),
            Err(e) => return Err(e.to_string()),
        }
    }
}

#[tauri::command]
pub async fn app_install(
    app: AppHandle,
    state: State<'_, AppsState>,
    req: InstallRequest,
) -> Result<Installed, String> {
    validate_id(&req.id)?;
    if !matches!(req.installer_type.as_str(), "nsis" | "msi" | "exe") {
        return Err("Type d’installateur non pris en charge.".into());
    }
    if let Some(dir) = &req.install_dir {
        if !Path::new(dir).is_absolute() {
            return Err("Le dossier d'installation doit être un chemin complet.".into());
        }
        if dir.contains('"') {
            return Err("Le dossier d'installation contient un caractère interdit (\").".into());
        }
    }

    let cancel = Arc::new(AtomicBool::new(false));
    {
        let mut jobs = state.cancels.lock().unwrap();
        if jobs.contains_key(&req.id) { return Err("Une installation est déjà en cours pour cette app.".into()); }
        jobs.insert(req.id.clone(), cancel.clone());
    }
    let result = install_inner(&app, &req, &cancel).await;
    state.cancels.lock().unwrap().remove(&req.id);
    result
}

async fn install_inner(app: &AppHandle, req: &InstallRequest, cancel: &AtomicBool) -> Result<Installed, String> {
    let extension = if req.installer_type == "msi" { "msi" } else { "exe" };
    let file = downloads_dir()?.join(format!("{}-setup.{extension}", req.id));
    let digest = download(&req.url, req.size, &file, cancel, |r, t| emit(app, &req.id, "downloading", r, t)).await?;

    emit(app, &req.id, "verifying", 0, 0);
    if let Some(expected) = &req.sha256 {
        if !digest.eq_ignore_ascii_case(expected.trim()) {
            let _ = std::fs::remove_file(&file);
            return Err("Le fichier téléchargé ne correspond pas à l'empreinte attendue (SHA-256) : installation annulée.".into());
        }
    }
    if cancel.load(Ordering::Relaxed) {
        let _ = std::fs::remove_file(&file);
        return Err("__cancelled__".into());
    }

    emit(app, &req.id, "installing", 0, 0);
    let (path, owned) = (file.clone(), req.clone());
    let code = tokio::task::spawn_blocking(move || run_installer(&path, &owned))
        .await
        .map_err(|e| e.to_string())??;
    let _ = std::fs::remove_file(&file);

    if code != 0 && !(req.installer_type == "msi" && matches!(code, 1641 | 3010)) {
        return Err(format!("L'installateur s'est arrêté avec le code {code}."));
    }
    installed_from_registry(&req.uninstall_key, req.exe.as_deref())
        .ok_or_else(|| "L'installateur a fini, mais l'app n'apparaît pas dans Windows.".into())
}

#[tauri::command]
pub fn app_cancel(state: State<'_, AppsState>, id: String) {
    if let Some(flag) = state.cancels.lock().unwrap().get(&id) {
        flag.store(true, Ordering::Relaxed);
    }
}

// ── Désinstallation / lancement ─────────────────────────────────────────────

#[tauri::command(async)]
pub fn app_uninstall(uninstall_key: String) -> Result<(), String> {
    let entry = read_uninstall_entry(&uninstall_key).ok_or("Cette app n'est plus installée.")?;
    let raw = entry.uninstall_string.ok_or("Windows ne connaît pas de désinstalleur pour cette app.")?;

    let mut cmd = if raw.to_ascii_lowercase().contains("msiexec") {
        // « MsiExec.exe /I{GUID} » : on désinstalle le même produit, sans fenêtre.
        let guid = raw
            .find('{')
            .and_then(|i| raw[i..].find('}').map(|j| raw[i..=i + j].to_string()))
            .ok_or("Désinstalleur MSI illisible.")?;
        let mut c = std::process::Command::new("msiexec");
        c.arg("/x").arg(guid).arg("/qn").arg("/norestart");
        c
    } else {
        let exe = if raw.trim_start().starts_with('"') {
            raw.trim_start().trim_start_matches('"').split('"').next().unwrap_or("").to_string()
        } else {
            raw.split_whitespace().next().unwrap_or("").to_string()
        };
        let mut c = std::process::Command::new(exe);
        c.arg("/S");
        c
    };
    cmd.spawn().map_err(|e| format!("Impossible de lancer le désinstalleur : {e}"))?;

    let started = Instant::now();
    while read_uninstall_entry(&uninstall_key).is_some() {
        if started.elapsed() > UNINSTALL_TIMEOUT {
            return Err("La désinstallation n'a pas abouti (délai dépassé).".into());
        }
        std::thread::sleep(Duration::from_millis(400));
    }
    Ok(())
}

#[tauri::command(async)]
pub fn app_launch(exe: String) -> Result<(), String> {
    let path = Path::new(&exe);
    if !path.is_file() || !exe.to_ascii_lowercase().ends_with(".exe") {
        return Err("L'exécutable de l'app est introuvable.".into());
    }
    let mut cmd = std::process::Command::new(path);
    if let Some(dir) = path.parent() {
        cmd.current_dir(dir);
    }
    // Détaché : l'app vit sa vie même si CordLauncher se ferme.
    #[cfg(windows)]
    cmd.creation_flags(0x0000_0008 /* DETACHED_PROCESS */ | 0x0000_0200 /* CREATE_NEW_PROCESS_GROUP */);
    cmd.spawn().map(|_| ()).map_err(|e| format!("Lancement impossible : {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn handles_windows_icon_paths() {
        assert_eq!(icon_path(r#""D:\Mes Apps\Drivecord.exe",0"#), r"D:\Mes Apps\Drivecord.exe");
        assert_eq!(icon_path(r#""D:\Apps, perso\Drivecord.exe""#), r"D:\Apps, perso\Drivecord.exe");
    }
    #[test]
    fn prevents_temp_path_traversal() {
        assert!(validate_id("drivecord-desktop").is_ok());
        for id in ["", "..", "../setup", "a\\b", "C:setup", "a/b"] { assert!(validate_id(id).is_err()); }
    }
}
