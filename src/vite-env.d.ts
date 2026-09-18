/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CORD_ACCOUNT_URL?: string;
  /** URL du catalogue d'apps. Absente → `/apps.json` embarqué (maquette). */
  readonly VITE_CATALOG_URL?: string;
  /** Scénario du pilote d'installation simulé : fresh | installed | update. */
  readonly VITE_MOCK_SCENARIO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
