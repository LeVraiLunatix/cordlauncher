import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";

/**
 * Réglages de CordLauncher, persistés en localStorage.
 *
 * « Lancer avec Windows » est la seule valeur dont la vérité est ailleurs :
 * le plugin autostart (clé Run du registre). On l'y écrit à chaque bascule
 * et on relit l'état réel au démarrage.
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
  /** Dossier racine des apps (chacune dans son sous-dossier). `null` = défaut de l'installateur. */
  installBase: string | null;
  /** Raccourci sur le Bureau à l'installation. */
  desktopShortcut: boolean;
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
  installBase: null,
  desktopShortcut: true,
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

function persist(next: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* stockage indisponible : le réglage vaut pour la session */
  }
}

export function updateSettings(patch: Partial<Settings>): void {
  store.set((s) => ({ ...s, ...patch }));
  const next = store.get();
  persist(next);
  applyToDocument(next);
  if ("launchAtStartup" in patch) void applyAutostart(next.launchAtStartup);
}

export function getSettings(): Settings {
  return store.get();
}

export function useSettings<S>(selector: (s: Settings) => S): S {
  return useStore(store, selector);
}

/** Thème effectivement affiché (le « système » résolu). */
export function useResolvedTheme(): "dark" | "light" {
  const pref = useSettings((s) => s.theme);
  return pref === "system" ? (darkQuery.matches ? "dark" : "light") : pref;
}

// ── Lancement avec Windows ──────────────────────────────────────────────────

async function applyAutostart(enabled: boolean): Promise<void> {
  if (!IS_TAURI) return;
  const autostart = await import("@tauri-apps/plugin-autostart");
  try {
    if (enabled) await autostart.enable();
    else await autostart.disable();
  } catch (err) {
    console.error("[réglages] démarrage automatique :", err);
    // On remet l'interrupteur sur la vérité du système.
    await syncAutostart();
  }
}

/** Relit l'état réel (l'utilisateur a pu le changer dans le Gestionnaire des tâches). */
export async function syncAutostart(): Promise<void> {
  if (!IS_TAURI) return;
  const { isEnabled } = await import("@tauri-apps/plugin-autostart");
  const enabled = await isEnabled();
  if (enabled !== store.get().launchAtStartup) {
    store.set((s) => ({ ...s, launchAtStartup: enabled }));
    persist(store.get());
  }
}
