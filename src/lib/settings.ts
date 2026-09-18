import { createStore, useStore } from "./store";

/**
 * Réglages de CordLauncher, persistés en localStorage.
 *
 * Pour l'instant seuls l'apparence et les animations agissent réellement.
 * Démarrage avec Windows et vérification des mises à jour seront branchés
 * sur `tauri-plugin-autostart` / `tauri-plugin-updater` à l'étape suivante —
 * les interrupteurs mémorisent déjà le choix.
 */

export type ThemePref = "system" | "dark" | "light";

export type Settings = {
  theme: ThemePref;
  reduceTransparency: boolean;
  reduceMotion: boolean;
  launchAtStartup: boolean;
  startMinimized: boolean;
  autoCheckUpdates: boolean;
  autoInstallUpdates: boolean;
};

const KEY = "cordlauncher:settings";

const DEFAULTS: Settings = {
  theme: "system",
  reduceTransparency: false,
  reduceMotion: false,
  launchAtStartup: false,
  startMinimized: true,
  autoCheckUpdates: true,
  autoInstallUpdates: false,
};

function load(): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

const store = createStore<Settings>(load());
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

/** Reporte les réglages visuels sur <html> (lus par styles.css). */
function applyToDocument(s: Settings) {
  const root = document.documentElement;
  const dark = s.theme === "dark" || (s.theme === "system" && darkQuery.matches);
  root.dataset.theme = dark ? "dark" : "light";
  root.dataset.transparency = s.reduceTransparency ? "reduced" : "full";
  root.dataset.motion = s.reduceMotion ? "reduced" : "full";
  // index.html pose un fond en dur pour la toute première peinture ; les
  // tokens CSS prennent le relais dès que le JS tourne.
  root.style.backgroundColor = "";
}

applyToDocument(store.get());
darkQuery.addEventListener("change", () => applyToDocument(store.get()));

export function updateSettings(patch: Partial<Settings>): void {
  store.set((s) => ({ ...s, ...patch }));
  const next = store.get();
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* stockage indisponible : le réglage vaut pour la session */
  }
  applyToDocument(next);
}

export function useSettings<S>(selector: (s: Settings) => S): S {
  return useStore(store, selector);
}

/** Thème effectivement affiché (le « système » résolu). */
export function useResolvedTheme(): "dark" | "light" {
  const pref = useSettings((s) => s.theme);
  return pref === "system" ? (darkQuery.matches ? "dark" : "light") : pref;
}
