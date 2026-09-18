// Pas de console en plus de la fenêtre en release — NE PAS RETIRER.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    cordlauncher_lib::run()
}
