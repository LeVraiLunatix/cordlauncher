import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { CatalogApp } from "../catalog/types";
import type { InstalledInfo, InstallerDriver, JobPhase, ProgressPatch } from "./types";

/**
 * Pilote réel : relaie vers les commandes Rust de src-tauri/src/apps.rs.
 * Rust publie la progression brute (octets reçus) ; le débit lissé et le
 * temps restant sont calculés ici.
 */

type RawProgress = { id: string; phase: JobPhase; received: number; total: number };

const CANCELLED = "__cancelled__";

function abortError(): DOMException {
  return new DOMException("Annulé", "AbortError");
}

export const tauriDriver: InstallerDriver = {
  async detect(apps) {
    const requests = apps
      .filter((a) => a.detect?.uninstallKey)
      .map((a) => ({ id: a.id, uninstallKey: a.detect!.uninstallKey!, exe: a.detect!.exe ?? null }));
    const found = await invoke<Record<string, InstalledInfo | null>>("apps_detect", { apps: requests });
    const out: Record<string, InstalledInfo | null> = {};
    for (const a of apps) out[a.id] = found[a.id] ?? null;
    return out;
  },

  async install(app, options, onProgress, signal) {
    if (!app.downloadUrl || !app.detect?.uninstallKey) {
      throw new Error("Cette app n'a pas d'installateur Windows dans le catalogue.");
    }
    if (signal.aborted) throw abortError();

    // Débit lissé (moyenne exponentielle) entre deux évènements.
    let last = { t: performance.now(), received: 0 };
    let speed = 0;
    const unlisten = await listen<RawProgress>("apps://progress", ({ payload }) => {
      if (payload.id !== app.id) return;
      if (payload.phase !== "downloading") {
        onProgress({ phase: payload.phase, eta: null });
        return;
      }
      const now = performance.now();
      const dt = (now - last.t) / 1000;
      if (dt > 0.05) {
        const instant = (payload.received - last.received) / dt;
        speed = speed === 0 ? instant : speed * 0.75 + instant * 0.25;
        last = { t: now, received: payload.received };
      }
      const total = payload.total || app.downloadSize || 0;
      onProgress({
        phase: "downloading",
        received: payload.received,
        total,
        speed,
        eta: speed > 0 && total > 0 ? (total - payload.received) / speed : null,
      });
    });
    const onAbort = () => void invoke("app_cancel", { id: app.id });
    signal.addEventListener("abort", onAbort, { once: true });

    try {
      return await invoke<InstalledInfo>("app_install", {
        req: {
          id: app.id,
          url: app.downloadUrl,
          sha256: app.sha256 ?? null,
          size: app.downloadSize ?? null,
          installerType: app.installer?.type ?? "exe",
          silentArgs: app.installer?.silentArgs ?? null,
          installDir: options.installDir,
          desktopShortcut: options.desktopShortcut,
          uninstallKey: app.detect.uninstallKey,
          exe: app.detect.exe ?? null,
        },
      });
    } catch (err) {
      if (String(err) === CANCELLED) throw abortError();
      throw new Error(String(err));
    } finally {
      unlisten();
      signal.removeEventListener("abort", onAbort);
    }
  },

  async uninstall(app, onProgress: (p: ProgressPatch) => void) {
    if (!app.detect?.uninstallKey) throw new Error("Désinstalleur inconnu pour cette app.");
    onProgress({ phase: "uninstalling" });
    try {
      await invoke("app_uninstall", { uninstallKey: app.detect.uninstallKey });
    } catch (err) {
      throw new Error(String(err));
    }
  },

  async launch(_app: CatalogApp, installed) {
    if (!installed.exe) throw new Error("Exécutable introuvable : réinstalle l'app.");
    try {
      await invoke("app_launch", { exe: installed.exe });
    } catch (err) {
      throw new Error(String(err));
    }
  },
};
