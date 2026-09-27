import { invoke } from "@tauri-apps/api/core";
import { sideloadIphone, type IphoneDevice } from "./apple";
import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";

/**
 * Apps installées sur iPhone par CordLauncher (onglet iPhone). Rust tient le
 * registre (date d'expiration lue dans le profil signé, copie de l'IPA) ; ici
 * on l'affiche, on vérifie ce qui est encore sur l'appareil et on renouvelle.
 */
export type IphoneApp = {
  id: string; name: string; bundleId: string | null; version: string | null;
  udid: string; deviceName: string | null; appleEmail: string;
  installedAt: number; expiresAt: number | null; ipa: string | null;
};

type Model = {
  apps: IphoneApp[] | null;
  devices: IphoneDevice[];
  /** udid → identifiants présents sur l'iPhone (null tant que non vérifié). */
  present: Record<string, string[] | null>;
  scanning: boolean;
};
const store = createStore<Model>({ apps: null, devices: [], present: {}, scanning: false });
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
/** Nombre d'apps à renouveler bientôt (pastille de la barre latérale). */
export const useRenewCount = () => useStore(store, s => (s.apps ?? []).filter(a => health(a) !== "ok").length);

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

/** Re-signe et réinstalle l'app avec l'IPA gardée : 7 jours de plus en compte gratuit. */
export async function renewIphoneApp(app: IphoneApp) {
  if (!app.ipa) throw new Error("L’IPA de cette app n’a pas été gardée : réinstalle-la depuis sa fiche.");
  const device = store.get().devices.find(d => d.udid === app.udid);
  await sideloadIphone(app.id, app.name, { ipaPath: app.ipa }, app.udid, device?.name ?? app.deviceName ?? undefined);
  await refreshIphoneApps();
}
