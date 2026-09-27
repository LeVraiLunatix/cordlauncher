import { createStore, useStore } from "../store";
import type { AppStatus, Catalog, CatalogApp } from "./types";

/**
 * Chargement du catalogue.
 *
 * Source : le Compte Cord (`/api/catalog`), pour publier une nouvelle version
 * d'une app sans redistribuer CordLauncher. `VITE_CATALOG_URL` la remplace.
 *
 * Ordre de repli : source en ligne → dernière copie valide en cache → copie
 * embarquée dans l'exe (`public/apps.json`). L'app affiche donc toujours la
 * suite, même hors ligne.
 */

const BUNDLED_URL = "/apps.json";
export const CATALOG_URL = import.meta.env.VITE_CATALOG_URL || "https://compte.cordsuite.app/api/catalog";
const CACHE_KEY = "cordlauncher:catalog-cache";
const FETCH_TIMEOUT_MS = 8000;

export type CatalogSource = "remote" | "cache" | "bundled";

export type CatalogState =
  | { status: "loading" }
  | { status: "ready"; catalog: Catalog; source: CatalogSource }
  | { status: "error"; error: string };

export const catalogStore = createStore<CatalogState>({ status: "loading" });

export function useCatalog(): CatalogState {
  return useStore(catalogStore, (s) => s);
}

const STATUSES: AppStatus[] = ["available", "closed-beta", "coming-soon"];
const STATUS_RANK: Record<AppStatus, number> = {
  available: 0,
  "closed-beta": 1,
  "coming-soon": 2,
};

function isGradient(v: unknown): v is [string, string] {
  return Array.isArray(v) && v.length === 2 && v.every((c) => typeof c === "string");
}

/** Résout une URL relative (logo, capture) contre l'adresse du catalogue. */
function resolveUrl(u: string | undefined, base: string): string | undefined {
  if (!u) return undefined;
  try {
    return new URL(u, new URL(base, window.location.href)).toString();
  } catch {
    return undefined;
  }
}

/**
 * Validation défensive : une entrée mal formée est écartée (avec un
 * avertissement) au lieu de faire tomber tout l'écran.
 */
export function normalizeCatalog(raw: unknown, baseUrl: string): Catalog {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as Catalog).apps)) {
    throw new Error("Catalogue invalide : champ `apps` manquant.");
  }
  const input = raw as Catalog;
  const apps: CatalogApp[] = [];
  for (const entry of input.apps as unknown[]) {
    const app = entry as Partial<CatalogApp>;
    if (
      typeof app?.id !== "string" ||
      typeof app.name !== "string" ||
      typeof app.description !== "string" ||
      !STATUSES.includes(app.status as AppStatus) ||
      !isGradient(app.iconGradient)
    ) {
      console.warn("[catalogue] entrée ignorée (champs requis manquants) :", entry);
      continue;
    }
    apps.push({
      ...(app as CatalogApp),
      icon: resolveUrl(app.icon, baseUrl),
      screenshots: app.screenshots?.map((s) => ({ ...s, src: resolveUrl(s.src, baseUrl) ?? s.src })),
      // Une version iPhone sans statut reconnu est ignorée plutôt que de
      // proposer une installation qui échouerait.
      ios: app.ios && (app.ios.status === "available" || app.ios.status === "closed-beta") ? app.ios : undefined,
    });
  }
  // Tri stable : dispo → bêta → bientôt, ordre du fichier ensuite.
  apps.sort((x, y) => STATUS_RANK[x.status] - STATUS_RANK[y.status]);
  const launcher = input.launcher && typeof input.launcher.version === "string" ? input.launcher : undefined;
  return { schemaVersion: 1, generatedAt: input.generatedAt, featured: input.featured, launcher, apps };
}

async function fetchCatalog(url: string): Promise<Catalog> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Les images relatives (« /logos/… ») sont embarquées dans l'exe : on les
    // résout localement, même quand le catalogue vient du Compte Cord.
    return normalizeCatalog(await res.json(), BUNDLED_URL);
  } finally {
    clearTimeout(timer);
  }
}

function readCache(): Catalog | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? normalizeCatalog(JSON.parse(raw), BUNDLED_URL) : null;
  } catch {
    return null;
  }
}

export async function loadCatalog(): Promise<Catalog | null> {
  catalogStore.set({ status: "loading" });
  try {
    const catalog = await fetchCatalog(CATALOG_URL);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(catalog));
    } catch {
      /* quota plein : pas grave, on aura juste un repli de moins */
    }
    const source: CatalogSource = CATALOG_URL === BUNDLED_URL ? "bundled" : "remote";
    catalogStore.set({ status: "ready", catalog, source });
    return catalog;
  } catch (err) {
    console.warn("[catalogue] source injoignable, repli :", err);
  }

  const cached = readCache();
  if (cached) {
    catalogStore.set({ status: "ready", catalog: cached, source: "cache" });
    return cached;
  }

  if (CATALOG_URL !== BUNDLED_URL) {
    try {
      const bundled = await fetchCatalog(BUNDLED_URL);
      catalogStore.set({ status: "ready", catalog: bundled, source: "bundled" });
      return bundled;
    } catch {
      /* on tombe dans l'état d'erreur ci-dessous */
    }
  }

  catalogStore.set({ status: "error", error: "Impossible de charger la liste des apps." });
  return null;
}
