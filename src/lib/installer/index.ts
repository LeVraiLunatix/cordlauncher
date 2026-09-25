import type { CatalogApp } from "../catalog/types";
import { compareVersions } from "../format";
import { IS_TAURI } from "../platform";
import { getSettings } from "../settings";
import { createStore, useStore } from "../store";
import { useCordAccount } from "../account";
import { hasBetaAccess } from "../catalog/access";
import { toast } from "../toast";
import { mockDriver } from "./mock-driver";
import { tauriDriver } from "./tauri-driver";
import type { InstalledInfo, InstallerDriver, Job, JobKind, ProgressPatch } from "./types";

export type { InstalledInfo, Job, JobPhase } from "./types";

/**
 * État d'installation de toute la suite + actions.
 *
 * Le pilote est choisi ici et nulle part ailleurs : le vrai dans l'app
 * Windows, le simulé quand le front tourne dans un navigateur.
 */
const driver: InstallerDriver = IS_TAURI ? tauriDriver : mockDriver;

/**
 * Dossier d'installation : une mise à jour reste là où l'app est déjà ;
 * sinon le dossier choisi dans les réglages + le nom de l'app ; sinon
 * celui que propose l'installateur (%LOCALAPPDATA%\<Nom>).
 */
function installDirFor(app: CatalogApp, current: InstalledInfo | null | undefined): string | null {
  if (current?.location) return current.location;
  const base = getSettings().installBase;
  return base ? `${base.replace(/[\\/]+$/, "")}\\${app.name}` : null;
}

type InstallerState = {
  /** Vrai tant que la première détection n'est pas revenue. */
  detecting: boolean;
  installed: Record<string, InstalledInfo | null>;
  jobs: Record<string, Job | undefined>;
};

const store = createStore<InstallerState>({ detecting: true, installed: {}, jobs: {} });
const controllers = new Map<string, AbortController>();

// ── Mutations internes ─────────────────────────────────────────────────────

function setJob(appId: string, job: Job | undefined) {
  store.set((s) => ({ ...s, jobs: { ...s.jobs, [appId]: job } }));
}

function patchJob(appId: string, patch: ProgressPatch) {
  store.set((s) => {
    const current = s.jobs[appId];
    return current ? { ...s, jobs: { ...s.jobs, [appId]: { ...current, ...patch } } } : s;
  });
}

function setInstalled(appId: string, info: InstalledInfo | null) {
  store.set((s) => ({ ...s, installed: { ...s.installed, [appId]: info } }));
}

// ── Actions ────────────────────────────────────────────────────────────────

export async function detectInstalled(apps: CatalogApp[]): Promise<void> {
  store.set((s) => ({ ...s, detecting: true }));
  try {
    const installed = await driver.detect(apps);
    store.set((s) => ({ ...s, detecting: false, installed }));
  } catch (err) {
    console.error("[installateur] détection impossible :", err);
    store.set((s) => ({ ...s, detecting: false }));
  }
}

export async function installApp(app: CatalogApp, installDir?: string | null): Promise<void> {
  if (store.get().jobs[app.id]) return;
  const current = store.get().installed[app.id];
  const kind: JobKind = current ? "update" : "install";
  const ctrl = new AbortController();
  controllers.set(app.id, ctrl);
  setJob(app.id, {
    appId: app.id,
    kind,
    phase: "downloading",
    received: 0,
    total: app.downloadSize ?? 0,
    speed: 0,
    eta: null,
  });

  try {
    const options = { installDir: current?.location ?? installDir ?? installDirFor(app, current), desktopShortcut: getSettings().desktopShortcut };
    const info = await driver.install(app, options, (p) => patchJob(app.id, p), ctrl.signal);
    setInstalled(app.id, info);
    patchJob(app.id, { phase: "done", eta: null });
    toast({
      tone: "ok",
      title: kind === "update" ? `${app.name} est à jour` : `${app.name} est installé`,
      description: `Version ${info.version} — prêt à l'emploi.`,
      tint: app.iconGradient,
    });
    // On laisse la coche « terminé » visible un instant avant « Ouvrir ».
    setTimeout(() => setJob(app.id, undefined), 1100);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      setJob(app.id, undefined);
      toast({ tone: "info", title: "Téléchargement annulé", description: app.name, tint: app.iconGradient });
    } else {
      const message = err instanceof Error ? err.message : String(err);
      patchJob(app.id, { phase: "error", error: message });
      toast({ tone: "error", title: `Échec de l'installation de ${app.name}`, description: message });
      setTimeout(() => setJob(app.id, undefined), 4000);
    }
  } finally {
    controllers.delete(app.id);
  }
}

