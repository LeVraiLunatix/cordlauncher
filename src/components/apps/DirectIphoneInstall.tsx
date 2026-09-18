import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { sideloadIphone, useApple, type IphoneDevice } from "../../lib/apple";
import type { CatalogApp } from "../../lib/catalog/types";
import { IS_TAURI } from "../../lib/platform";
import { GlassButton, GlassProgress } from "../glass";
import { AppleAccount } from "./AppleAccount";

export function DirectIphoneInstall({ app }: { app: CatalogApp }) {
  const apple = useApple();
  const [devices, setDevices] = useState<IphoneDevice[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  async function scan() {
    if (!IS_TAURI) return;
    setScanning(true); setError(null);
    try {
      const list = await invoke<IphoneDevice[]>("iphone_list");
      setDevices(list); setSelected(current => list.some(d => d.udid === current && d.trusted) ? current : list.find(d => d.trusted)?.udid ?? "");
    } catch (e) { setError(String(e)); }
    finally { setScanning(false); }
  }
  useEffect(() => { void scan(); }, []);
  const progress = apple.progress?.id === app.id ? apple.progress : null;
  return <div className="space-y-5 px-8 pb-8">
    <AppleAccount />
    <div className="h-px bg-[var(--line)]" />
    <label className="block text-sm">iPhone connecté<select className="cord-input mt-2" value={selected} onChange={e => setSelected(e.target.value)} disabled={apple.busy}><option value="">Sélectionner un appareil</option>{devices.map(d => <option key={d.udid} value={d.udid} disabled={!d.trusted}>{d.name ?? "iPhone"} · {d.connection.toUpperCase()}{d.iosVersion ? ` · iOS ${d.iosVersion}` : ""}{!d.trusted ? " · Autorisation requise sur l’iPhone" : ""}</option>)}</select></label>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    {!scanning && !error && !devices.length && <p className="text-sm text-fg-muted">Aucun iPhone détecté. Branche ton appareil puis actualise.</p>}
    <div className="flex gap-2"><GlassButton variant="glass" disabled={!IS_TAURI || scanning || apple.busy} onClick={() => void scan()}>{scanning ? "Recherche…" : "Actualiser"}</GlassButton><GlassButton variant="primary" disabled={!selected || apple.busy || !(apple.status.connected || apple.status.remembered) || !app.ios?.ipaUrl} onClick={() => void sideloadIphone(app.id, app.name, app.ios!.ipaUrl!, selected)}>Installer / renouveler</GlassButton></div>
    {progress && <div aria-live="polite" className="space-y-2"><p className="text-sm">{({ downloading: "Téléchargement de l’IPA", signing: "Signature avec ton compte Apple", installing: "Installation sur l’iPhone" } as Record<string, string>)[progress.phase]}…</p><GlassProgress value={progress.progress < 0 ? null : progress.progress} /></div>}
  </div>;
}
