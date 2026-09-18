// Régénère lib/portal.mjs à partir de portal.html/js/css.
// Lancer depuis account-service/ : node scripts/gen-portal.cjs
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const out =
  "// Portail Compte Cord, embarqué en chaînes pour être servi par la fonction\n" +
  "// serverless (aucun fichier statique exposé). Source : portal.html/js/css —\n" +
  "// régénérer avec scripts/gen-portal.cjs après une modification.\n" +
  "export const PORTAL_HTML = `" + esc(read("portal.html")) + "`;\n\n" +
  "export const PORTAL_JS = `" + esc(read("portal.js")) + "`;\n\n" +
  "export const PORTAL_CSS = `" + esc(read("portal.css")) + "`;\n";
fs.writeFileSync(path.join(root, "lib/portal.mjs"), out);
console.log("lib/portal.mjs écrit,", out.length, "octets");
