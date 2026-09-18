use std::time::Duration;

use tauri::Manager;

/// Délai au-delà duquel on affiche la fenêtre même si le front ne l'a pas
/// demandé. La fenêtre démarre cachée (`visible: false`) pour éviter le flash
/// blanc de WebView2 : c'est le front qui appelle `show()` après sa première
/// peinture. Si le JS plante avant, l'app ne doit pas rester invisible.
const SHOW_FALLBACK: Duration = Duration::from_secs(4);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    // Doit être enregistré en premier : une 2e instance ramène la 1re au
    // premier plan au lieu d'ouvrir une nouvelle fenêtre.
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(w) = app.get_webview_window("main") {
                let _ = w.unminimize();
                let _ = w.show();
                let _ = w.set_focus();
            }
        }));
    }

    builder
        .plugin(tauri_plugin_opener::init())
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
