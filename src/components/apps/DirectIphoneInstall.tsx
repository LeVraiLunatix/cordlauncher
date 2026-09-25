import { invoke } from "@tauri-apps/api/core";
import { Cable, Check, ChevronDown, CloudDownload, FileUp, KeyRound, Loader2, PenLine, RefreshCw, ShieldCheck, Smartphone, Sparkles, UserRound, Wifi } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCordAccount } from "../../lib/account";
import { activeProfile, canInstall, sideloadIphone, useApple, type IphoneDevice } from "../../lib/apple";
import { BETA_ASSETS, betaDownload, betaInfo, hasBeta, navigateTo, openBetaSheet, type BetaInfo } from "../../lib/beta";
import type { CatalogApp } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { formatBytes } from "../../lib/format";
import { closeIphoneInstall } from "../../lib/iphone";
import { easeGlass, springBouncy, springSnappy, springSoft } from "../../lib/motion";
import { IS_TAURI, pickIpaFile } from "../../lib/platform";
import { GlassButton } from "../glass";
import { AppleAccount } from "./AppleAccount";

/** Nom de fichier depuis un chemin Windows, pour l'afficher joliment. */
const baseName = (path: string) => path.split(/[\\/]/).pop() ?? path;
const hueOf = (text: string) => [...text.toLowerCase()].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0) % 360;
const ring = "inset 0 0 0 1.5px color-mix(in oklab, var(--tint-a) 70%, transparent)";

/**
 * Installation « Depuis ce PC » : compte Apple → version → iPhone → envoi.
 * Chaque bloc se replie sur un résumé une fois réglé, pour que l'essentiel
 * (le bouton et la progression) reste visible.
 */
