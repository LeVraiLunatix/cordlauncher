import { cordRequest, refreshCord, type CordUser } from "./account";
import { createStore, useStore } from "./store";

/**
 * Bêtas fermées (Passcord) : une clé d'accès, utilisée une fois sur le
 * Compte Cord, ouvre le téléchargement du build privé. Les administrateurs
 * du Compte Cord ont accès à toutes les bêtas.
 */

export type BetaRelease = { build: string; tag: string; publishedAt: number | null; assets: { name: string; size: number }[] };
export type BetaInfo = { product: string; name: string; access: boolean; downloads: boolean; release: BetaRelease | null };
export type BetaKey = {
  id: string; product: string; label: string | null; hint: string; maxUses: number; uses: number;
  expiresAt: number | null; createdAt: number; revokedAt: number | null; status: "active" | "used" | "expired" | "revoked";
  /** Présente uniquement dans la réponse de création. */
  code?: string;
};
export type BetaTester = { userId: string; name: string; email: string; grantedAt: number; keyLabel: string | null; keyHint: string | null };
export type BetaAdmin = { product: string; name: string; downloads: boolean; release: BetaRelease | null; keys: BetaKey[]; testers: BetaTester[] };

export const hasBeta = (user: CordUser | null | undefined, product: string) =>
  !!user && (!!user.admin || !!user.beta?.includes(product));

/** Descriptions des variantes publiées dans les releases de Passcord. */
export const BETA_ASSETS: Record<string, string> = {
  "Passcord.ipa": "App, extension Safari et clavier — recommandé",
  "Passcord-sans-clavier.ipa": "App et extension Safari, sans clavier",
  "Passcord-autofill.ipa": "Remplissage automatique — compte Apple Developer payant requis",
};

/**
 * Mise en forme pendant la saisie : majuscules, groupes de 4 séparés par des
 * tirets (`PASS-7KQM-2XVD-9HRT`), 16 caractères utiles au plus.
 */
export function formatBetaKey(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
  return raw.match(/.{1,4}/g)?.join("-") ?? "";
}
export const isCompleteBetaKey = (key: string) => /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/.test(key);

export async function redeemBeta(code: string) {
  const result = await cordRequest<{ product: string; name: string; already: boolean }>("/api/beta/redeem", { code });
  await refreshCord();
  return result;
}
export const betaInfo = (product: string) => cordRequest<BetaInfo>(`/api/beta/${product}`, undefined, "GET");
/** Lien signé et temporaire (quelques minutes) vers l'IPA du dernier build. */
export const betaDownload = (product: string, asset?: string) =>
  cordRequest<{ url: string; name: string; size: number; build: string }>(`/api/beta/${product}/download`, asset ? { asset } : {});

// ── Fenêtre « Rejoindre la bêta » ──────────────────────────────────────────
const sheet = createStore<string | null>(null);
export const useBetaSheet = () => useStore(sheet, s => s);
export const openBetaSheet = (appId: string) => sheet.set(appId);
export const closeBetaSheet = () => sheet.set(null);

// ── Navigation demandée hors de la coquille (ex. « Se connecter à Cord ») ─
export const NAVIGATE_EVENT = "cordlauncher:navigate";
export const navigateTo = (route: string) => window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: route }));