export function cancelJob(appId: string): void {
  controllers.get(appId)?.abort();
}

export async function uninstallApp(app: CatalogApp): Promise<void> {
  if (store.get().jobs[app.id]) return;
  setJob(app.id, {
    appId: app.id,
    kind: "uninstall",
    phase: "uninstalling",
    received: 0,
    total: 0,
    speed: 0,
    eta: null,
  });
  try {
    await driver.uninstall(app, (p) => patchJob(app.id, p));
    setInstalled(app.id, null);
    toast({ tone: "info", title: `${app.name} a été désinstallé`, tint: app.iconGradient });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    toast({ tone: "error", title: `Impossible de désinstaller ${app.name}`, description: message });
  } finally {
    setJob(app.id, undefined);
  }
}

export async function launchApp(app: CatalogApp): Promise<void> {
  const installed = store.get().installed[app.id];
  if (!installed) {
    toast({ tone: "error", title: `${app.name} n'est pas installé` });
    return;
  }
  toast({ tone: "ok", title: `Lancement de ${app.name}…`, tint: app.iconGradient });
  try {
    await driver.launch(app, installed);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    toast({ tone: "error", title: `${app.name} ne s'est pas lancé`, description: message });
  }
}

// ── Lecture ────────────────────────────────────────────────────────────────

export function useDetecting(): boolean {
  return useStore(store, (s) => s.detecting);
}

export function useInstalled(appId: string): InstalledInfo | null | undefined {
  return useStore(store, (s) => s.installed[appId]);
}

/** Table complète id → install. Référence stable tant qu'aucune install ne change. */
export function useInstalledMap(): Record<string, InstalledInfo | null> {
  return useStore(store, (s) => s.installed);
}

export function useJob(appId: string): Job | undefined {
  return useStore(store, (s) => s.jobs[appId]);
}

/** Nombre d'opérations en cours (pastille de la barre latérale). */
export function useActiveJobCount(): number {
  return useStore(store, (s) => Object.values(s.jobs).filter(Boolean).length);
}

export function hasUpdate(app: CatalogApp, installed: InstalledInfo | null | undefined): boolean {
  return !!installed && !!app.version && compareVersions(app.version, installed.version) > 0;
}

export function useUpdateCount(apps: CatalogApp[]): number {
  return useStore(store, (s) => apps.filter((a) => hasUpdate(a, s.installed[a.id])).length);
}

export function useInstalledCount(apps: CatalogApp[]): number {
  return useStore(store, (s) => apps.filter((a) => !!s.installed[a.id]).length);
}

// ── Action principale d'une app ────────────────────────────────────────────

export type AppAction =
  | { kind: "loading" }
  | { kind: "none" }
  | { kind: "join-beta" }
  | { kind: "install" }
  | { kind: "update"; from: string }
  | { kind: "open"; version: string }
  | { kind: "busy"; job: Job };

/** Ce que propose le bouton principal d'une app, selon son état. */
export function useAppAction(app: CatalogApp): AppAction {
  const account = useCordAccount();
  const detecting = useDetecting();
  const installed = useInstalled(app.id);
  const job = useJob(app.id);

  if (app.status === "coming-soon") return { kind: "none" };
  if (!hasBetaAccess(app, account.user)) return { kind: "join-beta" };
  if (job) return { kind: "busy", job };
  if (detecting) return { kind: "loading" };
  if (!installed) return app.downloadUrl ? { kind: "install" } : { kind: "none" };
  if (hasUpdate(app, installed)) return { kind: "update", from: installed.version };
  return { kind: "open", version: installed.version };
}
