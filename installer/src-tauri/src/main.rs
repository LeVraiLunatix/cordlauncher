//! Installateur de CordLauncher : une petite fenêtre aux couleurs de la suite
//! qui embarque l'installateur NSIS de CordLauncher, l'exécute en silence
//! (installation par utilisateur, sans droits administrateur) en montrant une
//! vraie progression, puis lance CordLauncher. Tout le reste (compte Cord,
//! dossier des apps, compte Apple) se règle à l'accueil de CordLauncher.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{Duration, Instant};

use serde::Serialize;
use tauri::{AppHandle, Emitter};

static PAYLOAD: &[u8] = include_bytes!("../../payload/CordLauncher-setup.exe");
const VERSION: &str = env!("CORDLAUNCHER_VERSION");
const PRODUCT: &str = "CordLauncher";
const UNINSTALL_KEY: &str = r"Software\Microsoft\Windows\CurrentVersion\Uninstall\CordLauncher";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SetupInfo {
    version: String,
    default_dir: String,
    /// Dossier de l'installation existante (mise à jour).
    installed_dir: Option<String>,
    installed_version: Option<String>,
    /// Faux si l'installateur a été compilé sans CordLauncher dedans.
    ready: bool,
}

fn local_app_data() -> PathBuf {
    std::env::var_os("LOCALAPPDATA").map(PathBuf::from).unwrap_or_else(std::env::temp_dir)
}

fn existing_install() -> Option<(String, Option<String>)> {
    use winreg::enums::HKEY_CURRENT_USER;
    let key = winreg::RegKey::predef(HKEY_CURRENT_USER).open_subkey(UNINSTALL_KEY).ok()?;
    let location: String = key.get_value("InstallLocation").ok().or_else(|| {
        // Certaines versions de l'installateur n'écrivent que l'icône : on en déduit le dossier.
        let icon: String = key.get_value("DisplayIcon").ok()?;
        Path::new(icon.trim_matches('"')).parent().map(|p| p.to_string_lossy().into_owned())
    })?;
    let version: Option<String> = key.get_value("DisplayVersion").ok();
    Some((location.trim_matches('"').to_string(), version))
}

#[tauri::command]
fn setup_info() -> SetupInfo {
    let installed = existing_install();
    SetupInfo {
        version: VERSION.to_string(),
        default_dir: local_app_data().join(PRODUCT).to_string_lossy().into_owned(),
        installed_dir: installed.as_ref().map(|(dir, _)| dir.clone()),
        installed_version: installed.and_then(|(_, v)| v),
        ready: !PAYLOAD.is_empty(),
    }
}

#[derive(Serialize, Clone)]
struct Progress {
    value: f64,
    stage: &'static str,
}

fn find_exe(dir: &Path) -> Option<PathBuf> {
    for name in ["CordLauncher.exe", "cordlauncher.exe"] {
        let path = dir.join(name);
        if path.exists() {
            return Some(path);
        }
    }
    None
}

/// Installe (ou met à jour) CordLauncher dans `dir`. Renvoie le chemin de l'exe.
#[tauri::command]
async fn install(app: AppHandle, dir: String, shortcut: bool) -> Result<String, String> {
    let dir = dir.trim().trim_end_matches(['\\', '/']).to_string();
    if !Path::new(&dir).is_absolute() || dir.contains('"') {
        return Err("Choisis un dossier complet, par exemple C:\\Users\\toi\\AppData\\Local\\CordLauncher.".into());
    }
    if PAYLOAD.is_empty() {
        return Err("Cet installateur est incomplet. Télécharge-le de nouveau depuis cordsuite.app.".into());
    }
    tauri::async_runtime::spawn_blocking(move || run_setup(&app, &dir, shortcut))
        .await
        .map_err(|_| "L’installation s’est interrompue.".to_string())?
}

fn run_setup(app: &AppHandle, dir: &str, shortcut: bool) -> Result<String, String> {
    let emit = |value: f64, stage: &'static str| {
        let _ = app.emit("setup://progress", Progress { value, stage });
    };
    emit(0.02, "Préparation");
    let setup = std::env::temp_dir().join(format!("CordLauncher-{VERSION}-setup.exe"));
    std::fs::write(&setup, PAYLOAD).map_err(|_| "Impossible de préparer l’installation : vérifie qu’il reste de la place sur le disque.".to_string())?;

    let mut command = Command::new(&setup);
    command.arg("/S");
    if !shortcut {
        command.arg("/NS");
    }
    // NSIS veut « /D= » en dernier, sans guillemets, même avec des espaces.
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        command.raw_arg(format!("/D={dir}"));
        command.creation_flags(0x0800_0000); // CREATE_NO_WINDOW
    }
    let mut child = command.spawn().map_err(|_| "Windows n’a pas pu lancer l’installation.".to_string())?;

    // L'installateur silencieux ne donne pas d'avancement : on approche 95 %
    // en douceur pendant qu'il travaille, puis on termine à son signal.
    let started = Instant::now();
    let status = loop {
        if let Some(status) = child.try_wait().map_err(|_| "L’installation ne répond plus.".to_string())? {
            break status;
        }
        let t = started.elapsed().as_secs_f64();
        let value = 0.05 + 0.9 * (1.0 - (-t / 5.0).exp());
        let stage = if value < 0.35 { "Copie des fichiers" } else if value < 0.8 { "Installation de CordLauncher" } else { "Finalisation" };
        emit(value, stage);
        if started.elapsed() > Duration::from_secs(300) {
            let _ = child.kill();
            return Err("L’installation prend trop de temps. Redémarre le PC puis réessaie.".into());
        }
        std::thread::sleep(Duration::from_millis(120));
    };
    let _ = std::fs::remove_file(&setup);
    if !status.success() {
        return Err(match status.code() {
            Some(2) => "Installation annulée.".into(),
            Some(code) => format!("L’installation n’a pas abouti (code {code}). Ferme CordLauncher s’il est ouvert, puis réessaie."),
            None => "L’installation n’a pas abouti.".into(),
        });
    }
    emit(1.0, "Terminé");
    find_exe(Path::new(dir))
        .map(|p| p.to_string_lossy().into_owned())
        .ok_or_else(|| "CordLauncher est installé, mais son exécutable est introuvable.".to_string())
}

/// Ouvre CordLauncher tout juste installé.
#[tauri::command]
fn launch(exe: String) -> Result<(), String> {
    let path = PathBuf::from(&exe);
    if path.file_name().and_then(|n| n.to_str()).map(|n| n.eq_ignore_ascii_case("cordlauncher.exe")) != Some(true) {
        return Err("Exécutable inattendu.".into());
    }
    Command::new(path).spawn().map(|_| ()).map_err(|_| "Impossible d’ouvrir CordLauncher.".to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![setup_info, install, launch])
        .run(tauri::generate_context!())
        .expect("installateur");
}
