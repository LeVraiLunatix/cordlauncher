import { invoke } from "@tauri-apps/api/core";
import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";

export type CordUser = {
  id: string; name: string; email: string; createdAt: number; emailVerified: boolean;
  theme?: string; locale?: string; alerts?: boolean; avatarUrl?: string | null; mfa?: boolean; admin?: boolean;
  lastLoginAt?: number | null; passwordChangedAt?: number | null;
  /** Bêtas fermées ouvertes à ce compte (clé utilisée, ou administration). */
  beta?: string[];
};
export type CordKey = { id: string; name: string; createdAt: number; lastUsedAt?: number | null };
export type CordChallenge = { id: string; url: string; pollToken?: string; expiresAt: number };
export type CordPasskey = { id: string; name: string; createdAt: number; lastUsedAt: number | null; backedUp: boolean };
export type CordSession = {
  id: string; current: boolean; createdAt: number | null; lastSeenAt: number | null; expiresAt: number; method: string | null;
  device: { label: string; kind: string; app?: string | null; logo?: string | null }; ip: string | null;
};
export type CordEvent = { id: string; kind: string; at: number; detail: string | null; device: { label: string; kind: string; app?: string | null; logo?: string | null } | null; ip: string | null };
export type CordApp = {
  id: string; name: string; tagline: string | null; url: string | null; accent: [string, string]; logo: string | null;
  firstParty: boolean; grantedAt: number; lastUsedAt: number; scope: string;
};
export type SuiteApp = { slug: string; name: string; status: "live" | "beta" | "soon"; tagline: string; description: string; url: string | null; accent: [string, string]; logo: string };
/** Tout l'espace compte, en une requête (`GET /api/account`). */
export type CordDashboard = {
  user: CordUser;
  security: { mfa: boolean; mfaSince: number | null; recoveryCodesLeft: number; passwordChangedAt: number | null; mailConfigured: boolean };
  passcord: CordKey[];
  passkeys: CordPasskey[];
  sessions: CordSession[];
  apps: CordApp[];
  activity: CordEvent[];
};

/** Service Compte Cord en production. */
export const PRODUCTION_SERVER = "https://compte.cordsuite.app";
// Même en dev, le compte est celui de la prod : un service local ne sert que
// si on le demande (VITE_CORD_ACCOUNT_URL=http://127.0.0.1:4319, ou réglage « Serveur »).
const initialServer = localStorage.getItem("cordlauncher:account-server") ?? import.meta.env.VITE_CORD_ACCOUNT_URL ?? PRODUCTION_SERVER;
type AccountState = { server: string; user: CordUser | null; keys: CordKey[]; dashboard: CordDashboard | null; suite: SuiteApp[] };
const account = createStore<AccountState>({ server: initialServer, user: null, keys: [], dashboard: null, suite: [] });
export const useCordAccount = () => useStore(account, s => s);

export function setCordServer(server: string) {
  const url = new URL(server.trim());
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" || (url.protocol !== "https:" && !(url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)))) throw new Error("Utilise une adresse HTTPS, ou localhost pour le développement.");
  localStorage.setItem("cordlauncher:account-server", url.origin);
  account.set({ server: url.origin, user: null, keys: [], dashboard: null, suite: [] });
}

/** Erreur du service : message lisible + raison machine (`mfa_required`…). */
export class CordError extends Error {
  constructor(message: string, readonly reason?: string) { super(message); }
}
function toCordError(e: unknown): CordError {
  // Le proxy Rust préfixe la raison du serveur : « [mfa_required] message ».
  const text = String(e instanceof Error ? e.message : e);
  const [, reason, message] = text.match(/^\[(\w+)\] ([\s\S]*)$/) ?? [];
  return new CordError(message ?? text, reason);
}

