import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Tauri pointe `devUrl` sur ce port (src-tauri/tauri.conf.json) : on le fixe
// et on refuse d'en prendre un autre, sinon la fenêtre charge une page vide.
const PORT = 1430;
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: PORT,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: PORT + 1 } : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  envPrefix: ["VITE_", "TAURI_ENV_"],
});
