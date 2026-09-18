import type { InstallerDriver, InstalledInfo } from "./types";

/**
 * Pilote simulé : aucune écriture disque, aucun réseau.
 *
 * Le scénario de départ se choisit dans l'URL (`?scenario=update`) ou via
 * `VITE_MOCK_SCENARIO` :
 *  - `fresh`     : rien d'installé (défaut) ;
 *  - `installed` : Drivecord installé et à jour ;
 *  - `update`    : Drivecord installé dans une version plus ancienne.
 */

type Scenario = "fresh" | "installed" | "update";

function readScenario(): Scenario {
  const fromUrl = new URLSearchParams(window.location.search).get("scenario");
  const value = fromUrl ?? import.meta.env.VITE_MOCK_SCENARIO ?? "fresh";
  return value === "installed" || value === "update" ? value : "fresh";
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Annulé", "AbortError"));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new DOMException("Annulé", "AbortError"));
      },
      { once: true },
    );
  });
}

function fakeLocation(name: string): string {
  return `C:\\Users\\vous\\AppData\\Local\\${name}`;
}

export const mockDriver: InstallerDriver = {
  async detect(apps) {
    // Latence réaliste d'une lecture de registre : laisse voir les squelettes.
    await sleep(750 + Math.random() * 550);
    const scenario = readScenario();
    const out: Record<string, InstalledInfo | null> = {};
    for (const app of apps) out[app.id] = null;
    const drive = apps.find((a) => a.id === "drivecord");
    if (drive && scenario === "update") {
      out.drivecord = { version: "0.1.0", location: fakeLocation(drive.name) };
    } else if (drive && scenario === "installed") {
      out.drivecord = { version: drive.version ?? "0.0.0", location: fakeLocation(drive.name) };
    }
    return out;
  },

  async install(app, onProgress, signal) {
    const total = app.downloadSize ?? 5_000_000;
    let received = 0;
    let speed = 0;
    const TICK_MS = 110;
    while (received < total) {
      await sleep(TICK_MS, signal);
      // Débit qui fluctue autour de ~1,5 Mo/s, comme une vraie connexion.
      const instant = 1.1e6 + Math.random() * 0.9e6;
      received = Math.min(total, received + (instant * TICK_MS) / 1000);
      speed = speed === 0 ? instant : speed * 0.82 + instant * 0.18;
      onProgress({ phase: "downloading", received, total, speed, eta: (total - received) / speed });
    }
    onProgress({ phase: "verifying", eta: null });
    await sleep(550, signal);
    onProgress({ phase: "installing" });
    await sleep(1500, signal);
    return { version: app.version ?? "0.0.0", location: fakeLocation(app.name) };
  },

  async uninstall(_app, onProgress) {
    onProgress({ phase: "uninstalling" });
    await sleep(1200);
  },

  async launch() {
    await sleep(300);
  },
};
