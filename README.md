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
  lib/installer/             État d'installation + pilote (simulé pour l'instant)
src-tauri/                   Coquille Rust (fenêtre sans bordure, instance unique)
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

`detect.uninstallKey` est le nom de la sous-clé
`HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\…` que crée
l'installateur : pour une app Tauri en NSIS, c'est son `productName`
(vérifié : `Drivecord`).

## Feuille de route

- [x] Setup Tauri 2 + React + TS + Tailwind, D.A. glass, composants de base
- [x] Écran principal, fiche, bibliothèque, réglages, animations (pilote simulé)
- [ ] Pilote Tauri : lecture du registre, téléchargement en flux + SHA-256,
      installation silencieuse, lancement, désinstallation
- [ ] Démarrage avec Windows (`tauri-plugin-autostart`), mise à jour de
      CordLauncher (`tauri-plugin-updater`), CSP stricte
