import { invoke } from "@tauri-apps/api/core";
import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";

export type CordUser = { id: string; name: string; email: string; createdAt: number; emailVerified: boolean };
export type CordKey = { id: string; name: string; createdAt: number };
export type CordChallenge = { id: string; url: string; pollToken?: string; expiresAt: number };
/** Service Compte Cord en production (VPS, derrière Caddy). */
const PRODUCTION_SERVER = "https://compte.cordsuite.app";
// Même en dev, le compte est celui de la prod : un service local ne sert que
// si on le demande (VITE_CORD_ACCOUNT_URL=http://127.0.0.1:4319, ou réglage « Serveur »).
const initialServer = localStorage.getItem("cordlauncher:account-server") ?? import.meta.env.VITE_CORD_ACCOUNT_URL ?? PRODUCTION_SERVER;
const account = createStore<{ server: string; user: CordUser | null; keys: CordKey[] }>({ server: initialServer, user: null, keys: [] });
export const useCordAccount = () => useStore(account, s => s);
export function setCordServer(server: string) {
  const url = new URL(server.trim());
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" || (url.protocol !== "https:" && !(url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)))) throw new Error("Utilise une adresse HTTPS, ou localhost pour le développement.");
  localStorage.setItem("cordlauncher:account-server", url.origin);
  account.set({ server: url.origin, user: null, keys: [] });
}
export async function cordRequest<T>(path: string, body?: unknown, method = "POST"): Promise<T> {
  if (!IS_TAURI) throw new Error("Ouvre l’application Windows pour gérer ta session Cord, ou utilise le portail du serveur.");
  const server = account.get().server;
  if (!server) throw new Error("Configure l’adresse du service Compte Cord.");
  return invoke<T>("cord_request", { server, path, method, body: body ?? null });
}
export async function refreshCord() {
  const result = await cordRequest<{ user: CordUser; keys: CordKey[] }>("/api/me", undefined, "GET");
  account.set(s => ({ ...s, ...result }));
}
export function clearCord() { account.set(s => ({ ...s, user: null, keys: [] })); }
