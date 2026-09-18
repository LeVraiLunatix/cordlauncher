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

/** La fenêtre démarre cachée (anti-flash blanc) : on l'affiche une fois peinte. */
export async function revealWindow(): Promise<void> {
  if (!IS_TAURI) return;
  const w = await currentWindow();
  await w.show();
  await w.setFocus();
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