export async function cordRequest<T>(path: string, body?: unknown, method = "POST"): Promise<T> {
  if (!IS_TAURI) throw new CordError("Ouvre l’application Windows pour gérer ta session Cord, ou utilise le portail du serveur.");
  const server = account.get().server;
  if (!server) throw new CordError("Configure l’adresse du service Compte Cord.");
  try {
    return await invoke<T>("cord_request", { server, path, method, body: body ?? null });
  } catch (e) {
    throw toCordError(e);
  }
}

/** Qui est connecté ? Charge aussi tout le tableau de bord si quelqu'un l'est. */
/**
 * Tuile « CordLauncher » du Compte Cord : ce qui est installé sur ce PC. Sans
 * client OAuth, CordLauncher publie avec la session de l'utilisateur.
 */
export async function publishLauncherStatus(apps: { id: string; name: string }[], installed: Record<string, { version: string } | null>, launcherVersion: string) {
  if (!IS_TAURI || !account.get().user) return;
  const here = apps.filter(a => installed[a.id]);
  const status = {
    headline: here.length ? `${here.length} app${here.length > 1 ? "s" : ""} de la suite sur ce PC` : "Prêt à installer la suite",
    detail: here.length ? here.map(a => `${a.name} ${installed[a.id]!.version}`).join(" · ").slice(0, 140) : "CordLauncher est installé sur Windows.",
    metrics: [{ label: "Apps", value: String(here.length) }, { label: "Launcher", value: `v${launcherVersion}` }],
  };
  await cordRequest("/api/me/app-status", { app: "cordlauncher", status });
}

export async function refreshCord() {
  const result = await cordRequest<{ user: CordUser | null; keys: CordKey[] }>("/api/me", undefined, "GET");
  const dashboard = result.user ? await cordRequest<CordDashboard>("/api/account", undefined, "GET") : null;
  account.set(s => ({ ...s, ...result, user: dashboard?.user ?? result.user, dashboard }));
  if (result.user && !account.get().suite.length) {
    void cordRequest<{ apps: SuiteApp[] }>("/api/suite", undefined, "GET").then(({ apps }) => account.set(s => ({ ...s, suite: apps }))).catch(() => {});
  }
}
export function clearCord() { account.set(s => ({ ...s, user: null, keys: [], dashboard: null })); }

/** Télécharge l'export RGPD dans Téléchargements ; renvoie le chemin. */
export async function exportCord(): Promise<string> {
  try {
    return await invoke<string>("cord_export", { server: account.get().server });
  } catch (e) {
    throw toCordError(e);
  }
}

/** Adresse absolue d'une ressource du service (logos des apps, avatars). */
export const cordAsset = (path: string | null | undefined) =>
  !path ? null : /^https?:\/\//.test(path) ? path : `${account.get().server}${path}`;

/** Score de sécurité 0-100 (même règle que le portail web). */
export function securityScore(d: CordDashboard) {
  const checks = [
    { id: "email", ok: d.user.emailVerified, weight: 20, label: "Confirmer ton adresse email" },
    { id: "mfa", ok: d.security.mfa, weight: 25, label: "Activer la double authentification" },
    { id: "strong", ok: d.passkeys.length + d.passcord.length > 0, weight: 25, label: "Associer Passcord ou une passkey" },
    { id: "recovery", ok: !d.security.mfa || d.security.recoveryCodesLeft >= 3, weight: 10, label: "Régénérer tes codes de secours" },
    { id: "alerts", ok: Boolean(d.user.alerts), weight: 10, label: "Réactiver les alertes de connexion" },
    { id: "fresh", ok: Boolean(d.security.passwordChangedAt && Date.now() - d.security.passwordChangedAt < 400 * 86400_000), weight: 10, label: "Changer ton mot de passe (plus d’un an)" },
  ];
  const value = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  const tone = value >= 85 ? "ok" : value >= 55 ? "warn" : "danger";
  const label = value >= 85 ? "Protection excellente" : value >= 55 ? "Bonne protection" : "À renforcer";
  return { value, tone, label, checks } as const;
}
