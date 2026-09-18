import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  LoaderCircle,
  MonitorSmartphone,
  Play,
  ScanLine,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CatalogApp, IosSpec } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { formatBytes, formatDate } from "../../lib/format";
import {
  altstoreLink,
  canInstallOnIphone,
  closeIphoneInstall,
  getAltServerStatus,
  launchAltServer,
  useIphoneSheet,
  type AltServerStatus,
  type IosInstallMode,
} from "../../lib/iphone";
import { openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { GlassButton, GlassModal, GlassSegmented } from "../glass";
import { AppIcon } from "./AppIcon";
import { QrCode } from "./QrCode";
import { DirectIphoneInstall } from "./DirectIphoneInstall";
import { useApple } from "../../lib/apple";

const ALTSTORE_SITE = "https://altstore.io";
const POLL_MS = 3000;

/**
 * Fenêtre « Installer sur iPhone ». Un seul exemplaire, monté dans la
 * coquille ; n'importe quel bouton l'ouvre via `openIphoneInstall(app)`.
 */
export function IphoneInstallSheet({ apps }: { apps: CatalogApp[] }) {
  const apple = useApple();
  const openId = useIphoneSheet();
  const app = apps.find((a) => a.id === openId) ?? null;
  // Garde l'app affichée pendant l'animation de fermeture.
  const last = useRef<CatalogApp | null>(app);
  if (app) last.current = app;
  const shown = app ?? last.current;

  return (
    <GlassModal
      open={!!app}
      onClose={() => { if (!apple.busy) closeIphoneInstall(); }}
      tint={shown?.iconGradient}
      width={800}
      labelledBy="iphone-install-title"
    >
      {shown && canInstallOnIphone(shown.ios) && <SheetBody app={shown} ios={shown.ios} />}
    </GlassModal>
  );
}

function SheetBody({ app, ios }: { app: CatalogApp; ios: IosSpec }) {
  const [method, setMethod] = useState<"direct" | "altstore">(ios.ipaUrl ? "direct" : "altstore");
  const apple = useApple();
  const [mode, setMode] = useState<IosInstallMode>(ios.ipaUrl ? "install" : "source");
  const link = altstoreLink(ios, mode);
  const altServer = useAltServerStatus();

  const meta = [
    ios.version && `v${ios.version}`,
    ios.ipaSize && formatBytes(ios.ipaSize),
    ios.minOS && `iOS ${ios.minOS.replace(/\.0$/, "")} ou plus`,
    ios.releaseDate && formatDate(ios.releaseDate),
  ].filter(Boolean);

  return (
    <div className="relative z-[3] flex min-h-0 flex-col overflow-y-auto scroll-glass">
      <header className="flex items-center gap-4 px-8 pt-8 pb-6 pr-16">
        <AppIcon app={app} size={56} />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.12em] text-fg-subtle uppercase">
            <Smartphone className="size-3.5" /> Sur ton iPhone
          </p>
          <h2 id="iphone-install-title" className="mt-1 font-display text-[24px] leading-tight font-semibold tracking-[-0.02em]">
            Installer {app.name}
          </h2>
          {meta.length > 0 && <p className="mt-0.5 font-mono text-[11.5px] text-fg-subtle">{meta.join("  ·  ")}</p>}
        </div>
      </header>

      <div className="px-8 pb-5"><GlassSegmented<"direct" | "altstore"> label="Méthode d’installation" value={method} onChange={value => { if (!apple.busy) setMethod(value); }} options={[{ value: "direct", label: "Depuis ce PC" }, { value: "altstore", label: "Avec AltStore" }]} /></div>
      {method === "direct" ? <DirectIphoneInstall app={app} /> : <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-8 px-8 pb-7">
        {/* ── QR ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center">
          {ios.ipaUrl && ios.altstoreSource && (
            <GlassSegmented<IosInstallMode>
              label="Méthode"
              value={mode}
              onChange={setMode}
              className="mb-4"
              options={[
                { value: "install", label: "Installer" },
                { value: "source", label: "Ajouter la source" },
              ]}
            />
          )}

          <motion.div
            className="relative w-full overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_24px_60px_-24px_color-mix(in_oklab,var(--tint-a)_70%,transparent),inset_0_0_0_1px_rgb(0_0_0/0.06)]"
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.1 }}
          >
            {link && <QrCode value={link} colors={app.iconGradient} logo={app.icon} className="aspect-square w-full" />}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-4 top-5 h-8 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, transparent, color-mix(in oklab, var(--tint-b) 30%, transparent), transparent)",
                animation: "qr-scan 3.6s var(--ease-glass) infinite",
              }}
            />
          </motion.div>

          <p className="mt-3.5 flex items-center gap-1.5 text-center text-[12.5px] text-fg-muted">
            <ScanLine className="size-4 shrink-0" />
            Scanne avec l'appareil photo de l'iPhone
          </p>
          {link && <CopyLinkButton link={link} />}
        </div>

        {/* ── Étapes ─────────────────────────────────────────────────────── */}
        <ol className="flex flex-col gap-3">
          <Step n={1} title="AltStore sur ton iPhone" delay={0.12}>
            <p>
              C'est lui qui installe l'app et la garde active. Déjà installé ? Passe à l'étape suivante.
            </p>
            <LinkButton href={ALTSTORE_SITE}>Installer AltStore</LinkButton>
          </Step>

          <Step n={2} title="AltServer ouvert sur ce PC" delay={0.18} aside={<AltServerPill status={altServer.status} />}>
            <p>iPhone et PC sur le même Wi-Fi, ou reliés par un câble USB.</p>
            <AltServerAction state={altServer} />
          </Step>

          <Step n={3} title="Scanne le code" delay={0.24}>
            {mode === "install" ? (
              <p>
                L'appareil photo propose <strong className="font-semibold text-fg">« Ouvrir dans AltStore »</strong> :
                l'installation de {app.name} démarre toute seule.
              </p>
            ) : (
              <p>
                AltStore ajoute la source de {app.name} : l'app y apparaît, et chaque nouvelle version te sera
                proposée.
              </p>
            )}
          </Step>
        </ol>
      </div>}

      {method === "altstore" && <footer className="mx-8 mb-7 flex items-center gap-4 rounded-[20px] bg-[var(--control)] px-4 py-3 ring-1 ring-[var(--line)] ring-inset">
        <MonitorSmartphone className="size-5 shrink-0 text-fg-subtle" />
        <p className="flex-1 text-[12px] leading-relaxed text-fg-muted">
          Avec un compte Apple gratuit, AltStore re-signe l'app tous les 7 jours : laisse AltServer tourner sur ce PC.
        </p>
        <div className="flex shrink-0 items-center gap-1">
          {ios.ipaUrl && (
            <GlassButton
              variant="ghost"
              size="sm"
              icon={<Download className="size-3.5" />}
              onClick={() => void openExternal(ios.ipaUrl!)}
              title="Pour Sideloadly ou une installation manuelle"
            >
              IPA
            </GlassButton>
          )}
          {ios.guideUrl && (
            <GlassButton
              variant="ghost"
              size="sm"
              trailingIcon={<ArrowUpRight className="size-3.5" />}
              onClick={() => void openExternal(ios.guideUrl!)}
            >
              Guide complet
            </GlassButton>
          )}
        </div>
      </footer>}
    </div>
  );
}

