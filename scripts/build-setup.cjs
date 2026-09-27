// Fabrique « Installer CordLauncher <version>.exe », l'installateur à distribuer :
//   1. build de CordLauncher (installateur NSIS, par utilisateur, sans admin) ;
//   2. ce NSIS est embarqué dans l'installateur maison (installer/payload) ;
//   3. build de l'installateur maison (fenêtre aux couleurs de la suite) ;
//   4. copie dans dist-setup/ + empreinte SHA-256 (pour le catalogue).
// Usage : npm run setup:build   (ajouter --skip-app pour réutiliser le NSIS déjà construit)
const { execSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const { version } = require(path.join(root, "package.json"));
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: "inherit" });

if (!process.argv.includes("--skip-app")) {
  console.log(`\n▸ CordLauncher ${version} : build de l'application…`);
  run("npx tauri build");
}

const nsisDir = path.join(root, "src-tauri/target/release/bundle/nsis");
const nsis = fs.readdirSync(nsisDir).find((f) => f.endsWith("-setup.exe") && f.includes(version));
if (!nsis) throw new Error(`Installateur NSIS ${version} introuvable dans ${nsisDir}`);
fs.mkdirSync(path.join(root, "installer/payload"), { recursive: true });
fs.copyFileSync(path.join(nsisDir, nsis), path.join(root, "installer/payload/CordLauncher-setup.exe"));
console.log(`\n▸ ${nsis} embarqué.`);

console.log("\n▸ Build de l'installateur…");
run("npx tauri build", path.join(root, "installer"));

const built = path.join(root, "installer/src-tauri/target/release/cordlauncher-setup.exe");
const outDir = path.join(root, "dist-setup");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `Installer CordLauncher ${version}.exe`);
fs.copyFileSync(built, out);
const sha256 = crypto.createHash("sha256").update(fs.readFileSync(out)).digest("hex");
const size = fs.statSync(out).size;
console.log(`\n✓ ${path.relative(root, out)} (${(size / 1048576).toFixed(1)} Mo)\n  sha256 ${sha256}`);
