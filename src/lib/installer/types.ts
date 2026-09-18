import type { CatalogApp } from "../catalog/types";

/** Ce qu'on sait d'une app déjà présente sur le PC. */
export type InstalledInfo = {
  version: string;
  /** Dossier d'installation (affiché dans la bibliothèque). */
  location?: string;
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
 * Deux implémentations prévues :
 *  - `mockDriver` (maintenant) : simule tout, pour le navigateur et la maquette ;
 *  - `tauriDriver` (étape suivante) : commandes Rust — lecture du registre,
 *    téléchargement en flux, vérification SHA-256, lancement silencieux.
 *
 * L'UI ne parle qu'à cette interface : brancher le vrai pilote ne touche
 * aucun composant.
 */
export interface InstallerDriver {
  /** Versions installées, par id d'app (`null` = absente). */
  detect(apps: CatalogApp[]): Promise<Record<string, InstalledInfo | null>>;
  install(
    app: CatalogApp,
    onProgress: (patch: ProgressPatch) => void,
    signal: AbortSignal,
  ): Promise<InstalledInfo>;
  uninstall(app: CatalogApp, onProgress: (patch: ProgressPatch) => void): Promise<void>;
  launch(app: CatalogApp): Promise<void>;
}
