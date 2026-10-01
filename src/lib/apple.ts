import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";
import { toast } from "./toast";

export type AppleProfile = {
  email: string;
  active: boolean;
  connected: boolean;
  remembered: boolean;
  addedAt: number;
  lastUsedAt: number | null;
  /** Secondes avant de pouvoir retenter (pause après des refus d'Apple). */
  pausedFor: number | null;
};
export type AppleStatus = { active: string | null; profiles: AppleProfile[] };
export type IphoneDevice = { udid: string; name: string | null; iosVersion: string | null; connection: string; trusted: boolean; wifi: boolean | null };
export type TrustedNumber = { id: number; numberWithDialCode: string; lastTwoDigits: string };
export type TwoFactor = {
  email: string;
  /** Secondes laissées pour répondre (le moteur abandonne ensuite). */
  expiresIn: number;
  lastError: string | null;
  unknown: boolean;
  sms: boolean;
  numbers: TrustedNumber[];
  selectedNumberId: number | null;
  /** Horodatage local de réception (redémarre le compte à rebours). */
  receivedAt: number;
};
/** idle → saisie ; verifying → code envoyé à Apple ; success → connecté, la fenêtre se ferme. */
export type VerifyPhase = "idle" | "verifying" | "sending" | "success";
type Progress = { id: string; phase: string; progress: number };
/** Certificat de développement du compte Apple (liste montrée quand le maximum est atteint). */
export type CertInfo = { serial: string; name: string | null; machine: string | null; own: boolean };
type AppleModel = {
  status: AppleStatus;
  busy: boolean;
  twoFactor: TwoFactor | null;
  certPrompt: CertInfo[] | null;
  verify: VerifyPhase;
  progress: Progress | null;
  error: string | null;
};

const empty: AppleStatus = { active: null, profiles: [] };
const store = createStore<AppleModel>({ status: empty, busy: false, twoFactor: null, certPrompt: null, verify: "idle", progress: null, error: null });
const patch = (values: Partial<AppleModel>) => store.set(s => ({ ...s, ...values }));
export const useApple = () => useStore(store, s => s);
/** État Apple hors React (mode automatique de l'onglet iPhone). */
export const appleSnapshot = () => store.get();

/** Compte qui signe les apps. */
export const activeProfile = (status: AppleStatus) => status.profiles.find(p => p.active) ?? null;
/** Le compte actif peut installer sans rien redemander. */
export const canInstall = (status: AppleStatus) => {
  const p = activeProfile(status);
  return !!p && (p.connected || p.remembered);
};

let listeners: Promise<void> | undefined;
export async function initApple() {
  if (!IS_TAURI) return;
  listeners ??= (async () => {
    const stopTwoFactor = await listen<Omit<TwoFactor, "receivedAt">>("apple://2fa", e =>
      patch({ twoFactor: { ...e.payload, receivedAt: Date.now() }, verify: "idle" }),
    );
    const stops = [stopTwoFactor];
    try {
      stops.push(await listen<CertInfo[]>("iphone://certs", e => patch({ certPrompt: e.payload })));
      stops.push(await listen<Progress>("iphone://progress", e => patch({ progress: e.payload })));
      stops.push(await listen<string>("apple://signed-in", () => {
        // Code accepté : l'animation de réussite se joue, puis la fenêtre se ferme.
        if (!store.get().twoFactor) return;
        patch({ verify: "success" });
        setTimeout(() => { if (store.get().verify === "success") patch({ twoFactor: null, verify: "idle" }); }, 1500);
      }));
    }
    catch (error) { stops.forEach(stop => stop()); throw error; }
  })().catch(error => { listeners = undefined; throw error; });
  await listeners;
}

export async function refreshApple() { if (IS_TAURI) patch({ status: await invoke<AppleStatus>("apple_status") }); }

/** Lance une opération Apple ; renvoie `true` si elle a abouti. */
async function operation(fn: () => Promise<void>): Promise<boolean> {
  if (store.get().busy) return false;
  patch({ busy: true, error: null });
  try {
    await initApple();
    await fn();
    return true;
  }
  catch (error) { patch({ error: String(error) }); return false; }
  finally {
    // Une réussite en cours d'animation se ferme d'elle-même (cf. apple://signed-in).
    patch(store.get().verify === "success" ? { busy: false, progress: null } : { busy: false, twoFactor: null, verify: "idle", progress: null });
  }
}

export async function loginApple(email: string, password: string, remember: boolean) {
  let ok = false;
  await operation(async () => {
    patch({ status: await invoke<AppleStatus>("apple_login", { email, password, remember }) });
    ok = true;
  });
  if (ok) toast({ tone: "ok", title: "Compte Apple connecté", description: `${email.trim()} signe maintenant tes apps.` });
  return ok;
}
export async function switchApple(email: string) {
  try {
    patch({ status: await invoke<AppleStatus>("apple_switch", { email }), error: null });
    toast({ tone: "ok", title: "Compte Apple changé", description: `Les apps seront signées avec ${email}.` });
  } catch (error) { patch({ error: String(error) }); }
}
export async function forgetApple(email: string) {
  await operation(async () => { patch({ status: await invoke<AppleStatus>("apple_forget", { email }) }); });
}
export async function resetAppleDevice() {
  await operation(async () => {
    await invoke("apple_reset_device");
    patch({ status: await invoke<AppleStatus>("apple_status") });
    toast({ tone: "ok", title: "Appareil Apple réinitialisé", description: "Apple verra un nouvel appareil et te redemandera un code de vérification." });
  });
}
/** Réponse à « maximum de certificats » : numéros à révoquer, ou null pour annuler. */
export async function respondCerts(serials: string[] | null) {
  patch({ certPrompt: null });
  try { await invoke("iphone_certs_respond", { serials }); }
  catch (error) { patch({ error: String(error) }); }
}

export async function respondApple(response: "Abort" | "SendToDevices" | "ResendCode" | { SubmitCode: string } | { SendSms: number }) {
  const submitting = typeof response === "object" && "SubmitCode" in response;
  if (response !== "Abort") patch({ verify: submitting ? "verifying" : "sending" });
  try {
    await invoke("apple_2fa_respond", { response });
    // Abandon : la fenêtre se ferme tout de suite, sans attendre la fin de l'opération.
    if (response === "Abort") patch({ twoFactor: null, verify: "idle" });
  } catch (error) { patch({ error: String(error), twoFactor: null, verify: "idle" }); }
}
export async function sideloadIphone(id: string, name: string, source: { ipaUrl?: string; ipaPath?: string }, udid: string, deviceName?: string, extra: { build?: string; asset?: string; quiet?: boolean } = {}): Promise<boolean> {
  const ok = await operation(async () => {
    patch({ progress: { id, phase: source.ipaPath ? "preparing" : "downloading", progress: -1 } });
    await invoke("iphone_sideload", { id, ipaUrl: source.ipaUrl ?? null, ipaPath: source.ipaPath ?? null, udid, name, deviceName: deviceName ?? null, build: extra.build ?? null, asset: extra.asset ?? null });
    // Onglet iPhone : la nouvelle date d'expiration apparaît tout de suite.
    void import("./iphone-apps").then(m => { m.unignoreIphoneApp(id, udid); return m.refreshIphoneApps(); }).catch(() => {});
    if (!extra.quiet) toast({ tone: "ok", title: `${name} installé sur l’iPhone`, description: "Active le mode développeur et autorise le profil dans les réglages iOS si nécessaire." });
  });
  void refreshApple().catch(() => {});
  return ok;
}
