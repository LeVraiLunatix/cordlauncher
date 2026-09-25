//! Session Cord distincte du compte Apple, conservée dans le coffre Windows.
use serde_json::Value;

#[tauri::command]
pub async fn cord_request(server: String, path: String, method: String, body: Option<Value>) -> Result<Value, String> {
    let mut base = reqwest::Url::parse(&server).map_err(|_| "Adresse du service Cord invalide.")?;
    if !base.username().is_empty() || base.password().is_some() || base.query().is_some() || base.fragment().is_some() || base.path() != "/" {
        return Err("Utilise l’adresse du serveur sans chemin ni identifiants.".into());
    }
    let local = matches!(base.host_str(), Some("127.0.0.1" | "localhost" | "[::1]"));
    if base.scheme() != "https" && !(base.scheme() == "http" && local) { return Err("Le service Cord doit utiliser HTTPS.".into()); }
    let allowed = matches!((method.as_str(), path.as_str()),
        ("GET", "/api/me") | ("PATCH", "/api/me") | ("DELETE", "/api/me") |
        ("POST", "/api/register" | "/api/login" | "/api/logout" | "/api/email/send" | "/api/passcord/pair" | "/api/passcord/login" | "/api/passcord/poll") |
        ("DELETE", "/api/passcord/keys"));
    if !allowed { return Err("Opération Cord inconnue.".into()); }
    let entry = keyring::Entry::new("CordLauncher Cord Account", base.as_str()).map_err(|e| e.to_string())?;
    base.set_path(&path);
    let client = reqwest::Client::builder().redirect(reqwest::redirect::Policy::none())
        .timeout(std::time::Duration::from_secs(20)).build().map_err(|e| e.to_string())?;
    let mut request = client.request(method.parse::<reqwest::Method>().map_err(|e| e.to_string())?, base);
    if let Ok(token) = entry.get_password() { request = request.bearer_auth(token); }
    if let Some(body) = body { request = request.header("Content-Type", "application/json").body(body.to_string()); }
    let response = request.send().await.map_err(|e| format!("Service Compte Cord injoignable ({server}) : {e}. Vérifie l’adresse dans « Serveur Compte Cord »."))?;
    let status = response.status();
    let text = response.text().await.map_err(|e| e.to_string())?;
    let mut data: Value = serde_json::from_str(&text).map_err(|_| "Le serveur ne renvoie pas une réponse Compte Cord valide.")?;
    if !status.is_success() {
        if status == reqwest::StatusCode::UNAUTHORIZED && path == "/api/me" { let _ = entry.delete_credential(); }
        let message = data.get("error").and_then(Value::as_str).unwrap_or("Erreur du service Cord.");
        // `reason` (ex. mfa_required) permet à l'interface d'adapter le formulaire.
        return Err(match data.get("reason").and_then(Value::as_str) {
            Some(reason) => format!("[{reason}] {message}"),
            None => message.to_string(),
        });
    }
    if matches!(path.as_str(), "/api/register" | "/api/login" | "/api/passcord/poll") {
        if let Some(token) = data.get("token").and_then(Value::as_str) {
            entry.set_password(token).map_err(|e| format!("Session non enregistrée dans le coffre Windows : {e}"))?;
        }
    }
    if let Some(object) = data.as_object_mut() { object.remove("token"); }
    if path == "/api/logout" { entry.delete_credential().map_err(|e| e.to_string())?; }
    Ok(data)
}
