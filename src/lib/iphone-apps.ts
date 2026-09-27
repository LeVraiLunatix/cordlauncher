import { invoke } from "@tauri-apps/api/core";
import { appleSnapshot, canInstall, refreshApple, sideloadIphone, type IphoneDevice } from "./apple";
import { betaDownload, betaInfo, hasBeta } from "./beta";
import type { CatalogApp } from "./catalog/types";
import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";
import { toast } from "./toast";

/**
 * Apps installées sur iPhone par CordLauncher (onglet iPhone). Rust tient le
 * registre (date d'expiration lue dans le profil signé, copie de l'IPA) ; ici
 * on l'affiche, on vérifie ce qui est encore sur l'appareil, on détecte les
 * nouvelles versions et on renouvelle / met à jour (à la main ou tout seul).
 */
export type IphoneApp = {
  id: string; name: string; bundleId: string | null; version: string | null;
  udid: string; deviceName: string | null; appleEmail: string;
  installedAt: number; expiresAt: number | null; ipa: string | null;
  /** Bêta : tag du build installé (build-10) et variante (Passcord.ipa). */
  build: string | null; asset: string | null;
};

/** Nouvelle version disponible pour une app suivie. */
export type IphoneUpdate = {
  id: string;
  /** Ce qu'on affiche : « 1.0.51 » ou « Build 11 ». */
  label: string;
  notes: string | null;
  size: number | null;
  source: { kind: "url"; url: string; version: string } | { kind: "beta"; tag: string };
};

type Model = {
  apps: IphoneApp[] | null;
  devices: IphoneDevice[];
  /** udid → identifiants présents sur l'iPhone (null tant que non vérifié). */
  present: Record<string, string[] | null>;
  scanning: boolean;
  updates: Record<string, IphoneUpdate>;
  checking: boolean;
  lastCheck: number | null;
  /** Mises à jour et renouvellements automatiques. */
  auto: boolean;
  /** Ce que le mode automatique est en train de faire (affiché dans l'onglet). */
  autoRunning: string | null;
};
const AUTO_KEY = "cordlauncher:iphone-auto";
const readAuto = () => { try { return localStorage.getItem(AUTO_KEY) !== "0"; } catch { return true; } };
const store = createStore<Model>({ apps: null, devices: [], present: {}, scanning: false, updates: {}, checking: false, lastCheck: null, auto: readAuto(), autoRunning: null });
export const useIphoneApps = () => useStore(store, s => s);

const DAY = 86_400_000;
/** Jours restants avant l'expiration de la signature (négatif = expirée). */
export const daysLeft = (app: IphoneApp, now = Date.now()) => (app.expiresAt == null ? null : (app.expiresAt - now) / DAY);
/** Durée totale de validité (7 jours en compte gratuit, ~1 an en compte payant). */
export const validity = (app: IphoneApp) => (app.expiresAt == null ? 7 : Math.max(1, Math.round((app.expiresAt - app.installedAt) / DAY)));
export type Health = "ok" | "soon" | "urgent" | "expired";
export function health(app: IphoneApp, now = Date.now()): Health {
  const d = daysLeft(app, now);
  if (d == null) return "ok";
  if (d <= 0) return "expired";
  if (d <= 1) return "urgent";
  if (d <= 2) return "soon";
  return "ok";
}
/** Apps à renouveler bientôt + mises à jour (pastille de la barre latérale). */
export const useIphoneBadge = () => useStore(store, s => {
  const ids = new Set((s.apps ?? []).filter(a => health(a) !== "ok").map(a => a.id));
  for (const id of Object.keys(s.updates)) ids.add(id);
  return ids.size;
});

export async function refreshIphoneApps() {
  if (!IS_TAURI) return;
  const apps = await invoke<IphoneApp[]>("iphone_apps");
  store.set(s => ({ ...s, apps }));
}

/** Détecte les iPhone branchés et vérifie quelles apps y sont encore. */
export async function scanIphones() {
  if (!IS_TAURI || store.get().scanning) return;
  store.set(s => ({ ...s, scanning: true }));
  try {
    const devices = await invoke<IphoneDevice[]>("iphone_list");
    const present: Record<string, string[] | null> = {};
    for (const d of devices.filter(d => d.trusted)) {
      present[d.udid] = await invoke<string[]>("iphone_device_bundles", { udid: d.udid }).catch(() => null);
    }
    store.set(s => ({ ...s, devices, present }));
  } finally {
    store.set(s => ({ ...s, scanning: false }));
  }
}

