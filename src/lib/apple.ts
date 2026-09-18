import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { IS_TAURI } from "./platform";
import { createStore, useStore } from "./store";
import { toast } from "./toast";

export type AppleStatus = { email: string | null; connected: boolean; remembered: boolean };
export type IphoneDevice = { udid: string; name: string | null; iosVersion: string | null; connection: string; trusted: boolean };
type TwoFactor = { lastError: string | null; unknown: boolean; sms: boolean; numbers: { id: number; numberWithDialCode: string }[] };
type Progress = { id: string; phase: string; progress: number };
type AppleModel = { status: AppleStatus; busy: boolean; twoFactor: TwoFactor | null; progress: Progress | null; error: string | null };
const empty: AppleStatus = { email: null, connected: false, remembered: false };
const store = createStore<AppleModel>({ status: empty, busy: false, twoFactor: null, progress: null, error: null });
const patch = (values: Partial<AppleModel>) => store.set(s => ({ ...s, ...values }));
export const useApple = () => useStore(store, s => s);
let listeners: Promise<void> | undefined;
export async function initApple() {
  if (!IS_TAURI) return;
  listeners ??= (async () => {
    const stopTwoFactor = await listen<TwoFactor>("apple://2fa", e => patch({ twoFactor: e.payload }));
    try { await listen<Progress>("iphone://progress", e => patch({ progress: e.payload })); }
    catch (error) { stopTwoFactor(); throw error; }
  })().catch(error => { listeners = undefined; throw error; });
  await listeners;
}
export async function refreshApple() { if (IS_TAURI) patch({ status: await invoke<AppleStatus>("apple_status") }); }
async function operation(fn: () => Promise<void>) {
  if (store.get().busy) return;
  patch({ busy: true, error: null });
  try { await initApple(); await fn(); }
  catch (error) { patch({ error: String(error) }); }
  finally { patch({ busy: false, twoFactor: null, progress: null }); }
}
export async function loginApple(email: string, password: string, remember: boolean) {
  await operation(async () => { patch({ status: await invoke<AppleStatus>("apple_login", { email, password, remember }) }); });
}
export async function logoutApple() {
  await operation(async () => { await invoke("apple_logout"); patch({ status: empty }); });
}
export async function respondApple(response: string | { SubmitCode: string } | { SendSms: number }) {
  try { await invoke("apple_2fa_respond", { response }); patch({ twoFactor: null }); }
  catch (error) { patch({ error: String(error) }); }
}
export async function sideloadIphone(id: string, name: string, source: { ipaUrl?: string; ipaPath?: string }, udid: string) {
  await operation(async () => {
    patch({ progress: { id, phase: source.ipaPath ? "signing" : "downloading", progress: -1 } });
    await invoke("iphone_sideload", { id, ipaUrl: source.ipaUrl ?? null, ipaPath: source.ipaPath ?? null, udid });
    toast({ tone: "ok", title: `${name} installé sur l’iPhone`, description: "Active le mode développeur et autorise le profil dans les réglages iOS si nécessaire." });
  });
}
