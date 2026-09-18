//! AltServer, côté PC, pour l'installation sur iPhone.
//!
//! CordLauncher n'installe pas lui-même sur l'iPhone : c'est AltStore (sur le
//! téléphone) qui télécharge l'IPA et la fait signer par AltServer (sur ce
//! PC). Ici on se contente de dire si AltServer tourne, et de le lancer.
//!
//! Pourquoi pas le registre : l'installateur MSI d'AltServer ne renseigne pas
//! `InstallLocation` (vérifié sur la 1.8, installée hors de Program Files).
//! Le raccourci du menu Démarrer, lui, est toujours là et sait où est l'exe.

use std::path::PathBuf;
use std::process::Command;

use serde::Serialize;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

/// Pas de fenêtre console qui clignote à chaque sondage.
#[cfg(windows)]
const CREATE_NO_WINDOW: u32 = 0x0800_0000;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AltServerStatus {
    installed: bool,
    running: bool,
}

fn is_running() -> bool {
    let mut cmd = Command::new("tasklist");
    cmd.args(["/FI", "IMAGENAME eq AltServer.exe", "/NH", "/FO", "CSV"]);
    #[cfg(windows)]
    cmd.creation_flags(CREATE_NO_WINDOW);
    // Sortie localisée (« Information : aucune tâche… ») : on cherche
    // seulement le nom de l'image, présent uniquement s'il y a un processus.
    cmd.output()
        .map(|o| String::from_utf8_lossy(&o.stdout).to_ascii_lowercase().contains("altserver.exe"))
        .unwrap_or(false)
}

/// De quoi lancer AltServer : son raccourci du menu Démarrer, sinon l'exe
/// aux emplacements habituels.
fn launch_target() -> Option<PathBuf> {
    let mut candidates = Vec::new();
    for (var, rel) in [
        ("APPDATA", r"Microsoft\Windows\Start Menu\Programs\AltServer.lnk"),
        ("APPDATA", r"Microsoft\Windows\Start Menu\Programs\AltServer\AltServer.lnk"),
        ("ProgramData", r"Microsoft\Windows\Start Menu\Programs\AltServer.lnk"),
        ("ProgramData", r"Microsoft\Windows\Start Menu\Programs\AltServer\AltServer.lnk"),
        ("ProgramFiles(x86)", r"AltServer\AltServer.exe"),
        ("ProgramFiles", r"AltServer\AltServer.exe"),
        ("LOCALAPPDATA", r"Programs\AltServer\AltServer.exe"),
    ] {
        if let Some(base) = std::env::var_os(var) {
            candidates.push(PathBuf::from(base).join(rel));
        }
    }
    candidates.into_iter().find(|p| p.exists())
}

/// `async` : `tasklist` prend ~100 ms, pas question de bloquer le thread
/// principal (et donc l'interface) toutes les 3 s.
#[tauri::command(async)]
pub fn altserver_status() -> AltServerStatus {
    let running = is_running();
    AltServerStatus {
        running,
        installed: running || launch_target().is_some(),
    }
}

#[tauri::command(async)]
pub fn altserver_launch() -> Result<(), String> {
    let target = launch_target().ok_or_else(|| "AltServer est introuvable sur ce PC.".to_string())?;
    // Ouvre le raccourci comme un double-clic : Windows résout la cible.
    tauri_plugin_opener::open_path(&target, None::<&str>).map_err(|e| e.to_string())
}