/** Arrête de suivre une app (elle reste sur l'iPhone). */
export async function forgetIphoneApp(app: IphoneApp) {
  await invoke("iphone_app_forget", { id: app.id, udid: app.udid });
  store.set(s => ({ ...s, apps: (s.apps ?? []).filter(a => !(a.id === app.id && a.udid === app.udid)) }));
}

const deviceName = (app: IphoneApp) => store.get().devices.find(d => d.udid === app.udid)?.name ?? app.deviceName ?? undefined;

/** Re-signe et réinstalle l'app avec l'IPA gardée : 7 jours de plus en compte gratuit. */
export async function renewIphoneApp(app: IphoneApp, quiet = false): Promise<boolean> {
  if (!app.ipa) throw new Error("L’IPA de cette app n’a pas été gardée : réinstalle-la depuis sa fiche.");
  const ok = await sideloadIphone(app.id, app.name, { ipaPath: app.ipa }, app.udid, deviceName(app), { quiet });
  await refreshIphoneApps();
  return ok;
}

// ── Nouvelles versions ─────────────────────────────────────────────────────

/** Compare deux numéros de version (1.0.9 < 1.0.10) ; >0 si a est plus récente. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(/[.\-+ ]/).map(x => parseInt(x, 10) || 0);
  const pb = b.split(/[.\-+ ]/).map(x => parseInt(x, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

type AltStoreSource = { apps: { bundleIdentifier: string; version?: string; downloadURL?: string; size?: number; versionDescription?: string; versions?: { version: string; downloadURL: string; size?: number; localizedDescription?: string }[] }[] };

/**
 * Dernière version iOS publiée d'une app du catalogue : la source AltStore
 * fait foi (elle suit chaque release), sinon la version figée du catalogue.
 */
export async function latestIos(app: CatalogApp, cache = new Map<string, Promise<AltStoreSource | null>>()): Promise<{ version: string; url: string; size: number | null; notes: string | null } | null> {
  const ios = app.ios;
  if (!ios) return null;
  if (ios.altstoreSource) {
    if (!cache.has(ios.altstoreSource)) {
      cache.set(ios.altstoreSource, fetch(ios.altstoreSource, { cache: "no-store" }).then(r => (r.ok ? r.json() : null)).catch(() => null));
    }
    const source = await cache.get(ios.altstoreSource)!;
    const entry = source?.apps.find(a => a.bundleIdentifier === ios.bundleId) ?? source?.apps[0];
    const latest = entry?.versions?.[0] ?? (entry?.version && entry.downloadURL ? { version: entry.version, downloadURL: entry.downloadURL, size: entry.size, localizedDescription: entry.versionDescription } : null);
    if (latest) return { version: latest.version, url: latest.downloadURL, size: latest.size ?? null, notes: latest.localizedDescription ?? null };
  }
  if (ios.ipaUrl && ios.version) return { version: ios.version, url: ios.ipaUrl, size: ios.ipaSize ?? null, notes: null };
  return null;
}

/** Cherche une nouvelle version pour chaque app suivie. */
export async function checkIphoneUpdates(catalog: CatalogApp[], user?: Parameters<typeof hasBeta>[0]) {
  if (!IS_TAURI || store.get().checking) return;
  store.set(s => ({ ...s, checking: true }));
  try {
    const apps = store.get().apps ?? [];
    const updates: Record<string, IphoneUpdate> = {};
    const cache = new Map<string, Promise<AltStoreSource | null>>();
    for (const id of new Set(apps.map(a => a.id))) {
      const tracked = apps.filter(a => a.id === id);
      const cat = catalog.find(c => c.id === id);
      if (!cat) continue;
      const latest = await latestIos(cat, cache);
      if (latest) {
        if (tracked.some(a => a.version && compareVersions(latest.version, a.version) > 0)) {
          updates[id] = { id, label: latest.version, notes: latest.notes, size: latest.size, source: { kind: "url", url: latest.url, version: latest.version } };
        }
        continue;
      }
      // Bêta fermée (Passcord) : le dernier build privé via le Compte Cord.
      if (hasBeta(user, id)) {
        const info = await betaInfo(id).catch(() => null);
        const release = info?.downloads ? info.release : null;
        if (release && tracked.some(a => a.build !== release.tag)) {
          const asset = release.assets.find(x => x.name === tracked[0].asset) ?? release.assets[0];
          updates[id] = { id, label: release.build, notes: null, size: asset?.size ?? null, source: { kind: "beta", tag: release.tag } };
        }
      }
    }
    store.set(s => ({ ...s, updates, lastCheck: Date.now() }));
  } finally {
    store.set(s => ({ ...s, checking: false }));
  }
}

