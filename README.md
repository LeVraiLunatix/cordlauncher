# CordLauncher

Hub d'installation Windows de la suite Cord : une sorte de mini App Store qui
installe, met à jour et lance les apps de [cordsuite.app](https://cordsuite.app),
sans droits administrateur.

**Stack** : Tauri 2 (Rust) · React 19 + TypeScript · Tailwind CSS 4 ·
Motion (ex-Framer Motion) · Lucide.

## Lancer

```bash
npm install
npm run app:dev      # fenêtre Tauri + Vite (port 1430)
npm run dev          # front seul, dans un navigateur
npm run app:build    # installateur NSIS (profil utilisateur, sans UAC)
```

Paramètres d'URL utiles en dev (navigateur) :

- `?intro=0` : saute l'animation d'ouverture ;
- `?scenario=update` / `installed` / `fresh` : état simulé de Drivecord sur le PC.

## Structure

```
src/
  styles.css                 D.A. « Liquid Glass » : tokens clair/sombre + utilitaires glass*
  components/glass/          Briques réutilisables
    AnimatedGradientBackground   fond vivant (taches qui dérivent, parallaxe, grain)
    GlassCard                    vitre de base (reflet qui suit le curseur, inclinaison 3D)
    GlassButton                  primaire / verre / discret / danger, onde au clic
    GlassModal                   modale en verre épais (Échap, voile, pile de modales)
    GlassToggle, GlassSegmented, GlassProgress, Skeleton, Badge
  components/shell/          Barre de titre maison, barre latérale, ouverture, toasts
  components/apps/           Carte, bandeau « À la une », fiche détaillée, actions
  views/                     Découvrir · Bibliothèque · Réglages
  lib/catalog/               Contrat + chargement du catalogue (apps.json)
  lib/installer/             État d'installation + pilote Windows ou simulé
  lib/account.ts             Session Compte Cord dans le coffre Windows
  lib/apple.ts               Compte Apple, 2FA et installation iPhone par câble
  views/AccountView.tsx      Compte Cord + association Passcord
src-tauri/                   Coquille Rust (fenêtre sans bordure, instance unique)
account-service/             Service OIDC du Compte Cord + portail + tests
public/apps.json             Maquette du catalogue
public/apps.schema.json      Schéma JSON du catalogue
```

### Le piège du verre

Dans Chromium (donc WebView2), un ancêtre avec `opacity < 1`, `filter`,
`mask`, `clip-path` ou `backdrop-filter` coupe le flou de ses descendants :
leur `backdrop-filter` ne voit plus le fond de la fenêtre. D'où la règle
suivie partout : **on anime l'opacité des vitres elles-mêmes, jamais d'un
conteneur qui les englobe**. Les conteneurs de vues (`viewVariants`) ne font
que cadencer leurs enfants.

## Compte Cord

Le service autonome `account-service` fournit une identité commune pour la suite : mot de passe, confirmation d'email, sessions dans le coffre Windows, OIDC PKCE pour Drivecord et association Passcord par clé Ed25519. Les clés privées restent dans le trousseau de l'iPhone et le mot de passe Passcord n'est jamais envoyé au service.

En développement :

```bash
npm run account:dev   # http://127.0.0.1:4319 ; les liens de confirmation s'affichent dans le terminal
```

### Production : `https://compte.cordsuite.app`

- **Hébergement** : VPS Oracle (`ubuntu@141.253.108.13`, le même que Drivebot
  et Sona), process PM2 `cord-account` lancé par `start.mjs` avec un Node 24
  installé à part (`~/.local/node-v24.21.0`) — le Node 20 du système sert
  aux autres bots. Base SQLite dans `~/cord-account/data/`.
- **HTTPS** : Caddy (`/etc/caddy/Caddyfile`) → `127.0.0.1:4319`, certificat
  Let's Encrypt automatique. Il faut les ports 80 et 443 ouverts dans le
  pare-feu de la machine (fait, persistant) ET dans la liste de sécurité du
  réseau Oracle Cloud (console Oracle).
- **Configuration** : `~/cord-account/.env` sur le VPS (jamais dans git) —
  `CORD_ISSUER`, `HOST=127.0.0.1`, `PORT`, `CORD_TRUST_PROXY=1` (IP réelle via
  Caddy), `CORD_DATABASE`, `CORD_CLIENTS` (client `drivecord` et ses URI de
  retour), `RESEND_API_KEY`, `CORD_MAIL_FROM`.
- **DNS** (Vercel) : `compte` A → IP du VPS ; domaine d'envoi `cordsuite.app`
  vérifié chez Resend (DKIM `resend._domainkey`, SPF sur `send`).
- **Déployer une nouvelle version** : `bash account-service/deploy.sh`
  (tests, envoi des fichiers, redémarrage PM2).
- **Drivecord** : `AUTH_CORD_ISSUER`, `AUTH_CORD_ID`, `AUTH_CORD_SECRET` et
  `NEXT_PUBLIC_CORD_ACCOUNT_URL` dans ses variables Vercel ; valeurs dans
  `account-service/.env.drivecord.local` (ignoré par git).

Le service refuse les redirections OAuth inconnues, impose PKCE S256, expire les codes, empêche leur réutilisation et ne permet pas à Passcord d'approuver une connexion sans signature de sa clé privée.

## Catalogue d'apps

Le launcher lit une liste d'apps au format JSON. Aujourd'hui c'est la
maquette `public/apps.json`, embarquée dans l'exe. Pour brancher la vraie API :

```bash
# .env.local
VITE_CATALOG_URL=https://cordsuite.app/api/apps.json
```

Ordre de repli : URL configurée → dernière copie valide en cache → maquette
embarquée. Une entrée mal formée est ignorée (avec un avertissement), elle ne
fait pas tomber l'écran.

> Côté API : la fenêtre Tauri a pour origine `http://tauri.localhost`. Soit la
> route renvoie `Access-Control-Allow-Origin` pour cette origine, soit le
> téléchargement du catalogue passe par Rust (prévu avec le vrai pilote).

### Forme attendue

Référence : `src/lib/catalog/types.ts` (et `public/apps.schema.json` pour
valider côté serveur).

```jsonc
{
  "schemaVersion": 1,
  "featured": "drivecord",               // app du bandeau « À la une »
  "apps": [
    {
      "id": "drivecord",                 // requis
      "name": "Drivecord",               // requis
      "tagline": "Stockage sans limite",
      "description": "Une phrase pour la carte.",           // requis
      "longDescription": "Le texte de la fiche.",
      "status": "available",             // requis : available | closed-beta | coming-soon
      "version": "0.2.0",
      "releaseDate": "2026-09-16",
      "downloadUrl": "https://…/v0.2.0/Drivecord-Setup-x64.exe",  // figée sur la version
      "downloadSize": 4636975,
      "sha256": "60f13a44…",             // vérifié avant d'exécuter l'installateur
      "installer": { "type": "nsis", "silentArgs": ["/S"], "scope": "user" },
      "detect": { "uninstallKey": "Drivecord", "exe": "drivecord-desktop.exe" },
      "icon": "/logos/drivecord.png",    // relatif = résolu contre l'URL du catalogue
      "iconGradient": ["#6D64F2", "#C64BF1"],               // requis
      "website": "https://drivecord.app",
      "requirements": "Windows 10 et 11, 64 bits",
      "highlights": ["…"],
      "changelog": [{ "version": "0.2.0", "date": "2026-09-16", "notes": ["…"] }],
      "screenshots": [{ "src": "/screenshots/drivecord-1.png", "caption": "…" }]
    },
    {
      "id": "passcord",
      "name": "Passcord",
      "description": "…",
      "status": "closed-beta",
      "betaUrl": "https://cordsuite.app/bientot/passcord",
      "iconGradient": ["#126A84", "#1CC3E0"]
    }
  ]
}
```

### Version iPhone (`ios`)

iOS refuse une app qui n'est pas signée par Apple ou par le compte de
l'utilisateur. CordLauncher propose donc deux modes :

- **Depuis ce PC** : connecte un iPhone autorisé par USB, renseigne le compte
  Apple dans Réglages, puis CordLauncher télécharge l'IPA, la signe et
  l'installe. Le renouvellement utilise le même compte Apple.
- **Avec AltStore** : CordLauncher affiche un QR code que l'iPhone scanne ;
  **AltStore** télécharge l'IPA et la fait signer par **AltServer** (sur le
  PC), puis la re-signe seul tous les 7 jours. Ce mode conserve les droits de
  partage dont Passcord a besoin.

