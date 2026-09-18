/**
 * Contrat du catalogue d'apps (`apps.json`).
 *
 * Même forme pour la maquette locale (`public/apps.json`) et pour la future
 * API `https://cordsuite.app/api/apps.json` — c'est ce qui permet de basculer
 * de l'une à l'autre en changeant UNE variable (`VITE_CATALOG_URL`).
 * Le schéma JSON équivalent, pour valider le fichier côté serveur, est dans
 * `public/apps.schema.json`.
 */

/** available = installable · closed-beta = sur invitation · coming-soon = annoncée. */
export type AppStatus = "available" | "closed-beta" | "coming-soon";

export type Gradient = readonly [string, string];

export type ChangelogEntry = {
  version: string;
  /** Date ISO (AAAA-MM-JJ). */
  date?: string;
  notes: string[];
};

export type InstallerSpec = {
  /** Détermine les arguments silencieux par défaut (nsis → /S, msi → /qn). */
  type: "nsis" | "msi" | "exe";
  /** Arguments explicites pour une installation sans fenêtre. */
  silentArgs?: string[];
  /** "user" = installée dans le profil, sans fenêtre UAC. */
  scope: "user" | "machine";
};

export type DetectSpec = {
  /** Nom de la sous-clé `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall`. */
  uninstallKey?: string;
  /** Exécutable à lancer, relatif au dossier d'installation. */
  exe?: string;
};

/**
 * Version iPhone d'une app. iOS n'accepte pas d'installation directe depuis
 * un PC sans signature Apple : on passe par AltStore, qui re-signe l'IPA
 * avec le compte Apple de l'utilisateur (AltServer tourne sur le PC).
 */
export type IosSpec = {
  /** available = IPA publique · closed-beta = pas encore distribuée. */
  status: "available" | "closed-beta";
  version?: string;
  releaseDate?: string;
  /** Identifiant de bundle (« com.lunatix.drivecord »). */
  bundleId?: string;
  /** IPA à installer — publique, AltStore la télécharge depuis l'iPhone. */
  ipaUrl?: string;
  ipaSize?: number;
  /** Source AltStore : ajoutée une fois, AltStore propose ensuite chaque mise à jour. */
  altstoreSource?: string;
  /** Version minimale d'iOS (« 15.0 »). */
  minOS?: string;
  /** Guide d'installation détaillé, sur le site de l'app. */
  guideUrl?: string;
};

export type Screenshot = {
  src: string;
  caption?: string;
};

export type CatalogApp = {
  /** Identifiant stable, en minuscules (sert de clé partout). */
  id: string;
  name: string;
  /** Accroche courte (2-4 mots). */
  tagline?: string;
  /** Une phrase, affichée sur la carte. */
  description: string;
  /** Présentation complète, affichée dans la fiche. */
  longDescription?: string;
  status: AppStatus;
  /** Dernière version publiée (semver). */
  version?: string;
  releaseDate?: string;
  /** URL de l'installateur. Figée sur la version (pas `latest`) pour que le hash colle. */
  downloadUrl?: string;
  /** Taille de l'installateur en octets (progression si le serveur n'envoie pas Content-Length). */
  downloadSize?: number;
  /** SHA-256 hexadécimal de l'installateur — vérifié avant exécution. */
  sha256?: string;
  installer?: InstallerSpec;
  detect?: DetectSpec;
  /** Logo carré (PNG, coins déjà arrondis). Relatif = résolu contre l'URL du catalogue. */
  icon?: string;
  /** Les deux teintes du dégradé diagonal de l'app : teintent le verre à la sélection. */
  iconGradient: Gradient;
  website?: string;
  /** Page d'inscription à la bêta (apps `closed-beta`). */
  betaUrl?: string;
  /** Fenêtre de sortie visée, en clair (« courant novembre 2026 »). */
  eta?: string;
  /** Trois ou quatre points concrets, une ligne chacun. */
  highlights?: string[];
  changelog?: ChangelogEntry[];
  screenshots?: Screenshot[];
  /** Compatibilité affichée (« Windows 10 et 11, 64 bits »). */
  requirements?: string;
  /** Version iPhone, si elle existe. */
  ios?: IosSpec;
};

export type Catalog = {
  schemaVersion: 1;
  generatedAt?: string;
  /** Id de l'app mise en avant sur l'écran d'accueil. */
  featured?: string;
  apps: CatalogApp[];
};
