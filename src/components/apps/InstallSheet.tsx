import { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import type { CatalogApp } from "../../lib/catalog/types";
import { installApp } from "../../lib/installer";
import { defaultAppsDir, IS_TAURI, pickFolder } from "../../lib/platform";
import { getSettings, updateSettings, useSettings } from "../../lib/settings";
import { createStore, useStore } from "../../lib/store";
import { toast } from "../../lib/toast";
import { GlassButton, GlassModal, GlassToggle } from "../glass";
import { AppIcon } from "./AppIcon";

const pending = createStore<CatalogApp | null>(null);
export function requestInstall(app: CatalogApp) { pending.set(app); }
const close = () => pending.set(null);

export function InstallSheet() {
  const app = useStore(pending, s => s);
  const [folder, setFolder] = useState("");
  const [ready, setReady] = useState(false);
  const shortcut = useSettings(s => s.desktopShortcut);
  useEffect(() => {
    let active = true;
    setReady(false);
    if (app) void (async () => {
      try {
        const base = getSettings().installBase ?? await defaultAppsDir();
        if (active) setFolder(base ? `${base.replace(/[\\/]+$/, "")}\\${app.name}` : "");
      } catch (error) {
        toast({ tone: "error", title: "Dossier indisponible", description: String(error) });
      } finally { if (active) setReady(true); }
    })();
    return () => { active = false; };
  }, [app]);
  async function browse() {
    try {
      const result = await pickFolder("Choisir le dossier de cette app", folder || undefined);
      if (result) setFolder(result);
    } catch (error) { toast({ tone: "error", title: "Sélection impossible", description: String(error) }); }
  }
  return <GlassModal open={!!app} onClose={close} width={560} labelledBy="install-title">
    {app && <div className="relative z-[3] space-y-5 p-8">
      <AppIcon app={app} size={56} />
      <h2 id="install-title" className="font-display text-2xl font-semibold">Installer {app.name}</h2>
      <p className="text-sm text-fg-muted">Choisis le dossier de l’app. Ses mises à jour conserveront cet emplacement.</p>
      <label className="block text-sm">Dossier d’installation
        <input className="cord-input mt-2" value={folder} onChange={e => setFolder(e.target.value)} placeholder="Emplacement par défaut de l’installateur" />
      </label>
      <GlassButton variant="glass" icon={<FolderOpen className="size-4" />} disabled={!IS_TAURI} onClick={() => void browse()}>Parcourir…</GlassButton>
      <div className="flex items-center justify-between text-sm"><span>Créer un raccourci sur le Bureau</span><GlassToggle label="Créer un raccourci" checked={shortcut} onChange={desktopShortcut => updateSettings({ desktopShortcut })} /></div>
      {!IS_TAURI && <p className="text-xs text-fg-muted">Aperçu navigateur : l’installation est simulée. Utilise l’application Windows pour installer réellement.</p>}
      <div className="flex justify-end gap-2"><GlassButton variant="glass" onClick={close}>Annuler</GlassButton><GlassButton variant="primary" disabled={!ready} onClick={() => { close(); void installApp(app, folder.trim() || null); }}>Installer</GlassButton></div>
    </div>}
  </GlassModal>;
}
