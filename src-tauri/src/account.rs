//! Session Cord distincte du compte Apple, conservée dans le coffre Windows.
//!
//! Le front ne voit jamais le jeton : il passe par `cord_request`, qui n'accepte
//! qu'une liste fermée de routes du Compte Cord et y ajoute le jeton du coffre.
use serde_json::Value;

const KEYRING_SERVICE: &str = "CordLauncher Cord Account";

/// Routes du Compte Cord que l'interface a le droit d'appeler.
fn allowed(method: &str, path: &str) -> bool {
    matches!(
        (method, path),
        ("GET", "/api/me" | "/api/account" | "/api/sessions" | "/api/activity" | "/api/connected-apps" | "/api/suite" | "/api/admin/overview" | "/api/admin/beta" | "/api/beta/passcord")
            | ("PATCH", "/api/me" | "/api/passcord/keys" | "/api/passkeys")
            | ("DELETE", "/api/me" | "/api/passcord/keys" | "/api/passkeys" | "/api/sessions" | "/api/connected-apps" | "/api/admin/beta/keys" | "/api/admin/beta/testers")
            | (
                "POST",
                "/api/register"
                    | "/api/login"
                    | "/api/logout"
                    | "/api/email/send"
                    | "/api/email/change"
                    | "/api/password/forgot"
                    | "/api/security/password"
                    | "/api/security/totp"
                    | "/api/sessions/revoke-others"
                    | "/api/passcord/pair"
                    | "/api/passcord/pair/status"
                    | "/api/passcord/login"
                    | "/api/passcord/poll"
                    | "/api/beta/redeem"
                    | "/api/beta/passcord/download"
                    | "/api/admin/beta/keys"
            )
    )
}

/// Adresse du service, validée : origine HTTPS (ou localhost en dev), sans chemin.
fn server_url(server: &str) -> Result<reqwest::Url, String> {
    let base = reqwest::Url::parse(server).map_err(|_| "Adresse du service Cord invalide.")?;
    if !base.username().is_empty() || base.password().is_some() || base.query().is_some() || base.fragment().is_some() || base.path() != "/" {
        return Err("Utilise l’adresse du serveur sans chemin ni identifiants.".into());
    }
    let local = matches!(base.host_str(), Some("127.0.0.1" | "localhost" | "[::1]"));
    if base.scheme() != "https" && !(base.scheme() == "http" && local) {
        return Err("Le service Cord doit utiliser HTTPS.".into());
    }
    Ok(base)
}

fn client() -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        // Sans User-Agent, le Compte Cord afficherait « Appareil inconnu » dans les sessions.
        .user_agent(concat!("CordLauncher/", env!("CARGO_PKG_VERSION"), " (Windows)"))
        .redirect(reqwest::redirect::Policy::none())
        .timeout(std::time::Duration::from_secs(20))
        .build()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn cord_request(server: String, path: String, method: String, body: Option<Value>) -> Result<Value, String> {
    let mut url = server_url(&server)?;
    // Paramètres de requête autorisés (ex. /api/activity?before=…), le chemin seul est contrôlé.
    let (route, query) = match path.split_once('?') {
        Some((route, query)) => (route.to_string(), Some(query.to_string())),
        None => (path.clone(), None),
    };
    if !allowed(&method, &route) {
        return Err("Opération Cord inconnue.".into());
    }
    if query.as_deref().is_some_and(|q| !q.chars().all(|c| c.is_ascii_alphanumeric() || "=&_-.%".contains(c))) {
        return Err("Paramètres Cord invalides.".into());
    }
    let entry = keyring::Entry::new(KEYRING_SERVICE, url.as_str()).map_err(|e| e.to_string())?;
    url.set_path(&route);
    url.set_query(query.as_deref());
    let mut request = client()?.request(method.parse::<reqwest::Method>().map_err(|e| e.to_string())?, url);
    if let Ok(token) = entry.get_password() {
        request = request.bearer_auth(token);
    }
    if let Some(body) = body {
        request = request.header("Content-Type", "application/json").body(body.to_string());
    }
    let response = request
        .send()
        .await
        .map_err(|e| format!("Service Compte Cord injoignable ({server}) : {e}. Vérifie l’adresse dans « Serveur Compte Cord »."))?;
    let status = response.status();
    let text = response.text().await.map_err(|e| e.to_string())?;
    let mut data: Value = serde_json::from_str(&text).map_err(|_| "Le serveur ne renvoie pas une réponse Compte Cord valide.")?;
    if !status.is_success() {
        if status == reqwest::StatusCode::UNAUTHORIZED && route == "/api/me" && method == "GET" {
            // Pas (ou plus) connecté : ce n'est pas une erreur, juste « personne ».
            let _ = entry.delete_credential();
            return Ok(serde_json::json!({ "user": null, "keys": [] }));
        }
        let message = data.get("error").and_then(Value::as_str).unwrap_or("Erreur du service Cord.");
        // `reason` (ex. mfa_required) permet à l'interface d'adapter le formulaire.
        return Err(match data.get("reason").and_then(Value::as_str) {
            Some(reason) => format!("[{reason}] {message}"),
            None => message.to_string(),
        });
    }
    if matches!(route.as_str(), "/api/register" | "/api/login" | "/api/passcord/poll") {
        if let Some(token) = data.get("token").and_then(Value::as_str) {
            entry.set_password(token).map_err(|e| format!("Session non enregistrée dans le coffre Windows : {e}"))?;
        }
    }
    if let Some(object) = data.as_object_mut() {
        object.remove("token");
    }
    if route == "/api/logout" || (route == "/api/me" && method == "DELETE") {
        let _ = entry.delete_credential();
    }
    Ok(data)
}

/// Export RGPD : télécharge le JSON du compte dans le dossier Téléchargements
/// et renvoie le chemin du fichier.
#[tauri::command]
pub async fn cord_export(server: String) -> Result<String, String> {
    let mut url = server_url(&server)?;
    let entry = keyring::Entry::new(KEYRING_SERVICE, url.as_str()).map_err(|e| e.to_string())?;
    let token = entry.get_password().map_err(|_| "Connecte-toi à ton compte Cord.")?;
    url.set_path("/api/account/export");
    let response = client()?
        .get(url)
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| format!("Service Compte Cord injoignable : {e}"))?;
    if !response.status().is_success() {
        return Err("Export impossible : reconnecte-toi puis réessaie.".into());
    }
    let data: Value = response.json().await.map_err(|_| "Réponse d’export invalide.")?;
    let home = std::env::var_os("USERPROFILE").ok_or("Dossier utilisateur introuvable.")?;
    let dir = std::path::PathBuf::from(home).join("Downloads");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let date = data.get("exportedAt").and_then(Value::as_str).map(|s| s.chars().take(10).collect::<String>()).unwrap_or_else(|| "export".into());
    let file = dir.join(format!("compte-cord-{date}.json"));
    let pretty = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;
    std::fs::write(&file, pretty).map_err(|e| format!("Écriture impossible : {e}"))?;
    Ok(file.display().to_string())
}
