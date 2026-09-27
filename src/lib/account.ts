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
  unread?: number;
};
/** État qu'une app publie sur le Compte Cord (tuile du hub). */
export type CordAppStatus = { headline: string; detail: string | null; metrics: { label: string; value: string }[]; tone: string | null; url: string | null; updatedAt: number };
export type CordHubApp = {
  slug: string; name: string; status: "live" | "beta" | "soon"; tagline: string; description: string; url: string | null; launch: string | null;
  accent: [string, string]; logo: string; connected: boolean; connectedAt: number | null; lastUsedAt: number | null;
  appStatus: CordAppStatus | null; beta: { access: boolean } | null;
};
/** Le hub (`GET /api/hub`) : la suite telle que le compte la voit. */
export type CordHub = { apps: CordHubApp[]; launcher: CordAppStatus | null; unread: number };
export type CordNotification = { id: string; app: string; name: string; logo: string | null; title: string; body: string | null; url: string | null; createdAt: number; readAt: number | null };

/** Service Compte Cord en production. */
export const PRODUCTION_SERVER = "https://compte.cordsuite.app";
// Même en dev, le compte est celui de la prod : un service local ne sert que
// si on le demande (VITE_CORD_ACCOUNT_URL=http://127.0.0.1:4319, ou réglage « Serveur »).
const initialServer = localStorage.getItem("cordlauncher:account-server") ?? import.meta.env.VITE_CORD_ACCOUNT_URL ?? PRODUCTION_SERVER;
type AccountState = { server: string; user: CordUser | null; keys: CordKey[]; dashboard: CordDashboard | null; suite: SuiteApp[]; hub: CordHub | null; inbox: CordNotification[] | null };
const account = createStore<AccountState>({ server: initialServer, user: null, keys: [], dashboard: null, suite: [], hub: null, inbox: null });
export const useCordAccount = () => useStore(account, s => s);
/** État du compte hors React. */
export const cordSnapshot = () => account.get();

export function setCordServer(server: string) {
  const url = new URL(server.trim());
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" || (url.protocol !== "https:" && !(url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)))) throw new Error("Utilise une adresse HTTPS, ou localhost pour le développement.");
  localStorage.setItem("cordlauncher:account-server", url.origin);
  account.set({ server: url.origin, user: null, keys: [], dashboard: null, suite: [], hub: null, inbox: null });
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
  const [dashboard, hub] = result.user
    ? await Promise.all([
        cordRequest<CordDashboard>("/api/account", undefined, "GET"),
        cordRequest<CordHub>("/api/hub", undefined, "GET").catch(() => null),
      ])
    : [null, null];
  account.set(s => ({ ...s, ...result, user: dashboard?.user ?? result.user, dashboard, hub }));
  if (result.user && !account.get().suite.length) {
    void cordRequest<{ apps: SuiteApp[] }>("/api/suite", undefined, "GET").then(({ apps }) => account.set(s => ({ ...s, suite: apps }))).catch(() => {});
  }
}
export function clearCord() { account.set(s => ({ ...s, user: null, keys: [], dashboard: null, hub: null, inbox: null })); }

// ── Notifications envoyées par les apps de la suite ────────────────────────
const setUnread = (unread: number) => account.set(s => ({ ...s, hub: s.hub ? { ...s.hub, unread } : s.hub }));
export async function loadInbox() {
  const page = await cordRequest<{ items: CordNotification[]; unread: number }>("/api/notifications", undefined, "GET");
  account.set(s => ({ ...s, inbox: page.items }));
  setUnread(page.unread);
}
export async function markInboxRead(ids?: string[]) {
  await cordRequest("/api/notifications/read", ids ? { ids } : { all: true });
  const now = Date.now();
  account.set(s => ({ ...s, inbox: s.inbox?.map(n => (!ids || ids.includes(n.id) ? { ...n, readAt: n.readAt ?? now } : n)) ?? null }));
  setUnread(account.get().inbox?.filter(n => !n.readAt).length ?? 0);
}
export async function deleteNotification(id: string) {
  await cordRequest("/api/notifications", { id }, "DELETE");
  account.set(s => ({ ...s, inbox: s.inbox?.filter(n => n.id !== id) ?? null }));
}

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
