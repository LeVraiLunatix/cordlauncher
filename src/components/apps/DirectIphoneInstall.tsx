import { invoke } from "@tauri-apps/api/core";
import { FileUp } from "lucide-react";
import { useEffect, useState } from "react";
import { sideloadIphone, useApple, type IphoneDevice } from "../../lib/apple";
import type { CatalogApp } from "../../lib/catalog/types";
import { IS_TAURI, openExternal, pickIpaFile } from "../../lib/platform";
import { GlassButton, GlassProgress } from "../glass";
import { AppleAccount } from "./AppleAccount";

/** Nom de fichier depuis un chemin Windows, pour l'afficher joliment. */
function baseName(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

export function DirectIphoneInstall({ app }: { app: CatalogApp }) {
  const apple = useApple();
  const [devices, setDevices] = useState<IphoneDevice[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [ipaPath, setIpaPath] = useState<string | null>(null);

  // Passcord (et toute app en bêta fermée) n'a pas d'IPA publique : on installe
  // alors le fichier .ipa que l'utilisateur choisit lui-même.
  const publicUrl = app.ios?.ipaUrl ?? null;
  const needsFile = !publicUrl;
  const source = ipaPath ? { ipaPath } : publicUrl ? { ipaUrl: publicUrl } : null;
  const connected = apple.status.connected || apple.status.remembered;

  async function scan() {
    if (!IS_TAURI) return;
    setScanning(true);
    setError(null);
    try {
      const list = await invoke<IphoneDevice[]>("iphone_list");
      setDevices(list);
      setSelected((current) =>
        list.some((d) => d.udid === current && d.trusted) ? current : (list.find((d) => d.trusted)?.udid ?? ""),
      );
    } catch (e) {
      setError(String(e));
    } finally {
      setScanning(false);
    }
  }
  useEffect(() => {
    void scan();
  }, []);

  async function chooseFile() {
    try {
      const picked = await pickIpaFile();
      if (picked) setIpaPath(picked);
    } catch (e) {
      setError(String(e));
    }
  }

  const progress = apple.progress?.id === app.id ? apple.progress : null;

  return (
    <div className="space-y-5 px-8 pb-8">
      <AppleAccount />
      <div className="h-px bg-[var(--line)]" />

      {needsFile && (
        <div className="space-y-2">
          <label className="block text-sm">Fichier de l’app (.ipa)</label>
          <div className="flex flex-wrap items-center gap-2">
            <GlassButton variant="glass" icon={<FileUp className="size-4" />} disabled={!IS_TAURI || apple.busy} onClick={() => void chooseFile()}>
              {ipaPath ? "Changer de fichier" : "Choisir un .ipa…"}
            </GlassButton>
            {ipaPath && <span className="truncate text-sm text-fg-muted" title={ipaPath}>{baseName(ipaPath)}</span>}
          </div>
          <p className="text-xs text-fg-subtle">
            {app.name} est en bêta fermée : télécharge son <code>.ipa</code> depuis tes releases, puis choisis-le ici.
            {app.betaUrl && (
              <>
                {" "}
                <button type="button" className="underline" onClick={() => void openExternal(app.betaUrl!)}>
                  Rejoindre la bêta
                </button>
              </>
            )}
          </p>
        </div>
      )}

      <label className="block text-sm">
        iPhone connecté
        <select className="cord-input mt-2" value={selected} onChange={(e) => setSelected(e.target.value)} disabled={apple.busy}>
          <option value="">Sélectionner un appareil</option>
          {devices.map((d) => (
            <option key={d.udid} value={d.udid} disabled={!d.trusted}>
              {d.name ?? "iPhone"} · {d.connection.toUpperCase()}
              {d.iosVersion ? ` · iOS ${d.iosVersion}` : ""}
              {!d.trusted ? " · Autorisation requise sur l’iPhone" : ""}
            </option>
          ))}
        </select>
      </label>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      {!scanning && !error && !devices.length && (
        <p className="text-sm text-fg-muted">Aucun iPhone détecté. Branche ton appareil puis actualise.</p>
      )}

      <div className="flex gap-2">
        <GlassButton variant="glass" disabled={!IS_TAURI || scanning || apple.busy} onClick={() => void scan()}>
          {scanning ? "Recherche…" : "Actualiser"}
        </GlassButton>
        <GlassButton
          variant="primary"
          disabled={!selected || apple.busy || !connected || !source}
          onClick={() => source && void sideloadIphone(app.id, app.name, source, selected)}
        >
          Installer / renouveler
        </GlassButton>
      </div>

      {progress && (
        <div aria-live="polite" className="space-y-2">
          <p className="text-sm">
            {(
              {
                downloading: "Téléchargement de l’IPA",
                signing: "Signature avec ton compte Apple",
                installing: "Installation sur l’iPhone",
              } as Record<string, string>
            )[progress.phase]}
            …
          </p>
          <GlassProgress value={progress.progress < 0 ? null : progress.progress} />
        </div>
      )}
    </div>
  );
}
