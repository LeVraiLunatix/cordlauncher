//! Session Cord distincte du compte Apple, conservée dans le coffre Windows.
//!
//! Le front ne voit jamais le jeton : il passe par `cord_request`, qui n'accepte
//! qu'une liste fermée de routes du Compte Cord et y ajoute le jeton du coffre.
use serde_json::Value;

const KEYRING_SERVICE: &str = "CordLauncher Cord Account";

/// Seule adresse acceptée pour le Compte Cord : la commande `cord_request`
/// est privilégiée (elle porte le jeton du coffre Windows), le frontend ne
/// doit donc pas pouvoir la rediriger vers un autre serveur.
const ALLOWED_SERVER: &str = "https://compte.cordsuite.app";

/// Routes du Compte Cord que l'interface a le droit d'appeler.
fn allowed(method: &str, path: &str) -> bool {
    matches!(
        (method, path),
        ("GET", "/api/me" | "/api/account" | "/api/sessions" | "/api/activity" | "/api/connected-apps" | "/api/suite" | "/api/admin/overview" | "/api/admin/beta" | "/api/beta/passcord" | "/api/hub" | "/api/notifications")
            | ("PATCH", "/api/me" | "/api/passcord/keys" | "/api/passkeys")
            | ("DELETE", "/api/me" | "/api/passcord/keys" | "/api/passkeys" | "/api/sessions" | "/api/connected-apps" | "/api/admin/beta/keys" | "/api/admin/beta/testers" | "/api/admin/beta/token" | "/api/notifications")
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
                    | "/api/passcord/notify"
                    | "/api/me/notify"
                    | "/api/passcord/poll"
                    | "/api/beta/redeem"
                    | "/api/beta/passcord/download"
                    | "/api/admin/beta/keys"
                    | "/api/admin/beta/token"
                    | "/api/me/app-status"
                    | "/api/notifications/read"
                    | "/api/email/verify-code"
            )
    )
}

/// Adresse du service : la seule valeur acceptée est le Compte Cord officiel
/// (`ALLOWED_SERVER`). Le frontend garde un réglage « Serveur » pour l'affichage
/// et le développement, mais `cord_request`/`cord_export` refusent toute
/// autre adresse — sinon le jeton du coffre Windows pourrait être envoyé à
/// un serveur choisi par une page compromise.
fn server_url(server: &str) -> Result<reqwest::Url, String> {
    if server.trim_end_matches('/') != ALLOWED_SERVER {
        return Err("Adresse du service Cord refusée : seul https://compte.cordsuite.app est autorisé.".into());
    }
    reqwest::Url::parse(ALLOWED_SERVER).map_err(|_| "Adresse du service Cord invalide.".to_string())
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
        return Err("Cette fonction demande une version plus récente de CordLauncher : mets-le à jour, puis réessaie.".into());
    }
    if query.as_deref().is_some_and(|q| !q.chars().all(|c| c.is_ascii_alphanumeric() || "=&_-.%".contains(c))) {
        return Err("Paramètres Cord invalides.".into());
    }
    let entry = keyring::Entry::new(KEYRING_SERVICE, url.as_str()).map_err(|e| e.to_string())?;
    url.set_path(&route);
    url.set_query(query.as_deref());
    let mut request = client()?.request(method.parse::<reqwest::Method>().map_err(|e| e.to_string())?, url);
    // Jeton effacé de la mémoire dès qu'on n'en a plus besoin (limitation :
    // `bearer_auth` et le corps HTTP en gardent forcément une copie le temps
    // de la requête, hors de notre contrôle).
    if let Ok(token) = entry.get_password() {
        let token = zeroize::Zeroizing::new(token);
        request = request.bearer_auth(token.as_str());
    }
    if let Some(body) = body {
        request = request.header("Content-Type", "application/json").body(body.to_string());
    }
    let response = request
        .send()
        .await
        .map_err(|e| { eprintln!("[cord] {server} : {e}"); "Impossible de joindre ton Compte Cord. Vérifie ta connexion Internet, puis réessaie.".to_string() })?;
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
            let token = zeroize::Zeroizing::new(token.to_string());
            entry.set_password(token.as_str()).map_err(|e| { eprintln!("[cord] coffre : {e}"); "Windows n’a pas pu garder ta session. Reconnecte-toi.".to_string() })?;
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
    let token = zeroize::Zeroizing::new(entry.get_password().map_err(|_| "Connecte-toi à ton compte Cord.")?);
    url.set_path("/api/account/export");
    let response = client()?
        .get(url)
        .bearer_auth(token.as_str())
        .send()
        .await
        .map_err(|e| { eprintln!("[cord] {e}"); "Impossible de joindre ton Compte Cord. Vérifie ta connexion Internet, puis réessaie.".to_string() })?;
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
