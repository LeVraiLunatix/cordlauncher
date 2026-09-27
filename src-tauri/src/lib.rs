use std::time::Duration;

use tauri::Manager;

mod apps;
mod account;
mod iphone;
mod sideload;
mod iphone_apps;

/// Délai au-delà duquel on affiche la fenêtre même si le front ne l'a pas
/// demandé. La fenêtre démarre cachée (`visible: false`) pour éviter le flash
/// blanc de WebView2 : c'est le front qui appelle `show()` après sa première
/// peinture. Si le JS plante avant, l'app ne doit pas rester invisible.
const SHOW_FALLBACK: Duration = Duration::from_secs(4);

/// Argument ajouté par le lancement automatique avec Windows.
const MINIMIZED_ARG: &str = "--minimized";

struct LaunchFlags {
    minimized: bool,
}

/// Le front demande s'il doit s'ouvrir réduit (lancement avec Windows).
#[tauri::command]
fn launch_minimized(flags: tauri::State<'_, LaunchFlags>) -> bool {
    flags.minimized
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if let Err(e) = isideload::init() {
        eprintln!("[iphone] rapports d'erreur isideload indisponibles : {e}");
    }

    let mut builder = tauri::Builder::default();

    // Doit être enregistré en premier : une 2e instance ramène la 1re au
    // premier plan au lieu d'ouvrir une nouvelle fenêtre.
    #[cfg(desktop)]
    {
        builder = builder
            .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.unminimize();
                    let _ = w.show();
                    let _ = w.set_focus();
                }
            }))
            .plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                Some(vec![MINIMIZED_ARG]),
            ));
    }

    builder
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(LaunchFlags {
            minimized: std::env::args().any(|a| a == MINIMIZED_ARG),
        })
        .manage(apps::AppsState::default())
        .manage(sideload::AppleState::default())
        .invoke_handler(tauri::generate_handler![
            launch_minimized,
            account::cord_request,
            account::cord_export,
            apps::apps_detect,
            apps::apps_default_dir,
            apps::app_install,
            apps::app_cancel,
            apps::app_uninstall,
            apps::app_launch,
            iphone::altserver_status,
            iphone::altserver_launch,
            sideload::apple_status,
            sideload::apple_login,
            sideload::apple_2fa_respond,
            sideload::apple_switch,
            sideload::apple_forget,
            sideload::apple_reset_device,
            sideload::iphone_list,
            sideload::iphone_sideload,
            iphone_apps::iphone_apps,
            iphone_apps::iphone_app_forget,
            iphone_apps::iphone_device_bundles,
            iphone_apps::iphone_app_adopt,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                std::thread::sleep(SHOW_FALLBACK);
                if let Some(w) = handle.get_webview_window("main") {
                    if !w.is_visible().unwrap_or(true) {
                        let _ = w.show();
                        let _ = w.set_focus();
                    }
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("erreur au lancement de CordLauncher");
}