function Step({
  n,
  title,
  delay,
  aside,
  children,
}: {
  n: number;
  title: string;
  delay: number;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.li
      className="flex gap-3.5 rounded-[20px] bg-[var(--control)] p-4 ring-1 ring-[var(--line)] ring-inset"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay }}
    >
      <span className="tint-fill grid size-7 shrink-0 place-items-center rounded-full font-display text-[13px] font-bold text-white">
        {n}
      </span>
      <div className="min-w-0 flex-1 space-y-2.5 text-[12.5px] leading-relaxed text-fg-muted">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[14px] font-semibold text-fg">{title}</p>
          {aside}
        </div>
        {children}
      </div>
    </motion.li>
  );
}

function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => void openExternal(href)}
      className="group/link inline-flex items-center gap-1 text-[12.5px] font-medium text-fg underline-offset-4 hover:underline"
    >
      {children}
      <ArrowUpRight className="size-3.5 text-fg-subtle transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
    </button>
  );
}

function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({ tone: "ok", title: "Lien copié", description: "Colle-le dans Safari sur l'iPhone." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ tone: "error", title: "Copie impossible", description: "Le presse-papiers est indisponible." });
    }
  };
  return (
    <GlassButton
      variant="ghost"
      size="sm"
      className="mt-2"
      onClick={() => void copy()}
      icon={
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "ok" : "copy"}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="grid"
          >
            {copied ? <Check className="size-3.5 text-ok" strokeWidth={3} /> : <Copy className="size-3.5" />}
          </motion.span>
        </AnimatePresence>
      }
    >
      {copied ? "Copié" : "Copier le lien"}
    </GlassButton>
  );
}

