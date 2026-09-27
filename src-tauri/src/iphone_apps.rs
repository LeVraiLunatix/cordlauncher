//! Registre des apps installées sur iPhone par CordLauncher (onglet iPhone).
//!
//! Chaque installation réussie est notée dans
//! `%LOCALAPPDATA%\app.cordsuite.launcher\iphone-apps.json` : l'app, l'iPhone,
//! le compte Apple qui l'a signée et surtout la **date d'expiration** lue dans
//! le profil de provisionnement embarqué (7 jours avec un compte gratuit,
//! un an avec un compte développeur payant). Une copie de l'IPA est gardée
//! dans `ipas\` pour pouvoir **renouveler** la signature sans rien retélécharger.

use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;

use idevice::installation_proxy::InstallationProxyClient;
use idevice::usbmuxd::{UsbmuxdAddr, UsbmuxdConnection};
use idevice::IdeviceService;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct IphoneApp {
    /// Identifiant de l'app dans le catalogue (drivecord, passcord…).
    pub id: String,
    pub name: String,
    /// Identifiant réel sur l'iPhone (réécrit à la signature, ex. `com.lunatix.drivecord.ABCD1234`).
    pub bundle_id: Option<String>,
    pub version: Option<String>,
    pub udid: String,
    pub device_name: Option<String>,
    pub apple_email: String,
    /// Millisecondes depuis 1970.
    pub installed_at: u64,
    pub expires_at: Option<u64>,
    /// Copie locale de l'IPA, pour renouveler.
    pub ipa: Option<String>,
}

/// Ce qu'on lit dans l'app signée, avant qu'isideload ne la supprime.
#[derive(Default)]
pub struct SignedInfo {
    pub bundle_id: Option<String>,
    pub version: Option<String>,
    pub expires_at: Option<u64>,
}

fn base_dir() -> Option<PathBuf> {
    Some(PathBuf::from(std::env::var_os("LOCALAPPDATA")?).join("app.cordsuite.launcher"))
}
fn store_path() -> Option<PathBuf> {
    Some(base_dir()?.join("iphone-apps.json"))
}
fn now_ms() -> u64 {
    std::time::SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0)
}

pub fn load() -> Vec<IphoneApp> {
    store_path()
        .and_then(|p| std::fs::read(p).ok())
        .and_then(|bytes| serde_json::from_slice(&bytes).ok())
        .unwrap_or_default()
}

fn save(list: &[IphoneApp]) -> Result<(), String> {
    let path = store_path().ok_or("Dossier de CordLauncher introuvable.")?;
    std::fs::create_dir_all(path.parent().unwrap()).map_err(|e| e.to_string())?;
    std::fs::write(path, serde_json::to_vec_pretty(list).map_err(|e| e.to_string())?).map_err(|e| e.to_string())
}

/// Lit l'identifiant, la version et la date d'expiration dans l'app signée.
pub fn read_signed(app_dir: &Path) -> SignedInfo {
    let mut info = SignedInfo::default();
    if let Ok(plist::Value::Dictionary(d)) = plist::Value::from_file(app_dir.join("Info.plist")) {
        info.bundle_id = d.get("CFBundleIdentifier").and_then(|v| v.as_string()).map(str::to_string);
        info.version = d
            .get("CFBundleShortVersionString")
            .or_else(|| d.get("CFBundleVersion"))
            .and_then(|v| v.as_string())
            .map(str::to_string);
    }
    // embedded.mobileprovision = plist XML enveloppé dans une signature CMS :
    // on extrait le XML entre « <?xml » et « </plist> ».
    if let Ok(bytes) = std::fs::read(app_dir.join("embedded.mobileprovision")) {
        let start = bytes.windows(5).position(|w| w == b"<?xml");
        let end = bytes.windows(8).rposition(|w| w == b"</plist>");
        if let (Some(start), Some(end)) = (start, end) {
            if let Ok(plist::Value::Dictionary(d)) = plist::Value::from_reader_xml(&bytes[start..end + 8]) {
                info.expires_at = d
                    .get("ExpirationDate")
                    .and_then(|v| v.as_date())
                    .and_then(|date| std::time::SystemTime::from(date).duration_since(UNIX_EPOCH).ok())
                    .map(|d| d.as_millis() as u64);
            }
        }
    }
    info
}

/// Garde une copie de l'IPA (une par app : la dernière installée).
fn cache_ipa(id: &str, source: &Path) -> Option<String> {
    let dir = base_dir()?.join("ipas");
    std::fs::create_dir_all(&dir).ok()?;
    let dest = dir.join(format!("{id}.ipa"));
    if source != dest {
        std::fs::copy(source, &dest).ok()?;
    }
    Some(dest.to_string_lossy().into_owned())
}

/// Note une installation réussie (remplace la précédente pour la même app sur le même iPhone).
pub fn record(id: &str, name: &str, udid: &str, device_name: Option<String>, apple_email: &str, ipa: &Path, signed: SignedInfo) {
    let mut list = load();
    let previous = list.iter().position(|a| a.id == id && a.udid == udid);
    let entry = IphoneApp {
        id: id.to_string(),
        name: name.to_string(),
        bundle_id: signed.bundle_id,
        version: signed.version,
        udid: udid.to_string(),
        device_name: device_name.or_else(|| previous.and_then(|i| list[i].device_name.clone())),
        apple_email: apple_email.to_string(),
        installed_at: now_ms(),
        // Sans profil lisible : 7 jours, la durée d'un compte Apple gratuit.
        expires_at: signed.expires_at.or(Some(now_ms() + 7 * 24 * 3600 * 1000)),
        ipa: cache_ipa(id, ipa),
    };
    match previous {
        Some(i) => list[i] = entry,
        None => list.push(entry),
    }
    let _ = save(&list);
}

#[tauri::command]
pub fn iphone_apps() -> Vec<IphoneApp> {
    let mut list = load();
    list.sort_by_key(|a| a.expires_at.unwrap_or(u64::MAX));
    list
}

/// Oublie une app (elle reste sur l'iPhone ; on arrête juste de la suivre).
#[tauri::command]
pub fn iphone_app_forget(id: String, udid: String) -> Result<(), String> {
    let mut list = load();
    list.retain(|a| !(a.id == id && a.udid == udid));
    if !list.iter().any(|a| a.id == id) {
        if let Some(dir) = base_dir() {
            let _ = std::fs::remove_file(dir.join("ipas").join(format!("{id}.ipa")));
        }
    }
    save(&list)
}

/// Identifiants des apps réellement présentes sur l'iPhone (pour repérer celles qu'on a supprimées).
#[tauri::command]
pub async fn iphone_device_bundles(udid: String) -> Result<Vec<String>, String> {
    crate::sideload::on_own_thread(move || async move {
        let mut mux = UsbmuxdConnection::default().await.map_err(|e| e.to_string())?;
        let device = mux.get_device(&udid).await.map_err(|_| "L'iPhone n'est pas branché.".to_string())?;
        let provider = device.to_provider(UsbmuxdAddr::default(), "CordLauncher");
        let mut proxy = InstallationProxyClient::connect(&provider).await.map_err(|e| e.to_string())?;
        let apps = proxy.get_apps(Some("User"), None).await.map_err(|e| e.to_string())?;
        Ok(apps.into_keys().collect())
    })
    .await
}
