// Construit lib/portal.mjs à partir des sources du portail (dossier portal/).
// Lancer depuis account-service/ : npm run portal
//
//   portal/index.html   gabarit ({{VERSION}}, {{ICONS}})
//   portal/styles/*.css concaténés dans l'ordre alphabétique -> /portal.css
//   portal/vendor/*.js  puis portal/src/*.js (ordre alphabétique) -> /portal.js
//   portal/icons/*.svg  icônes Lucide (ISC) -> sprite <symbol> injecté dans le HTML
//   portal/assets/**    polices, logos, icônes -> servis sous /assets/...
//
// Tout est embarqué en chaînes dans lib/portal.mjs : la fonction serverless
// sert le portail sans exposer aucun fichier source (outputDirectory: public).
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const dir = path.join(root, "portal");
const read = (...p) => fs.readFileSync(path.join(dir, ...p), "utf8");
const list = (sub, ext) => fs.readdirSync(path.join(dir, sub)).filter((f) => f.endsWith(ext)).sort();

// Icônes : on garde le contenu de chaque <svg> dans un <symbol>.
const icons = list("icons", ".svg")
  .map((file) => {
    const body = read("icons", file)
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/^[\s\S]*?<svg[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "")
      .replace(/\s*\n\s*/g, "");
    return `<symbol id="i-${file.slice(0, -4)}" viewBox="0 0 24 24">${body}</symbol>`;
  })
  .join("");
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true" focusable="false">${icons}</svg>`;

const css = list("styles", ".css").map((f) => `/* ${f} */\n${read("styles", f)}`).join("\n");
const js =
  "// Portail Compte Cord — généré par scripts/gen-portal.cjs, ne pas éditer.\n" +
  list("vendor", ".js").map((f) => `// vendor/${f}\n${read("vendor", f)}`).join("\n") +
  "\n" +
  list("src", ".js").map((f) => `// src/${f}\n${read("src", f)}`).join("\n");

const version = crypto.createHash("sha256").update(css).update(js).update(read("index.html")).update(icons).digest("hex").slice(0, 12);
const html = read("index.html").replaceAll("{{VERSION}}", version).replace("{{ICONS}}", sprite);
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html) || /\sstyle=/i.test(html)) {
  throw new Error("index.html ne doit contenir ni script ni style en ligne (CSP).");
}

const types = { ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };
const assets = {};
(function walk(sub) {
  for (const entry of fs.readdirSync(path.join(dir, sub), { withFileTypes: true })) {
    const rel = path.posix.join(sub, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (types[path.extname(entry.name)]) {
      assets[`/${rel}`] = [types[path.extname(entry.name)], fs.readFileSync(path.join(dir, sub, entry.name)).toString("base64")];
    }
  }
})("assets");

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const out =
  "// Portail Compte Cord, embarqué en chaînes pour être servi par la fonction\n" +
  "// serverless (aucun fichier statique exposé). Source : dossier portal/ —\n" +
  "// régénérer avec `npm run portal` après une modification.\n" +
  `export const PORTAL_VERSION = ${JSON.stringify(version)};\n\n` +
  "export const PORTAL_HTML = `" + esc(html) + "`;\n\n" +
  "export const PORTAL_JS = `" + esc(js) + "`;\n\n" +
  "export const PORTAL_CSS = `" + esc(css) + "`;\n\n" +
  `export const PORTAL_ASSETS = ${JSON.stringify(assets)};\n`;
fs.writeFileSync(path.join(root, "lib/portal.mjs"), out);
console.log(`lib/portal.mjs écrit (${(out.length / 1024).toFixed(0)} Ko, version ${version}) : JS ${(js.length / 1024).toFixed(0)} Ko, CSS ${(css.length / 1024).toFixed(0)} Ko, ${Object.keys(assets).length} fichiers.`);
