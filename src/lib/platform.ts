import { isTauri } from "@tauri-apps/api/core";

/**
 * Pont vers la fenêtre native. Tout passe par ici pour que le front tourne
 * aussi dans un navigateur (`npm run dev`) : hors Tauri, chaque appel devient
 * un no-op ou un équivalent web.
 */

export const IS_TAURI = isTauri();

async function currentWindow() {
  const { getCurrentWindow } = await import("@tauri-apps/api/window");
  return getCurrentWindow();
}

/**
 * La fenêtre démarre cachée (anti-flash blanc) : on l'affiche une fois
 * peinte. Lancée avec Windows (`--minimized`) et si l'utilisateur l'a
 * demandé, elle s'ouvre directement réduite dans la barre des tâches.
 */
export async function revealWindow(allowMinimized: boolean): Promise<void> {
  if (!IS_TAURI) return;
  const { invoke } = await import("@tauri-apps/api/core");
  const w = await currentWindow();
  await w.show();
  if (allowMinimized && (await invoke<boolean>("launch_minimized"))) {
    await w.minimize();
  } else {
    await w.setFocus();
  }
}

/** Sélecteur de dossier Windows. `null` si l'utilisateur annule. */
export async function pickFolder(title: string, defaultPath?: string): Promise<string | null> {
  if (!IS_TAURI) return null;
  const { open } = await import("@tauri-apps/plugin-dialog");
  const picked = await open({ directory: true, multiple: false, title, defaultPath });
  return typeof picked === "string" ? picked : null;
}

/** %LOCALAPPDATA%, dossier par défaut des installateurs « utilisateur ». */
export async function defaultAppsDir(): Promise<string | null> {
  if (!IS_TAURI) return null;
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<string | null>("apps_default_dir");
}

export async function minimizeWindow(): Promise<void> {
  if (IS_TAURI) await (await currentWindow()).minimize();
}

export async function toggleMaximizeWindow(): Promise<void> {
  if (IS_TAURI) await (await currentWindow()).toggleMaximize();
}

export async function closeWindow(): Promise<void> {
  if (IS_TAURI) await (await currentWindow()).close();
}

/** Prévient à chaque bascule agrandie/restaurée (icône du bouton central). */
export async function watchMaximized(cb: (maximized: boolean) => void): Promise<() => void> {
  if (!IS_TAURI) return () => {};
  const w = await currentWindow();
  cb(await w.isMaximized());
  return w.onResized(async () => cb(await w.isMaximized()));
}

/** Ouvre un lien dans le navigateur par défaut de l'utilisateur. */
export async function openExternal(url: string): Promise<void> {
  if (IS_TAURI) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