export function DirectIphoneInstall({ app }: { app: CatalogApp }) {
  const apple = useApple();
  const { user } = useCordAccount();
  const [devices, setDevices] = useState<IphoneDevice[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [ipaPath, setIpaPath] = useState<string | null>(null);
  const [beta, setBeta] = useState<BetaInfo | null>(null);
  const [variant, setVariant] = useState(`${app.name}.ipa`);

  // Passcord (et toute app en bêta fermée) n'a pas d'IPA publique : un testeur
  // installe le dernier build privé via son Compte Cord ; sinon, un .ipa local.
  const publicUrl = app.ios?.ipaUrl ?? null;
  const needsFile = !publicUrl;
  const tester = needsFile && hasBeta(user, app.id);
  const betaBuild = tester && beta?.downloads && beta.release?.assets.length ? beta.release : null;
  const source = ipaPath ? { ipaPath } : publicUrl ? { ipaUrl: publicUrl } : betaBuild ? "beta" as const : null;
  const accountReady = canInstall(apple.status);
  const device = devices.find(d => d.udid === selected) ?? null;
  const progress = apple.progress?.id === app.id ? apple.progress : null;

  useEffect(() => {
    if (!tester || !IS_TAURI) return;
    betaInfo(app.id).then(info => {
      setBeta(info);
      const names = info.release?.assets.map(a => a.name) ?? [];
      if (names.length && !names.includes(`${app.name}.ipa`)) setVariant(names[0]);
    }, () => setBeta(null));
  }, [tester, app.id, app.name]);

  async function scan(quiet = false) {
    if (!IS_TAURI) return;
    if (!quiet) setScanning(true);
    try {
      const list = await invoke<IphoneDevice[]>("iphone_list");
      setDevices(list);
      setSelected(current => (list.some(d => d.udid === current && d.trusted) ? current : (list.find(d => d.trusted)?.udid ?? "")));
      if (!quiet) setError(null);
    } catch (e) {
      if (!quiet) setError(String(e));
    } finally {
      if (!quiet) setScanning(false);
    }
  }
  useEffect(() => { void scan(); }, []);
  // Tant qu'aucun iPhone n'est prêt, on regarde régulièrement s'il vient d'être branché ou autorisé.
  const waiting = !devices.some(d => d.trusted) && !apple.busy;
  useEffect(() => {
    if (!waiting || !IS_TAURI) return;
    const t = setInterval(() => void scan(true), 4000);
    return () => clearInterval(t);
  }, [waiting]);

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

  async function chooseFile() {
    try {
      const picked = await pickIpaFile();
      if (picked) setIpaPath(picked);
    } catch (e) {
      setError(String(e));
    }
  }

  const ready = !!source && !!selected && accountReady && !apple.busy;
  const missing = !accountReady ? "Connecte un compte Apple" : !source ? "Choisis la version à installer" : !selected ? "Branche et autorise ton iPhone" : null;

  return (
    <div className="space-y-3 px-8 pb-8">
      <Step n={1} title="Compte Apple" done={accountReady} icon={UserRound}>
        <AppleStep />
      </Step>

      <Step n={2} title="Version" done={!!source} icon={Sparkles}
        aside={betaBuild && !ipaPath ? <span className="font-mono text-[11.5px] text-fg-subtle">{betaBuild.build}</span> : publicUrl && app.ios?.version ? <span className="font-mono text-[11.5px] text-fg-subtle">v{app.ios.version}</span> : undefined}>
        {publicUrl && !ipaPath ? (
          <Choice on icon={<CloudDownload className="size-4" />} title={`${app.name}${app.ios?.version ? ` ${app.ios.version}` : ""}`} desc="Dernière version publiée, téléchargée automatiquement" meta={app.ios?.ipaSize ? formatBytes(app.ios.ipaSize) : undefined} />
        ) : betaBuild && !ipaPath ? (
          <div role="radiogroup" aria-label="Version à installer" className="grid gap-2">
            {betaBuild.assets.map(asset => (
              <Choice key={asset.name} on={variant === asset.name} disabled={apple.busy} onClick={() => setVariant(asset.name)}
                title={<span className="font-mono text-[13px]">{asset.name}</span>} desc={BETA_ASSETS[asset.name] ?? "Build de la bêta"} meta={formatBytes(asset.size)} />
            ))}
          </div>
        ) : ipaPath ? (
          <Choice on icon={<FileUp className="size-4" />} title={<span className="font-mono text-[13px]">{baseName(ipaPath)}</span>} desc={ipaPath} />
        ) : (
          <BetaHint app={app} tester={tester} beta={beta} admin={!!user?.admin} />
        )}
        {needsFile && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <GlassButton size="sm" variant="ghost" icon={<FileUp className="size-3.5" />} disabled={!IS_TAURI || apple.busy} onClick={() => void chooseFile()}>
              {ipaPath ? "Changer de fichier" : betaBuild ? "Utiliser un .ipa de ce PC" : "Choisir un .ipa…"}
            </GlassButton>
            {ipaPath && (betaBuild || publicUrl) && <GlassButton size="sm" variant="ghost" onClick={() => setIpaPath(null)}>Revenir au build en ligne</GlassButton>}
          </div>
        )}
      </Step>

      <Step n={3} title="iPhone" done={!!device} icon={Smartphone}
        aside={<GlassButton size="icon-sm" variant="ghost" aria-label="Rechercher les iPhone" title="Rechercher" disabled={!IS_TAURI || scanning || apple.busy} onClick={() => void scan()}>
          <RefreshCw className={cn("size-3.5", scanning && "animate-spin")} />
        </GlassButton>}>
        {devices.length ? (
          <div role="radiogroup" aria-label="iPhone" className="grid gap-2 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {devices.map(d => <DeviceCard key={d.udid} device={d} on={d.udid === selected} disabled={apple.busy} onSelect={() => setSelected(d.udid)} />)}
            </AnimatePresence>
          </div>
        ) : <NoDevice scanning={scanning} />}
      </Step>

      <AnimatePresence>
        {error && (
          <motion.p role="alert" className="rounded-2xl bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-4 py-3 text-sm text-danger" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {progress ? (
          <InstallProgress key="progress" app={app} phase={progress.phase} value={progress.progress} device={device} />
        ) : (
          <motion.div key="cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: springSoft }} exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }} className="pt-2">
            <GlassButton variant="primary" size="lg" tint={app.iconGradient} className="w-full justify-center" disabled={!ready} onClick={() => void install()}
              icon={<Smartphone className="size-4" />}>
              {device ? `Installer ${app.name} sur ${device.name ?? "l’iPhone"}` : `Installer ${app.name}`}
            </GlassButton>
            <p className="mt-2 text-center text-xs text-fg-subtle">
              {missing ?? "Signée avec ton compte Apple, l’app reste valable 7 jours : relance l’installation pour la renouveler."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Blocs ─────────────────────────────────────────────────────────────────────

function Step({ n, title, done, icon: Icon, aside, children }: { n: number; title: string; done: boolean; icon: typeof Smartphone; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[22px] bg-[var(--control)] p-4 ring-1 ring-[var(--line)] ring-inset">
      <header className="mb-3 flex items-center gap-2.5">
        <span className={cn("relative grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold", done ? "text-[var(--bg)]" : "bg-[var(--control-hover)] text-fg-muted")}>
          <AnimatePresence initial={false}>
            {done && <motion.span key="bg" className="absolute inset-0 rounded-full bg-ok" initial={{ scale: 0 }} animate={{ scale: 1, transition: springBouncy }} exit={{ scale: 0 }} />}
          </AnimatePresence>
          <span className="relative">{done ? <Check className="size-3.5" strokeWidth={3.5} /> : n}</span>
        </span>
        <h3 className="flex flex-1 items-center gap-2 text-[13.5px] font-semibold"><Icon className="size-3.5 text-fg-subtle" />{title}</h3>
        {aside}
      </header>
      {children}
    </section>
  );
}

function Choice({ on, icon, title, desc, meta, disabled, onClick }: { on: boolean; icon?: ReactNode; title: ReactNode; desc?: ReactNode; meta?: string; disabled?: boolean; onClick?: () => void }) {
  return (
    <motion.button type="button" role="radio" aria-checked={on} disabled={disabled || !onClick} onClick={onClick}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={cn("flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors disabled:cursor-default", on ? "bg-[var(--control-hover)]" : "hover:bg-[var(--control-hover)]")}
      style={on ? { boxShadow: ring } : undefined}>
      <span className={cn("grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-[var(--line)]", on && "tint-fill ring-0")}>
        {on && (icon ? <span className="text-white [&_svg]:size-3">{icon}</span> : <Check className="size-3 text-white" strokeWidth={3.5} />)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{title}</span>
        {desc && <span className="block truncate text-xs text-fg-muted">{desc}</span>}
      </span>
      {meta && <span className="shrink-0 font-mono text-xs text-fg-subtle">{meta}</span>}
    </motion.button>
  );
}

/** Compte Apple : résumé du compte actif, gestion complète dépliable. */
function AppleStep() {
  const apple = useApple();
  const active = activeProfile(apple.status);
  const [open, setOpen] = useState(false);
  const expanded = open || !active;
  return (
    <div>
      {active && (
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full text-[15px] font-semibold text-white uppercase shadow-md"
            style={{ backgroundImage: `linear-gradient(135deg, hsl(${hueOf(active.email)} 72% 62%), hsl(${(hueOf(active.email) + 48) % 360} 70% 48%))` }}>
            {active.email[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{active.email}</p>
            <p className={cn("text-xs", active.pausedFor ? "text-warn" : active.connected ? "text-ok" : "text-fg-muted")}>
              {active.pausedFor ? "En pause après des refus d’Apple" : active.connected ? "Connecté" : active.remembered ? "Connexion automatique à l’installation" : "À reconnecter"}
              {apple.status.profiles.length > 1 && ` · ${apple.status.profiles.length} comptes`}
            </p>
          </div>
          <GlassButton size="sm" variant="ghost" onClick={() => setOpen(o => !o)}
            trailingIcon={<ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />}>
            {open ? "Replier" : "Changer"}
          </GlassButton>
        </div>
      )}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="manager" className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1, transition: springSoft }} exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: easeGlass } }}>
            <div className={active ? "mt-4 border-t border-[var(--line)] pt-4" : undefined}><AppleAccount /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BetaHint({ app, tester, beta, admin }: { app: CatalogApp; tester: boolean; beta: BetaInfo | null; admin: boolean }) {
  if (!tester) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl p-1">
        <p className="min-w-0 flex-1 text-[13px] text-fg-muted">{app.name} est en bêta fermée : avec une clé d’accès, CordLauncher installe directement le dernier build.</p>
        <GlassButton size="sm" variant="primary" tint={app.iconGradient} icon={<KeyRound className="size-3.5" />} onClick={() => openBetaSheet(app.id)}>J’ai une clé</GlassButton>
      </div>
    );
  }
  if (!beta) return <p className="flex items-center gap-2 text-[13px] text-fg-muted"><Loader2 className="size-3.5 animate-spin" />Recherche du dernier build…</p>;
  if (admin) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 text-[13px] text-fg-muted">L’installation directe n’est pas encore activée : colle ton jeton GitHub une seule fois dans Compte Cord › Admin › Bêta Passcord.</p>
        <GlassButton size="sm" variant="primary" icon={<ShieldCheck className="size-3.5" />} onClick={() => { closeIphoneInstall(); navigateTo("account"); }}>Activer</GlassButton>
      </div>
    );
  }
  return <p className="text-[13px] text-fg-muted">Tu fais partie de la bêta de {app.name}, mais l’installation directe n’est pas encore ouverte : choisis le .ipa reçu.</p>;
}

function DeviceCard({ device: d, on, disabled, onSelect }: { device: IphoneDevice; on: boolean; disabled: boolean; onSelect: () => void }) {
  const usb = d.connection === "usb";
  return (
    <motion.button type="button" role="radio" aria-checked={on} disabled={disabled || !d.trusted} onClick={onSelect}
      layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1, transition: springSoft }} exit={{ opacity: 0, scale: 0.96 }}
      whileTap={d.trusted ? { scale: 0.98 } : undefined}
      className={cn("relative flex items-center gap-3 rounded-2xl p-3 text-left transition-colors", on ? "bg-[var(--control-hover)]" : "hover:bg-[var(--control-hover)]", !d.trusted && "cursor-default opacity-80")}
      style={on ? { boxShadow: ring } : undefined}>
      <span className="relative grid h-12 w-8 shrink-0 place-items-center rounded-[9px] p-[2px]" style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--fg) 45%, transparent), color-mix(in oklab, var(--fg) 12%, transparent))" }}>
        <span className="h-full w-full rounded-[7px]" style={{ background: on ? "linear-gradient(170deg, var(--tint-a), var(--tint-b))" : "color-mix(in oklab, var(--bg) 70%, transparent)" }} />
        <span className="absolute top-[4px] h-[3px] w-2.5 rounded-full bg-black/60" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{d.name ?? "iPhone"}</span>
        <span className="flex items-center gap-1.5 text-xs text-fg-muted">
          {usb ? <Cable className="size-3" /> : <Wifi className="size-3" />}{usb ? "USB" : "Wi-Fi"}{d.iosVersion && ` · iOS ${d.iosVersion}`}
        </span>
        {!d.trusted && <span className="mt-0.5 block text-[11.5px] text-warn">Déverrouille-le et touche « Se fier »</span>}
      </span>
      <AnimatePresence>
        {on && (
          <motion.span className="tint-fill grid size-5 shrink-0 place-items-center rounded-full" initial={{ scale: 0 }} animate={{ scale: 1, transition: springBouncy }} exit={{ scale: 0 }}>
            <Check className="size-3 text-white" strokeWidth={3.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/** Aucun iPhone : câble qui « respire » vers le téléphone, recherche automatique. */
function NoDevice({ scanning }: { scanning: boolean }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl p-2">
      <div className="relative grid size-14 shrink-0 place-items-center">
        <motion.span className="absolute inset-0 rounded-full" style={{ boxShadow: ring }} animate={{ scale: [0.7, 1.15], opacity: [0.8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />
        <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}><Smartphone className="size-7 text-fg-muted" /></motion.span>
      </div>
      <div className="min-w-0 text-sm">
        <p className="font-medium">{scanning ? "Recherche des iPhone…" : "Branche ton iPhone avec un câble"}</p>
        <p className="text-xs text-fg-muted">Déverrouille-le et accepte « Se fier à cet ordinateur ». CordLauncher le détecte tout seul.</p>
      </div>
    </div>
  );
}

// ── Progression ─────────────────────────────────────────────────────────────

const STEPS = [
  { key: "downloading", label: "Téléchargement", icon: CloudDownload, weight: 0.2 },
  { key: "preparing", label: "Préparation", icon: UserRound, weight: 0.1 },
  { key: "signing", label: "Signature", icon: PenLine, weight: 0.3 },
  { key: "installing", label: "Installation", icon: Smartphone, weight: 0.4 },
] as const;
const DETAILS: Record<string, string> = {
  downloading: "Téléchargement de l’app",
  account: "Connexion à ton compte Apple",
  preparing: "Équipe, certificat et enregistrement de l’iPhone",
  signing: "Signature avec ton compte Apple",
  installing: "Envoi et installation sur l’iPhone",
  done: "Installée",
};

function InstallProgress({ app, phase, value, device }: { app: CatalogApp; phase: string; value: number; device: IphoneDevice | null }) {
  const stepKey = phase === "account" ? "preparing" : phase === "done" ? "installing" : phase;
  const index = Math.max(0, STEPS.findIndex(s => s.key === stepKey));
  // Pas de retour en arrière visuel si une étape émet encore après la suivante.
  const reached = useRef(0);
  reached.current = Math.max(reached.current, index);
  const current = reached.current;
  const known = value >= 0;
  const within = phase === "done" ? 1 : known ? value : 0.35;
  const overall = STEPS.slice(0, current).reduce((t, s) => t + s.weight, 0) + STEPS[current].weight * within;
  const pct = Math.round(overall * 100);

  return (
    <motion.div aria-live="polite" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: springSoft }} exit={{ opacity: 0 }}
      className="space-y-4 rounded-[22px] p-4 ring-1 ring-[var(--line)] ring-inset"
      style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--tint-a) 12%, transparent), color-mix(in oklab, var(--tint-b) 8%, transparent))" }}>
      <ol className="grid grid-cols-4 gap-1">
        {STEPS.map((s, i) => {
          const state = i < current || phase === "done" ? "done" : i === current ? "active" : "todo";
          const Icon = s.icon;
          return (
            <li key={s.key} className="relative grid justify-items-center gap-1.5 text-center">
              {i > 0 && (
                <span className="absolute top-[16px] right-[calc(50%+22px)] left-[calc(-50%+22px)] h-[3px] overflow-hidden rounded-full bg-[var(--control-hover)]">
                  <motion.span className="tint-fill absolute inset-0 origin-left" initial={false} animate={{ scaleX: i <= current ? 1 : 0 }} transition={{ duration: 0.5, ease: easeGlass }} />
                </span>
              )}
              <span className="relative z-[1] grid size-9 place-items-center">
                {state === "active" && (
                  <motion.span className="absolute inset-0 rounded-full" style={{ boxShadow: ring }} animate={{ scale: [1, 1.35], opacity: [0.9, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }} />
                )}
                <motion.span className={cn("grid size-9 place-items-center rounded-full", state === "todo" ? "bg-[var(--control-hover)] text-fg-subtle" : "tint-fill text-white")}
                  animate={{ scale: state === "active" ? 1.06 : 1 }} transition={springSnappy}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {state === "done"
                      ? <motion.span key="ok" initial={{ scale: 0.3, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={springBouncy}><Check className="size-4" strokeWidth={3} /></motion.span>
                      : <motion.span key="icon" initial={{ scale: 0.6 }} animate={{ scale: 1 }}><Icon className="size-4" /></motion.span>}
                  </AnimatePresence>
                </motion.span>
              </span>
              <span className={cn("text-[11.5px]", state === "todo" ? "text-fg-subtle" : "font-medium text-fg")}>{s.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={phase} className="truncate" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
              {DETAILS[phase] ?? "Préparation"}{phase === "installing" && device?.name ? ` « ${device.name} »` : ""}{phase === "done" ? "" : "…"}
            </motion.span>
          </AnimatePresence>
          <span className="shrink-0 font-mono text-xs text-fg-muted tabular-nums">{pct} %</span>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-[var(--control-hover)]">
          <motion.div className="tint-fill absolute inset-y-0 left-0 overflow-hidden rounded-full" initial={false} animate={{ width: `${Math.max(3, pct)}%` }} transition={{ type: "spring", stiffness: 70, damping: 20 }}>
            {/* Reflet qui balaie la partie remplie : visible même quand l'étape n'a pas de pourcentage. */}
            <motion.span aria-hidden className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              animate={{ left: ["-4rem", "100%"] }} transition={{ duration: known ? 1.8 : 1.1, repeat: Infinity, ease: "linear" }} />
          </motion.div>
        </div>
        <p className="text-xs text-fg-subtle">Garde l’iPhone déverrouillé et branché jusqu’à la fin. {app.name} apparaîtra sur l’écran d’accueil.</p>
      </div>
    </motion.div>
  );
}
