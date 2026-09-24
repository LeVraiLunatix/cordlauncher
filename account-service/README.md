# Compte Cord (`account-service/`)

L'identité commune de la suite Cord : fournisseur OIDC (Drivecord…), portail de
gestion de compte et clé de connexion Passcord. Déployé sur
**https://compte.cordsuite.app** (Vercel, projet `cord-account`, Postgres Neon).

```bash
npm install
npm run dev      # http://127.0.0.1:4319 — PGlite, liens d'email dans le terminal
npm test         # node --test : server.test.mjs (contrat historique) + features.test.mjs
npm run portal   # régénère lib/portal.mjs depuis portal/ — OBLIGATOIRE après toute édition du portail
vercel deploy --prod
```

> Passkeys en local : WebAuthn refuse une adresse IP comme domaine. Lance avec
> `CORD_ISSUER=http://localhost:4319` et ouvre `http://localhost:4319`.
> Le serveur de dev ne recharge pas le portail : relance-le après `npm run portal`.

## Architecture

```
lib/service.mjs   Routeur + logique (agnostique du moteur SQL). createService({ sql, issuer, clients,
                  sendMail, oidcKey, admins, dataKey }) -> { handle }
lib/webauthn.mjs  Passkeys sans dépendance : CBOR, authenticatorData, COSE -> JWK, vérification.
lib/totp.mjs      TOTP RFC 6238 (anti-rejeu par pas de temps) + codes de secours hachés.
lib/vault.mjs     AES-256-GCM pour les secrets 2FA (clé HKDF de CORD_DATA_KEY puis CORD_OIDC_KEY).
lib/mail.mjs      Gabarits d'emails HTML + texte (D.A. Liquid Glass).
lib/catalog.mjs   Les apps de la suite (reprises de cordsuite/src/lib/products.ts, qui fait foi).
lib/ua.mjs        Description d'appareil depuis le User-Agent.
lib/portal.mjs    GÉNÉRÉ : portail embarqué en chaînes (aucun fichier source exposé).
portal/           Sources du portail : index.html, styles/*.css, src/*.js (concaténés dans l'ordre),
                  vendor/qrcode.js (MIT), icons/*.svg (Lucide, ISC), assets/ (polices OFL, logos).
```

Le portail est du HTML/CSS/JS **sans framework ni CDN**, compatible CSP stricte
(`script-src 'self'`, `style-src 'self'`) : aucune balise ou attribut `style`
en ligne — les valeurs dynamiques passent par le CSSOM (`hydrate()`), le rendu
par des gabarits qui échappent toute interpolation (`html\`…\``). i18n FR/EN
(`messages()` + `t()`), thème clair/sombre, routage par ancre
(`#apercu`, `#securite`, `#appareils`, `#apps`, `#profil`, `#activite`,
`#confidentialite`, `#admin`).

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `CORD_ISSUER` | Origine publique (`https://compte.cordsuite.app`) — aussi l'identifiant WebAuthn (rpId). |
| `CORD_OIDC_KEY` | Clé RSA de signature (PEM ou base64). **Ne jamais la régénérer.** |
| `CORD_CLIENTS` | Clients OAuth : `{"drivecord":{"name","secret","redirectUris":[…]}}`. |
| `DATABASE_URL` | Neon (posée par l'intégration Vercel). |
| `RESEND_API_KEY`, `CORD_MAIL_FROM` | Envoi des emails. |
| `CORD_ADMINS` | *(optionnel)* emails (séparés par des virgules) qui voient `#admin`. |
| `CORD_DATA_KEY` | *(optionnel)* clé dédiée au chiffrement des secrets 2FA. Peut être ajoutée plus tard : les anciens secrets restent lisibles via la clé OIDC. |

## API

Contrat historique inchangé (voir `server.test.mjs`). Seul ajout visible par les
clients existants : si la **2FA** est active, `POST /api/login` répond
`401 { error, reason: "mfa_required" }` ; renvoyer la requête avec `otp`
(code TOTP ou code de secours). CordLauncher et Passcord le gèrent.

| Domaine | Routes |
| --- | --- |
| Compte | `GET /api/account` (tout le tableau de bord en une requête), `PATCH /api/me` (`name`, `theme`, `locale`, `alerts`, `avatar` data-URL ou `null`), `GET /avatar/:id` |
| Email | `POST /api/email/change` {email, password}, `POST /api/email/change/confirm` {token} |
| Récupération | `POST /api/password/forgot` {email}, `POST /api/password/reset/check` {token}, `POST /api/password/reset` {token, password, otp?} |
| Sécurité | `POST /api/security/password` {current, password}, `POST /api/security/totp` {action: setup / enable / disable / regenerate, code} |
| Passkeys | `POST /api/passkeys/register/options`, `POST /api/passkeys/register`, `PATCH`/`DELETE /api/passkeys`, `POST /api/passkeys/login/options`, `POST /api/passkeys/login` |
| Sessions | `GET /api/sessions`, `DELETE /api/sessions` {id}, `POST /api/sessions/revoke-others` |
| Passcord | + `PATCH /api/passcord/keys` {id, name}, `POST /api/passcord/pair/status` {id} |
| Apps | `GET`/`DELETE /api/connected-apps`, `GET /api/authorize/context`, `POST /api/authorize/deny`, `GET /api/suite` |
| Données | `GET /api/activity?before=`, `GET /api/account/export` (JSON, sans aucun secret) |
| Admin | `GET /api/admin/overview` (réservé à `CORD_ADMINS`, email vérifié) |

## Sécurité — ce qui a été ajouté

- **2FA TOTP** : secret chiffré au repos, code rejoué refusé (dernier pas mémorisé,
  mise à jour atomique), 10 codes de secours hachés à usage unique, 10 essais / 10 min / compte.
- **Passkeys** : attestation « none », vérification d'origine, de défi (usage unique),
  du rpIdHash, des drapeaux UP + UV, de la signature et du compteur.
- **Mot de passe oublié** : réponse identique que le compte existe ou non, lien unique
  de 30 min, 2FA exigée si active, toutes les sessions fermées.
- **Changement de mot de passe / d'email** : mot de passe actuel exigé, sauf connexion
  forte récente (Passcord, passkey, lien de réinitialisation < 15 min).
- **Journal d'activité** (180 jours) et **alerte email** à la première connexion depuis
  un nouvel appareil ; alertes systématiques sur mot de passe, email, 2FA, passkey.
- **Apps connectées** : consentement enregistré, révocation qui invalide les jetons de l'app.
- Suppression du compte : cascade sur toutes les tables (dont celles ajoutées).
