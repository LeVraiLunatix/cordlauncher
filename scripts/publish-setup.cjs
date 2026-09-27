// Publie l'installateur fabriqué par `npm run setup:build` :
//   1. release v<version> sur le dépôt public LeVraiLunatix/cordlauncher-releases,
//      fichier « CordLauncher-Setup.exe » (lien stable …/releases/latest/download/…) ;
//   2. met à jour `launcher` dans public/apps.json (version, URL figée, SHA-256) ;
//   3. recopie le catalogue dans le Compte Cord (reste à déployer : vercel deploy --prod).
// Usage : npm run setup:publish -- "Notes de version"
const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const REPO = "LeVraiLunatix/cordlauncher-releases";
const ASSET = "CordLauncher-Setup.exe";
const root = path.resolve(__dirname, "..");
const { version } = require(path.join(root, "package.json"));
const notes = process.argv.slice(2).join(" ").trim() || `CordLauncher ${version}.`;

const built = path.join(root, "dist-setup", `Installer CordLauncher ${version}.exe`);
if (!fs.existsSync(built)) throw new Error(`${built} introuvable : lance d'abord npm run setup:build`);
const staged = path.join(os.tmpdir(), ASSET);
fs.copyFileSync(built, staged);
const bytes = fs.readFileSync(staged);
const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");

const tag = `v${version}`;
const gh = (...args) => execFileSync("gh", args, { stdio: "inherit" });
const notesFile = path.join(os.tmpdir(), `cordlauncher-${version}-notes.md`);
fs.writeFileSync(notesFile, `${notes}\n\n**[⬇ Télécharger l'installateur](https://github.com/${REPO}/releases/download/${tag}/${ASSET})** — Windows 10 et 11, sans droits administrateur.\n\nSHA-256 : \`${sha256}\`\n`);
gh("release", "create", tag, staged, "--repo", REPO, "--title", `CordLauncher ${version}`, "--notes-file", notesFile, "--latest");

const catalogPath = path.join(root, "public/apps.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
catalog.launcher = { version, url: `https://github.com/${REPO}/releases/download/${tag}/${ASSET}`, sha256, notes };
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
execFileSync("node", ["scripts/sync-catalog.cjs"], { cwd: path.join(root, "account-service"), stdio: "inherit" });
console.log(`\n✓ ${tag} publiée (${(bytes.length / 1048576).toFixed(1)} Mo). Déploie le Compte Cord pour l'annoncer : cd account-service && vercel deploy --prod`);
