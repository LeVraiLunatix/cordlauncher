import type { CatalogApp } from "../catalog/types";

/** Ce qu'on sait d'une app déjà présente sur le PC. */
export type InstalledInfo = {
  version: string;
  /** Dossier d'installation (affiché dans la bibliothèque). */
  location?: string;
  /** Exécutable à lancer (lu dans le registre). */
  exe?: string;
};

export type InstallOptions = {
  /** Dossier final de l'app ; `null` = celui que choisit son installateur. */
  installDir: string | null;
  desktopShortcut: boolean;
};

export type JobKind = "install" | "update" | "uninstall";

export type JobPhase =
  | "downloading"
  | "verifying"
  | "installing"
  | "uninstalling"
  | "done"
  | "error";

/** Une opération en cours sur une app (une seule à la fois par app). */
export type Job = {
  appId: string;
  kind: JobKind;
  phase: JobPhase;
  /** Octets reçus / attendus (téléchargement). */
  received: number;
  total: number;
  /** Débit lissé, en octets/s. */
  speed: number;
  /** Secondes restantes estimées, `null` si inconnu. */
  eta: number | null;
  error?: string;
};

export type ProgressPatch = Partial<Omit<Job, "appId" | "kind">>;

/**
 * Ce que doit savoir faire un « pilote » d'installation.
 *
 * Deux implémentations :
 *  - `tauriDriver` : le vrai, commandes Rust (src-tauri/src/apps.rs) —
 *    registre, téléchargement en flux + SHA-256, installation silencieuse ;
 *  - `mockDriver` : simule tout, quand le front tourne dans un navigateur.
 *
 * L'UI ne parle qu'à cette interface.
 */
export interface InstallerDriver {
  /** Versions installées, par id d'app (`null` = absente). */
  detect(apps: CatalogApp[]): Promise<Record<string, InstalledInfo | null>>;
  install(
    app: CatalogApp,
    options: InstallOptions,
    onProgress: (patch: ProgressPatch) => void,
    signal: AbortSignal,
  ): Promise<InstalledInfo>;
  uninstall(app: CatalogApp, onProgress: (patch: ProgressPatch) => void): Promise<void>;
  launch(app: CatalogApp, installed: InstalledInfo): Promise<void>;
}