Le mode direct nécessite un iPhone déverrouillé, l'autorisation « Faire
  confiance » et, selon la version d'iOS, le mode développeur activé.

```jsonc
"ios": {
  "status": "available",           // available | closed-beta
  "version": "1.0.49",
  "bundleId": "com.lunatix.drivecord",
  "ipaUrl": "https://…/v1.0.49/Drivecord.ipa",   // PUBLIQUE : c'est l'iPhone qui la télécharge
  "ipaSize": 947714,
  "altstoreSource": "https://…/source.json",     // mode « Ajouter la source » (mises à jour)
  "minOS": "15.0",
  "guideUrl": "https://drivecord.app/install"
}
```

- `altstore://install?url=<ipa>` installe tout de suite ;
  `altstore://source?url=<source>` ajoute la source (AltStore propose ensuite
  chaque mise à jour).
- Le QR est dessiné à la main (`components/apps/QrCode.tsx`, lib `uqr`) :
  modules en carrés arrondis — des points ronds ne se décodent plus en petit
  (vérifié au décodeur) — niveau de correction Q pour le logo central.
- Côté PC, `altserver_status` / `altserver_launch` (Rust, `src-tauri/src/iphone.rs`)
  disent si AltServer tourne et le lancent via son raccourci du menu Démarrer
  (son MSI ne renseigne pas le dossier d'installation).
- Pour ouvrir une app en bêta fermée sur iPhone (Passcord) : publier ses IPA à
  une adresse publique (comme `drivecord-releases`), puis remplir `ipaUrl` /
  `altstoreSource` et passer `status` à `available`.

`detect.uninstallKey` est le nom de la sous-clé
`HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\…` que crée
l'installateur : pour une app Tauri en NSIS, c'est son `productName`
(vérifié : `Drivecord`).

## Feuille de route

- [x] Setup Tauri 2 + React + TS + Tailwind, D.A. glass, composants de base
- [x] Écran principal, fiche, bibliothèque, réglages, animations (pilote simulé)
- [x] Pilote Tauri : registre Windows, téléchargement en flux + SHA-256,
      choix du dossier, installation silencieuse, lancement, désinstallation
- [x] Démarrage avec Windows (`tauri-plugin-autostart`) et installation iPhone
- [ ] Mise à jour de CordLauncher (`tauri-plugin-updater`) et CSP stricte
