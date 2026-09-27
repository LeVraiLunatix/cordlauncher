// Copie le catalogue de CordLauncher (../public/apps.json) dans le service :
// servi à /api/catalog, il permet de publier une nouvelle version d'une app
// (ou de CordLauncher) sans redistribuer le launcher. Lancé par `npm run portal`.
const fs = require("node:fs");
const path = require("node:path");

const source = path.resolve(__dirname, "../../public/apps.json");
const target = path.resolve(__dirname, "../lib/catalog-apps.mjs");
const catalog = JSON.parse(fs.readFileSync(source, "utf8"));
delete catalog.$schema;
fs.writeFileSync(
  target,
  "// Catalogue de la suite — généré par scripts/sync-catalog.cjs depuis cordlauncher/public/apps.json, ne pas éditer.\n" +
    `export const CATALOG = ${JSON.stringify(catalog, null, 2)};\n`,
);
console.log(`lib/catalog-apps.mjs écrit (${catalog.apps.length} apps${catalog.launcher ? `, CordLauncher ${catalog.launcher.version}` : ""}).`);
