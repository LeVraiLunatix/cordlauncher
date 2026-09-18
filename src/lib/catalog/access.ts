import type { CatalogApp } from "./types";

const betaAdminEmails = new Set(
  (import.meta.env.VITE_BETA_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean),
);

/** Accès de test local uniquement : jamais activé dans un build production. */
export function hasBetaAdminAccess(app: CatalogApp, email: string | null | undefined): boolean {
  return import.meta.env.DEV && app.id === "passcord" && !!email && betaAdminEmails.has(email.trim().toLowerCase());
}
