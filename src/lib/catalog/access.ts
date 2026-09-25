import type { CordUser } from "../account";
import { hasBeta } from "../beta";
import type { CatalogApp } from "./types";

const devBetaEmails = new Set(
  (import.meta.env.VITE_BETA_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean),
);

/**
 * L'app en bêta fermée est-elle ouverte à ce compte ? Oui pour les testeurs
 * (clé d'accès utilisée sur le Compte Cord) et l'administration du Compte Cord.
 * `VITE_BETA_ADMIN_EMAILS` reste un raccourci de développement, jamais actif
 * dans un build de production.
 */
export function hasBetaAccess(app: CatalogApp, user: CordUser | null | undefined): boolean {
  if (app.status !== "closed-beta") return true;
  if (hasBeta(user, app.id)) return true;
  return import.meta.env.DEV && !!user?.email && devBetaEmails.has(user.email.trim().toLowerCase());
}
