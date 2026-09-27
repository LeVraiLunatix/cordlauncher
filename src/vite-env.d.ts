/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CORD_ACCOUNT_URL?: string;
  /** URL du catalogue d'apps. Absente → catalogue du Compte Cord. */
  readonly VITE_CATALOG_URL?: string;
  /** Scénario du pilote d'installation simulé : fresh | installed | update. */
  readonly VITE_MOCK_SCENARIO?: string;
}

/** Version de CordLauncher (package.json). */
declare const __APP_VERSION__: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
