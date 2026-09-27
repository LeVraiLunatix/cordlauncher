use std::path::Path;

fn main() {
    // Version affichée : celle de CordLauncher (package.json à la racine).
    let pkg = std::fs::read_to_string("../../package.json").expect("package.json");
    let json: serde_json::Value = serde_json::from_str(&pkg).expect("package.json valide");
    println!("cargo:rustc-env=CORDLAUNCHER_VERSION={}", json["version"].as_str().unwrap_or("0.0.0"));
    println!("cargo:rerun-if-changed=../../package.json");

    // L'installateur NSIS de CordLauncher est embarqué (voir scripts/build-setup.cjs).
    // Absent en développement : un fichier vide, l'interface le signale.
    let payload = Path::new("../payload/CordLauncher-setup.exe");
    if !payload.exists() {
        std::fs::create_dir_all("../payload").ok();
        std::fs::write(payload, b"").ok();
    }
    println!("cargo:rerun-if-changed=../payload/CordLauncher-setup.exe");

    tauri_build::build()
}