// ── AltServer ──────────────────────────────────────────────────────────────

type AltServerState = {
  status: AltServerStatus | "loading";
  launching: boolean;
  launch: () => void;
};

/** Surveille AltServer tant que la fenêtre est ouverte (toutes les 3 s). */
function useAltServerStatus(): AltServerState {
  const [status, setStatus] = useState<AltServerStatus | "loading">("loading");
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const s = await getAltServerStatus();
        if (alive) setStatus(s);
      } catch {
        if (alive) setStatus(null);
      }
    };
    void tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (launching && status && status !== "loading" && status.running) setLaunching(false);
  }, [launching, status]);

  const launch = () => {
    setLaunching(true);
    launchAltServer().catch((err: unknown) => {
      setLaunching(false);
      toast({
        tone: "error",
        title: "AltServer ne s'est pas lancé",
        description: err instanceof Error ? err.message : String(err),
      });
    });
    // Filet : si AltServer n'apparaît pas, on rend la main au bout de 15 s.
    setTimeout(() => setLaunching(false), 15000);
  };

  return { status, launching, launch };
}

function AltServerPill({ status }: { status: AltServerStatus | "loading" }) {
  if (status === "loading") {
    return <span className="skeleton h-5 w-20 rounded-full" />;
  }
  if (status === null) return null;
  const running = status.running;
  return (
    <motion.span
      key={running ? "on" : "off"}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold ring-1 ring-inset",
        running ? "bg-ok/12 text-ok ring-ok/25" : "bg-warn/12 text-warn ring-warn/25",
      )}
    >
      <span className={cn("size-1.5 rounded-full bg-current", running && "animate-pulse-dot")} />
      {running ? "Détecté" : status.installed ? "Fermé" : "Absent"}
    </motion.span>
  );
}

function AltServerAction({ state }: { state: AltServerState }) {
  const { status, launching, launch } = state;
  if (status === "loading") return null;
  if (status === null) {
    return <p className="text-fg-subtle">Vérifie qu'AltServer est bien dans la zone de notification.</p>;
  }
  if (status.running) {
    return (
      <p className="flex items-center gap-1.5 text-ok">
        <Check className="size-3.5" strokeWidth={3} /> Prêt : l'iPhone peut installer.
      </p>
    );
  }
  if (status.installed) {
    return (
      <GlassButton
        variant="glass"
        size="sm"
        icon={launching ? <LoaderCircle className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
        disabled={launching}
        onClick={launch}
      >
        {launching ? "Démarrage…" : "Lancer AltServer"}
      </GlassButton>
    );
  }
  return <LinkButton href={ALTSTORE_SITE}>Télécharger AltServer pour Windows</LinkButton>;
}