/** Installe la nouvelle version d'une app sur son iPhone. */
export async function updateIphoneApp(app: IphoneApp, update: IphoneUpdate, quiet = false): Promise<boolean> {
  let ok: boolean;
  if (update.source.kind === "url") {
    ok = await sideloadIphone(app.id, app.name, { ipaUrl: update.source.url }, app.udid, deviceName(app), { quiet });
  } else {
    // Lien signé valable quelques minutes : demandé juste avant l'installation, même variante qu'avant.
    const { url, name } = await betaDownload(app.id, app.asset ?? undefined);
    ok = await sideloadIphone(app.id, app.name, { ipaUrl: url }, app.udid, deviceName(app), { quiet, build: update.source.tag, asset: name });
  }
  await refreshIphoneApps();
  if (ok) {
    const rest = { ...store.get().updates };
    if (!(store.get().apps ?? []).some(a => a.id === app.id && a.udid !== app.udid)) delete rest[app.id];
    store.set(s => ({ ...s, updates: rest }));
  }
  return ok;
}

// ── Mode automatique ───────────────────────────────────────────────────────

export function setIphoneAuto(auto: boolean) {
  try { localStorage.setItem(AUTO_KEY, auto ? "1" : "0"); } catch { /* stockage indisponible */ }
  store.set(s => ({ ...s, auto }));
}

let autoBusy = false;
/** Mises à jour déjà installées par le mode auto : jamais deux fois la même (évite une boucle si l'IPA annonce une autre version). */
const autoInstalled = new Set<string>();
/**
 * Une passe du mode automatique : pour chaque app suivie dont l'iPhone est
 * branché et autorisé, installe la nouvelle version si elle existe, sinon
 * renouvelle la signature quand il reste 2 jours ou moins. Rien sans compte
 * Apple prêt (connecté ou mot de passe mémorisé) ni pendant une autre opération.
 */
export async function runIphoneAuto(catalog: CatalogApp[], user?: Parameters<typeof hasBeta>[0], opts: { check?: boolean } = {}) {
  if (!IS_TAURI || autoBusy) return;
  autoBusy = true;
  try {
    await refreshIphoneApps();
    const apps = store.get().apps ?? [];
    if (!apps.length) return;
    if (opts.check !== false) await checkIphoneUpdates(catalog, user);
    // Mode manuel : on s'arrête à la détection (pastille + boutons dans l'onglet).
    if (!store.get().auto) return;
    const { updates } = store.get();
    const autoUpdate = (a: IphoneApp) => { const u = updates[a.id]; return u && !autoInstalled.has(`${a.id}:${a.udid}:${u.label}`) ? u : null; };
    const pending = apps.filter(a => autoUpdate(a) || health(a) !== "ok");
    if (!pending.length) return;
    await scanIphones();
    const trusted = new Set(store.get().devices.filter(d => d.trusted).map(d => d.udid));
    await refreshApple().catch(() => {});
    const apple = appleSnapshot();
    if (!canInstall(apple.status) || apple.busy) return;
    const done: string[] = [];
    for (const a of pending.filter(a => trusted.has(a.udid)).sort((x, y) => (x.expiresAt ?? 0) - (y.expiresAt ?? 0))) {
      const upd = autoUpdate(a);
      store.set(s => ({ ...s, autoRunning: `${upd ? "Mise à jour" : "Renouvellement"} de ${a.name}…` }));
      const ok = upd ? await updateIphoneApp(a, upd, true).catch(() => false) : a.ipa ? await renewIphoneApp(a, true).catch(() => false) : false;
      if (ok && upd) autoInstalled.add(`${a.id}:${a.udid}:${upd.label}`);
      if (ok) done.push(upd ? `${a.name} ${upd.label}` : `${a.name} renouvelée`);
      else break; // Apple a refusé ou l'iPhone a été débranché : on réessaiera plus tard.
    }
    if (done.length) toast({ tone: "ok", title: "iPhone à jour", description: done.join(" · ") });
  } finally {
    autoBusy = false;
    store.set(s => ({ ...s, autoRunning: null }));
  }
}
