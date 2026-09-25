import { invoke } from "@tauri-apps/api/core";
import { Check, FileUp, KeyRound, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCordAccount } from "../../lib/account";
import { canInstall, sideloadIphone, useApple, type IphoneDevice } from "../../lib/apple";
import { BETA_ASSETS, betaDownload, betaInfo, hasBeta, openBetaSheet, type BetaInfo } from "../../lib/beta";
import { cn } from "../../lib/cn";
import { formatBytes } from "../../lib/format";
import type { CatalogApp } from "../../lib/catalog/types";
import { IS_TAURI, pickIpaFile } from "../../lib/platform";
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
  const { user } = useCordAccount();
  const [beta, setBeta] = useState<BetaInfo | null>(null);
  const [variant, setVariant] = useState(`${app.name}.ipa`);

  // Passcord (et toute app en bêta fermée) n'a pas d'IPA publique : un testeur
  // installe le dernier build privé via son Compte Cord ; sinon, un fichier
  // .ipa choisi à la main.
  const publicUrl = app.ios?.ipaUrl ?? null;
  const needsFile = !publicUrl;
  const tester = needsFile && hasBeta(user, app.id);
  const betaBuild = tester && beta?.downloads && beta.release?.assets.length ? beta.release : null;
  const source = ipaPath ? { ipaPath } : publicUrl ? { ipaUrl: publicUrl } : betaBuild ? "beta" as const : null;
  const connected = canInstall(apple.status);

  useEffect(() => {
    if (!tester || !IS_TAURI) return;
    betaInfo(app.id).then(info => {
      setBeta(info);
      const names = info.release?.assets.map(a => a.name) ?? [];
      if (names.length && !names.includes(`${app.name}.ipa`)) setVariant(names[0]);
    }, () => setBeta(null));
  }, [tester, app.id, app.name]);

  async function install() {
    if (!source || !selected) return;
    setError(null);
    if (source !== "beta") return sideloadIphone(app.id, app.name, source, selected);
    try {
      // Lien signé valable quelques minutes : demandé juste avant l'installation.
      const { url } = await betaDownload(app.id, variant);
      await sideloadIphone(app.id, app.name, { ipaUrl: url }, selected);
    } catch (e) {
      setError((e as Error).message);
    }
  }

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

      {betaBuild && !ipaPath && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-medium"><Sparkles className="size-4 text-fg-muted" />Dernier build de la bêta</p>
            <span className="font-mono text-xs text-fg-subtle">{betaBuild.build}</span>
          </div>
          <div role="radiogroup" aria-label="Version à installer" className="grid gap-2">
            {betaBuild.assets.map(asset => {
              const on = variant === asset.name;
              return (
                <motion.button
                  key={asset.name}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={apple.busy}
                  onClick={() => setVariant(asset.name)}
                  whileTap={{ scale: 0.985 }}
                  className={cn("relative flex items-center gap-3 rounded-2xl p-3.5 text-left transition-colors", on ? "bg-[var(--control-hover)]" : "bg-[var(--control)] hover:bg-[var(--control-hover)]")}
                  style={on ? { boxShadow: "inset 0 0 0 1.5px color-mix(in oklab, var(--tint-a) 70%, transparent)" } : undefined}
                >
                  <span className={cn("grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-[var(--line)]", on && "tint-fill ring-0")}>
                    {on && <Check className="size-3 text-white" strokeWidth={3.5} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-[13px] font-semibold">{asset.name}</span>
                    <span className="block text-xs text-fg-muted">{BETA_ASSETS[asset.name] ?? "Build de la bêta"}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-fg-subtle">{formatBytes(asset.size)}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {needsFile && (
        <div className="space-y-2">
          <label className="block text-sm">{betaBuild ? "Ou un fichier .ipa de ce PC" : "Fichier de l’app (.ipa)"}</label>
          <div className="flex flex-wrap items-center gap-2">
            <GlassButton variant="glass" icon={<FileUp className="size-4" />} disabled={!IS_TAURI || apple.busy} onClick={() => void chooseFile()}>
              {ipaPath ? "Changer de fichier" : "Choisir un .ipa…"}
            </GlassButton>
            {ipaPath && <span className="truncate text-sm text-fg-muted" title={ipaPath}>{baseName(ipaPath)}</span>}
            {ipaPath && betaBuild && <GlassButton size="sm" variant="ghost" onClick={() => setIpaPath(null)}>Utiliser le build de la bêta</GlassButton>}
          </div>
          {!betaBuild && (
            <p className="text-xs text-fg-subtle">
              {tester
                ? beta && !beta.downloads
                  ? `Tu fais partie de la bêta de ${app.name}, mais le téléchargement direct n’est pas encore ouvert : choisis le .ipa reçu.`
                  : `Tu fais partie de la bêta de ${app.name} : recherche du dernier build…`
                : <>
                    {app.name} est en bêta fermée : avec une clé d’accès, CordLauncher installe directement le dernier build.{" "}
                    <button type="button" className="inline-flex items-center gap-1 underline" onClick={() => openBetaSheet(app.id)}>
                      <KeyRound className="size-3" />J’ai une clé
                    </button>
                  </>}
            </p>
          )}
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
          onClick={() => void install()}
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
