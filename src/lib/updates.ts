import { invoke } from "@tauri-apps/api/core";
import { LAUNCHER_VERSION } from "../components/shell/Sidebar";
import { CATALOG_URL } from "./catalog/load";
import type { CatalogApp, LauncherRelease } from "./catalog/types";
import { compareVersions } from "./format";
import { hasUpdate, installApp, installedSnapshot } from "./installer";
import { notifyDesktop } from "./notify";
import { IS_TAURI } from "./platform";
import { getSettings } from "./settings";
import { toast } from "./toast";

// ── CordLauncher lui-même ──────────────────────────────────────────────────

export type LauncherCheck =
  | { status: "latest" }
  | { status: "available"; release: LauncherRelease }
  | { status: "offline" };

/** Compare la version installée à celle publiée dans le catalogue du Compte Cord. */
export async function checkLauncherUpdate(): Promise<LauncherCheck> {
  try {
    const res = await fetch(CATALOG_URL, { cache: "no-cache", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { status: "offline" };
    const release = (await res.json())?.launcher as LauncherRelease | undefined;
    if (release?.version && release.url && compareVersions(release.version, LAUNCHER_VERSION) > 0) {
      return { status: "available", release };
    }
    return { status: "latest" };
  } catch {
    return { status: "offline" };
  }
}

/** Télécharge et lance l'installateur de la nouvelle version ; CordLauncher se ferme. */
export async function installLauncherUpdate(release: LauncherRelease) {
  await invoke("launcher_update", { url: release.url, sha256: release.sha256 ?? null });
}

// ── Apps Windows ───────────────────────────────────────────────────────────

const NOTIFIED_KEY = "cordlauncher:updates-notified";

/**
 * Mises à jour des apps Windows installées, selon les réglages : prévenir
 * (« Vérifier automatiquement ») ou installer tout de suite (« Installer sans
 * demander »). Chaque nouvelle version n'est annoncée qu'une fois.
 */
export async function runAppUpdates(apps: CatalogApp[]) {
  if (!IS_TAURI) return;
  const settings = getSettings();
  if (!settings.autoCheckUpdates) return;
  const installed = installedSnapshot();
  const updatable = apps.filter(app => hasUpdate(app, installed[app.id]));
  if (!updatable.length) return;

  if (settings.autoInstallUpdates) {
    for (const app of updatable) await installApp(app);
    void notifyDesktop("Apps mises à jour", updatable.map(a => `${a.name} ${a.version}`).join(" · "));
    return;
  }

  let notified: string[] = [];
  try { notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? "[]"); } catch { /* rien */ }
  const fresh = updatable.filter(a => !notified.includes(`${a.id}@${a.version}`));
  if (!fresh.length) return;
  const title = fresh.length > 1 ? `${fresh.length} mises à jour disponibles` : `${fresh[0].name} ${fresh[0].version} est disponible`;
  const body = "Ouvre la Bibliothèque de CordLauncher pour les installer.";
  toast({ tone: "info", title, description: body });
  void notifyDesktop(title, body);
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...notified, ...fresh.map(a => `${a.id}@${a.version}`)].slice(-100)));
  } catch { /* stockage indisponible */ }
}
