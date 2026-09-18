<div align="center">

<img src="public/logos/cordsuite.png" alt="CordLauncher" width="112" height="112" />

# CordLauncher

**Le magasin d'applications de la suite [Cord](https://cordsuite.app), pour Windows.**

Installe, met à jour et lance toutes les apps Cord depuis une seule fenêtre —
sans droits administrateur, et jusque sur ton iPhone.

Tauri 2 · React 19 · TypeScript · Tailwind CSS 4 · Motion · Rust

</div>

---

## En bref

CordLauncher est une application Windows native, légère et soignée, qui joue
pour la suite Cord le rôle d'un mini App Store :

- **Découvrir** la suite — Drivecord, Passcord, et les apps à venir — dans une
  grille de cartes en verre animées.
- **Installer, mettre à jour et désinstaller** les apps Windows en un clic,
  dans le profil utilisateur (jamais d'invite administrateur).
- **Installer sur l'iPhone** par câble avec ton compte Apple, ou via AltStore.
- **Se connecter avec le Compte Cord**, l'identité commune de la suite, et en
  faire ta clé grâce à Passcord.

Toute l'interface suit une direction artistique « Liquid Glass » : fond dégradé
vivant, panneaux de verre flouté, reflets qui suivent le curseur,
micro-interactions partout.

## Démarrer

```bash
npm install
npm run app:dev      # fenêtre Tauri + serveur Vite (port 1430)
npm run app:build    # installateur NSIS (profil utilisateur, sans UAC)

npm run dev          # front seul dans un navigateur (installation simulée)
npm run typecheck    # tsc --noEmit
```

Prérequis : Node 24+, Rust stable (MSVC) et la charge « Développement Desktop
en C++ » de Visual Studio. Le premier `cargo build` prend quelques minutes
(le moteur d'installation iPhone est volumineux) ; les suivants sont rapides.

Paramètres d'URL utiles en développement navigateur :

| Paramètre | Effet |
| --- | --- |
| `?intro=0` | saute l'animation d'ouverture |
| `?scenario=fresh \| installed \| update` | état simulé de Drivecord sur le PC |

## Fonctionnalités

### Installation Windows

Tout se passe au niveau utilisateur, sans droits administrateur
(`src-tauri/src/apps.rs`) :

- **Détection** des apps déjà installées via le registre
  (`HKCU`/`HKLM\…\Uninstall\<clé>`), avec résolution de l'exécutable à lancer.
- **Téléchargement en flux** avec barre de progression, débit et temps
  restant, et **vérification SHA-256** de l'installateur avant exécution.
- **Choix du dossier** d'installation (une fenêtre le demande, avec un
  emplacement par défaut réglable) ; une mise à jour reste là où l'app est.
- **Installation silencieuse** (NSIS `/S /D=`, ou MSI `/qn`), **désinstallation**
  silencieuse, et **lancement** détaché de l'app.
- Les apps installées apparaissent dans la barre latérale : un clic les lance.

### Installation iPhone

iOS refuse toute app non signée par Apple ou par ton compte. CordLauncher
propose donc **trois** chemins, selon l'app :

1. **Depuis ce PC** (`src-tauri/src/sideload.rs`, moteur
   [`isideload`](https://github.com/nab138/isideload)) — branche un iPhone
   autorisé en USB, connecte ton compte Apple (code de validation demandé dans
   l'app), et CordLauncher télécharge l'IPA, la signe et l'installe par câble,
   façon Sideloadly. Le renouvellement (tous les 7 jours pour un compte gratuit)
   passe par le même compte.
2. **Choisir un fichier `.ipa`** — pour une app en bêta fermée dont l'IPA n'est
   pas publique (Passcord), tu télécharges son `.ipa` depuis tes releases, tu le
   choisis, et il est signé + installé comme ci-dessus.
3. **Avec AltStore** — CordLauncher affiche un QR code aux couleurs de l'app ;
   l'iPhone le scanne, **AltStore** télécharge l'IPA et la fait signer par
   **AltServer** (sur le PC), puis la re-signe seul chaque semaine. Ce mode
   conserve les droits de partage dont les extensions de Passcord ont besoin.

> Le mode direct demande un iPhone déverrouillé, l'autorisation « Se fier à cet
> ordinateur » et, selon la version d'iOS, le mode développeur activé. Le
> service Apple Mobile Device (installé avec iTunes ou « Appareils Apple ») doit
> être présent.

### Compte Cord

Une identité unique pour toute la suite, servie par le service autonome
`account-service` (voir plus bas). Depuis l'onglet **Compte** : création de
compte, connexion, confirmation d'email, et **association de Passcord** — ton
iPhone devient alors ta clé, et tu valides tes connexions avec Face ID.

## Architecture

```
src/
  styles.css                 D.A. « Liquid Glass » : tokens clair/sombre + utilitaires glass*
  App.tsx                    coquille : splash, navigation, vues, modales
  components/
    glass/                   briques réutilisables
      AnimatedGradientBackground  fond vivant (taches qui dérivent, parallaxe, grain)
      GlassCard                   vitre de base (reflet au curseur, inclinaison 3D)
      GlassButton                 primaire / verre / discret / danger, onde au clic
      GlassModal                  modale en verre épais (Échap, voile, pile de modales)
      GlassToggle · GlassSegmented · GlassProgress · Skeleton · Badge
    shell/                   barre de titre maison, barre latérale, ouverture, toasts
    apps/                    carte, bandeau « À la une », fiche, QR code, fenêtres iPhone
  views/                     Découvrir · Bibliothèque · Compte · Réglages
  lib/
    catalog/                 contrat + chargement du catalogue (apps.json)
    installer/               état d'installation + pilote (tauri-driver | mock-driver)
    apple.ts                 compte Apple, 2FA, installation iPhone
    iphone.ts                liens AltStore, état d'AltServer, fenêtre iPhone
    account.ts               session Compte Cord (coffre Windows)
    settings.ts              réglages persistés + autostart
src-tauri/
  src/apps.rs                moteur d'installation Windows (registre, DL+SHA-256, /S)
  src/sideload.rs            compte Apple + signature + installation iPhone
  src/iphone.rs              détection et lancement d'AltServer
  src/account.rs             relais HTTP vers le service Compte Cord
  vendor/isideload/          copie corrigée d'isideload (voir « Connexion Apple »)
account-service/             service OIDC du Compte Cord + portail + tests
public/apps.json             catalogue (maquette, embarquée dans l'exe)
public/apps.schema.json      schéma JSON du catalogue
```

### Le pilote d'installation

L'interface ne parle qu'à une interface, `InstallerDriver`
(`src/lib/installer/types.ts`). Deux implémentations :

- **`tauriDriver`** — le vrai, dans l'app Windows, relaie vers les commandes
  Rust ;
- **`mockDriver`** — simule tout quand le front tourne dans un navigateur
  (`npm run dev`), pour développer l'UI sans rien installer.

### Le piège du verre

Dans Chromium (donc WebView2), un ancêtre avec `opacity < 1`, `filter`,
`mask`, `clip-path` ou `backdrop-filter` devient la racine de fond de ses
descendants : leur `backdrop-filter` ne voit plus le fond de la fenêtre, et le
verre paraît plat. D'où la règle suivie partout : **on anime l'opacité des
vitres elles-mêmes, jamais d'un conteneur qui les englobe**. Les conteneurs de
vues (`viewVariants`) ne font que cadencer leurs enfants.

### Connexion Apple : le correctif isideload

`isideload` 0.3.17 annonce Xcode dans l'en-tête `X-Mme-Client-Info` ; le
serveur d'authentification Apple (`gsa.apple.com`) répond alors **503** à toute
requête (constaté le 2026-09-18, sur toutes les versions de Xcode testées).
On copie donc la bibliothèque dans `src-tauri/vendor/isideload/` et on annonce
le même Mac/macOS mais via **akd** (comme akd/AltServer) — accepté. Le patch
est branché par `[patch.crates-io]` dans `src-tauri/Cargo.toml`.

## Catalogue d'apps

Le launcher lit une liste d'apps au format JSON. Aujourd'hui c'est la maquette
`public/apps.json`, embarquée dans l'exe. Pour brancher une vraie API :

```bash
# .env.local
VITE_CATALOG_URL=https://cordsuite.app/api/apps.json
```

Ordre de repli : URL configurée → dernière copie valide en cache → maquette
embarquée. Une entrée mal formée est ignorée (avec un avertissement) sans faire
tomber l'écran.

> La fenêtre Tauri a pour origine `http://tauri.localhost` : soit l'API renvoie
> `Access-Control-Allow-Origin` pour cette origine, soit le téléchargement du
> catalogue passera par Rust.

### Forme attendue

Référence : `src/lib/catalog/types.ts` ; schéma de validation :
`public/apps.schema.json`.

```jsonc
{
  "schemaVersion": 1,
  "featured": "drivecord",                  // app du bandeau « À la une »
  "apps": [
    {
      "id": "drivecord",                    // requis
      "name": "Drivecord",                  // requis
      "description": "Une phrase pour la carte.",       // requis
      "status": "available",                // requis : available | closed-beta | coming-soon
      "iconGradient": ["#6D64F2", "#C64BF1"],           // requis : dégradé du logo
      "version": "0.2.0",
      "downloadUrl": "https://…/v0.2.0/Drivecord-Setup-x64.exe",  // figée sur la version
      "downloadSize": 4636975,
      "sha256": "60f13a44…",                // vérifié avant d'exécuter l'installateur
      "installer": { "type": "nsis", "silentArgs": ["/S"], "scope": "user" },
      "detect": { "uninstallKey": "Drivecord", "exe": "drivecord-desktop.exe" },
      "icon": "/logos/drivecord.png",
      "website": "https://drivecord.app",
      "changelog": [{ "version": "0.2.0", "date": "2026-09-16", "notes": ["…"] }],
      "ios": {
        "status": "available",              // available | closed-beta
        "version": "1.0.49",
        "ipaUrl": "https://…/v1.0.49/Drivecord.ipa",    // PUBLIQUE (téléchargée par l'iPhone / le PC)
        "altstoreSource": "https://…/source.json",       // mode « Ajouter la source »
        "minOS": "15.0"
      }
    }
  ]
}
```

`detect.uninstallKey` est le nom de la sous-clé
`HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\…` que crée
l'installateur : pour une app Tauri en NSIS, c'est son `productName`.

Le QR code AltStore est dessiné à la main (`components/apps/QrCode.tsx`, lib
`uqr`) : modules en carrés arrondis — des points ronds ne se décodent plus en
petit (vérifié au décodeur) — et niveau de correction Q pour loger le logo au
centre.

## Compte Cord (`account-service/`)

Service Node autonome (Node 24, `node:sqlite`, sans dépendance externe) qui
fournit l'identité commune de la suite :

- inscription mot de passe (scrypt), confirmation d'email, sessions ;
- **OIDC** (PKCE S256) pour « Continuer avec mon compte Cord » dans Drivecord ;
- **association Passcord** par clé Ed25519 : l'iPhone signe les demandes de
  connexion, validées par Face ID. Les clés privées ne quittent jamais le
  trousseau de l'iPhone, et le mot de passe du coffre Passcord n'est jamais
  envoyé au service.

Il refuse les redirections OAuth inconnues, impose PKCE, expire les codes et
empêche leur réutilisation, et n'accepte une connexion Passcord que si sa
signature est valide (`account-service/server.test.mjs`).

```bash
npm run account:dev    # http://127.0.0.1:4319 ; liens de confirmation dans le terminal
npm run account:test   # tests (node --test)
```

### Production — `https://compte.cordsuite.app`

- **Hébergement** : VPS Oracle (le même que Drivebot et Sona), process PM2
  `cord-account` lancé par `start.mjs` avec un Node 24 installé à part
  (`~/.local/node-v24.x`) pour ne pas toucher au Node 20 des autres bots.
  Base SQLite dans `~/cord-account/data/`.
- **HTTPS** : Caddy → `127.0.0.1:4319`, certificat Let's Encrypt automatique.
  Ports 80 et 443 à ouvrir dans le pare-feu de la machine **et** dans la liste
  de sécurité du réseau Oracle Cloud (console).
- **Config** : `~/cord-account/.env` (hors git) — `CORD_ISSUER`,
  `HOST=127.0.0.1`, `PORT`, `CORD_TRUST_PROXY=1` (IP réelle derrière Caddy),
  `CORD_DATABASE`, `CORD_CLIENTS`, `RESEND_API_KEY`, `CORD_MAIL_FROM`.
- **DNS** (Vercel) : `compte` A → IP du VPS ; domaine d'envoi `cordsuite.app`
  vérifié chez Resend (DKIM `resend._domainkey`, SPF sur `send`).
- **Déployer** : `bash account-service/deploy.sh` (tests → envoi des fichiers
  → redémarrage PM2).
- **Drivecord** : poser `AUTH_CORD_ISSUER`, `AUTH_CORD_ID`, `AUTH_CORD_SECRET`
  et `NEXT_PUBLIC_CORD_ACCOUNT_URL` dans ses variables Vercel.

## Feuille de route

- [x] Setup Tauri 2 + React + TS + Tailwind, D.A. Liquid Glass, composants
- [x] Découvrir · Bibliothèque · Réglages, fiche détaillée, animations
- [x] Moteur Windows réel : registre, téléchargement + SHA-256, choix du
      dossier, installation/désinstallation silencieuse, lancement
- [x] Installation iPhone : compte Apple par câble, fichier `.ipa` local, AltStore
- [x] Démarrage avec Windows (`tauri-plugin-autostart`)
- [x] Compte Cord (service OIDC + Passcord), déployé
- [ ] Mise à jour automatique de CordLauncher (`tauri-plugin-updater`)
- [ ] CSP stricte, signature de l'installateur

## Licence

Projet personnel de la suite Cord — tous droits réservés.
