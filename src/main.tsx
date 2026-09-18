import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { revealWindow } from "./lib/platform";
import { getSettings } from "./lib/settings";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// La fenêtre native démarre cachée pour éviter le flash blanc de WebView2.
// Pas de requestAnimationFrame ici : une fenêtre cachée ne reçoit pas de
// frames, l'appel ne partirait jamais (le filet de sécurité Rust l'afficherait
// au bout de 4 s). Le fond est déjà peint par index.html.
void revealWindow(getSettings().startMinimized);
