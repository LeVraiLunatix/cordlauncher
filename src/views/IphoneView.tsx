import { AlertTriangle, ArrowDownCircle, Cable, Check, ChevronDown, Clock, Compass, KeyRound, Loader2, RefreshCw, RotateCw, Sparkles, Smartphone, Trash2, UserRound, Wifi } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "../components/apps/AppIcon";
import { AppleAccount } from "../components/apps/AppleAccount";
import { InstallProgress } from "../components/apps/DirectIphoneInstall";
import { GlassButton, GlassCard, GlassModal, GlassToggle, Skeleton } from "../components/glass";
import { useCordAccount } from "../lib/account";
import { activeProfile, refreshApple, useApple } from "../lib/apple";
import type { CatalogApp } from "../lib/catalog/types";
import { cn } from "../lib/cn";
import { checkIphoneUpdates, daysLeft, forgetIphoneApp, health, refreshIphoneApps, renewIphoneApp, scanIphones, setIphoneAuto, updateIphoneApp, useIphoneApps, validity, type Health, type IphoneApp } from "../lib/iphone-apps";
import { formatBytes } from "../lib/format";
import { itemVariants, springBouncy, springSoft, viewVariants } from "../lib/motion";
import { IS_TAURI } from "../lib/platform";
import { toast } from "../lib/toast";

const TONE: Record<Health, { text: string; ring: string; label: string }> = {
  ok: { text: "text-ok", ring: "var(--ok)", label: "Valide" },
  soon: { text: "text-warn", ring: "var(--warn)", label: "À renouveler bientôt" },
  urgent: { text: "text-danger", ring: "var(--danger)", label: "Expire aujourd’hui" },
  expired: { text: "text-danger", ring: "var(--danger)", label: "Expirée" },
};

function remaining(app: IphoneApp): string {
  const d = daysLeft(app);
  if (d == null) return "—";
  if (d <= 0) return "Expirée";
  if (d < 1) return `${Math.max(1, Math.round(d * 24))} h`;
  return `${Math.max(1, Math.round(d))} j`;
}
const dateTime = (ms: number) => new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(ms);

/** Anneau du temps restant : se vide à mesure que l'expiration approche. */
function CountdownRing({ app }: { app: IphoneApp }) {
  const size = 76;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const d = daysLeft(app) ?? 0;
  const ratio = Math.max(0, Math.min(1, d / validity(app)));
  const tone = TONE[health(app)];
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`Temps restant : ${remaining(app)}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="var(--control-hover)" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={tone.ring} strokeLinecap="round"
          strokeDasharray={length} initial={{ strokeDashoffset: length }} animate={{ strokeDashoffset: length * (1 - ratio) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <strong className={cn("font-display text-[17px] leading-none tracking-[-0.02em]", tone.text)}>{remaining(app)}</strong>
        {d > 0 && <small className="mt-0.5 text-[9px] font-semibold tracking-[0.12em] text-fg-subtle uppercase">restants</small>}
      </div>
    </div>
  );
}

/**
 * Onglet iPhone : les apps installées sur l'iPhone par CordLauncher, le temps
 * qu'il reste avant que leur signature expire, et le renouvellement (une app
 * ou toutes) avec l'IPA gardée au moment de l'installation.
 */
export function IphoneView({ apps: catalog, onDiscover }: { apps: CatalogApp[]; onDiscover: () => void }) {
  const { apps, devices, present, scanning, updates, checking, lastCheck, auto, autoRunning } = useIphoneApps();
  const { user } = useCordAccount();
  const [notesOpen, setNotesOpen] = useState<string | null>(null);
  const apple = useApple();
  const [accountOpen, setAccountOpen] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [renewingAll, setRenewingAll] = useState(false);
  const [, tick] = useState(0);

  useEffect(() => {
    void refreshIphoneApps().catch(() => {});
    void refreshApple().catch(() => {});
    void refreshIphoneApps().then(() => scanIphones(catalog)).then(() => checkIphoneUpdates(catalog, user)).catch(() => {});
    // Le compte à rebours avance tout seul.
    const t = setInterval(() => tick(n => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const profile = activeProfile(apple.status);
  const trusted = useMemo(() => new Set(devices.filter(d => d.trusted).map(d => d.udid)), [devices]);
  const list = apps ?? [];
  const toRenew = list.filter(a => health(a) !== "ok");
  const updatable = list.filter(a => updates[a.id] && trusted.has(a.udid) && !apple.busy);
  const renewable = (a: IphoneApp) => !!a.ipa && trusted.has(a.udid) && !apple.busy;

  async function renew(a: IphoneApp) {
    await renewIphoneApp(a);
    void scanIphones().catch(() => {});
  }
  async function searchUpdates() {
    await refreshIphoneApps().catch(() => {});
    await scanIphones(catalog).catch(() => {});
    const result = await checkIphoneUpdates(catalog, user).catch(() => null);
    if (!result) return;
    for (const e of result.errors) toast({ tone: "info", title: "Vérification incomplète", description: e });
    if (result.found) toast({ tone: "ok", title: result.found > 1 ? `${result.found} mises à jour disponibles` : "Une mise à jour disponible", description: "Installe-la depuis la carte de l’app, ou laisse le mode automatique s’en charger." });
    else if (!result.errors.length) toast({ tone: "ok", title: "Tout est à jour", description: "Tes apps iPhone ont la dernière version." });
  }
  async function updateAll() {
    setRenewingAll(true);
    try {
      let n = 0;
      for (const a of updatable) if (await updateIphoneApp(a, updates[a.id], true)) n++;
      if (n) toast({ tone: "ok", title: n > 1 ? `${n} apps mises à jour` : "App mise à jour", description: "La nouvelle version est installée sur ton iPhone." });
    } finally {
      setRenewingAll(false);
      void scanIphones().catch(() => {});
    }
  }
  async function renewAll() {
    setRenewingAll(true);
    try {
      const queue = [...list].filter(renewable).sort((x, y) => (x.expiresAt ?? 0) - (y.expiresAt ?? 0));
      for (const a of queue) await renewIphoneApp(a);
      toast({ tone: "ok", title: queue.length > 1 ? `${queue.length} apps renouvelées` : "App renouvelée", description: "Elles sont de nouveau valables jusqu’à la prochaine échéance." });
    } finally {
      setRenewingAll(false);
      void scanIphones().catch(() => {});
    }
  }

  return (
    <motion.div variants={viewVariants} initial="hidden" animate="show" exit="exit" className="mx-auto flex w-full max-w-[1000px] flex-col gap-5 px-8 pt-4 pb-14">
      <motion.header variants={itemVariants} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">iPhone</p>
          <h1 className="mt-1.5 font-display text-[32px] leading-tight font-semibold tracking-[-0.03em]">Tes apps sur iPhone</h1>
          <p className="mt-1.5 max-w-[60ch] text-[14px] text-fg-muted">Le temps qu’il reste à chaque app avant que sa signature expire, et le renouvellement en un clic.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <GlassButton variant="ghost" icon={<RefreshCw className={cn("size-4", (scanning || checking) && "animate-spin")} />} disabled={scanning || checking}
            onClick={() => void searchUpdates()}>Rechercher les mises à jour</GlassButton>
          {updatable.length > 0 && (
            <GlassButton variant="primary" icon={<ArrowDownCircle className="size-4" />} disabled={apple.busy} onClick={() => void updateAll()}>
              Tout mettre à jour ({updatable.length})
            </GlassButton>
          )}
          {list.some(renewable) && (
            <GlassButton variant={updatable.length ? "glass" : "primary"} icon={<RotateCw className={cn("size-4", renewingAll && "animate-spin")} />} disabled={apple.busy} onClick={() => void renewAll()}>
              Tout renouveler{toRenew.length ? ` (${toRenew.length} urgente${toRenew.length > 1 ? "s" : ""})` : ""}
            </GlassButton>
          )}
        </div>
      </motion.header>

      <motion.div variants={itemVariants}>
        <GlassCard className="rounded-[22px] p-4">
          <div className="relative z-[3] flex flex-wrap items-center gap-4">
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-[13px]", auto ? "tint-fill text-white" : "bg-[var(--control)] text-fg-muted")}>
              {autoRunning ? <Loader2 className="size-[18px] animate-spin" /> : <Sparkles className="size-[18px]" />}
            </span>
            <div className="min-w-[220px] flex-1">
              <p className="text-[14px] font-semibold">Automatique</p>
              <p className="text-[12.5px] text-fg-muted">
                {autoRunning ?? (auto
                  ? "Dès que ton iPhone est branché, CordLauncher installe les nouvelles versions et renouvelle les apps à 2 jours de l’expiration."
                  : "Désactivé : CordLauncher te prévient des nouvelles versions et des expirations, tu lances toi-même.")}
                {lastCheck && !autoRunning ? ` · Vérifié ${Date.now() - lastCheck < 60_000 ? "à l’instant" : new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" }).format(Math.round((lastCheck - Date.now()) / 60000), "minute")}` : ""}
              </p>
            </div>
            <GlassToggle label="Mises à jour et renouvellements automatiques" checked={auto} onChange={setIphoneAuto} />
          </div>
        </GlassCard>
      </motion.div>

      {/* iPhone branchés + compte Apple */}
      <motion.div variants={itemVariants} className="grid gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <GlassCard className="rounded-[22px] p-4">
          <div className="relative z-[3] grid gap-3">
            <p className="flex items-center gap-2 text-[13px] font-semibold"><Smartphone className="size-4 text-fg-muted" />iPhone branchés</p>
            {devices.length ? (
              <div className="flex flex-wrap gap-2">
                {devices.map(d => (
                  <span key={d.udid} className="inline-flex items-center gap-2 rounded-full bg-[var(--control)] py-1.5 pr-3.5 pl-2 text-[13px] ring-1 ring-[var(--line)] ring-inset">
                    <span className={cn("grid size-6 place-items-center rounded-full", d.trusted ? "bg-ok/15 text-ok" : "bg-warn/15 text-warn")}>{d.trusted ? <Check className="size-3.5" strokeWidth={3} /> : <AlertTriangle className="size-3.5" />}</span>
                    <strong className="font-semibold">{d.name ?? "iPhone"}</strong>
                    <span className="flex items-center gap-1 text-fg-subtle">{d.connection === "usb" ? <Cable className="size-3" /> : <Wifi className="size-3" />}{d.iosVersion ? `iOS ${d.iosVersion}` : ""}</span>
                    {!d.trusted && <span className="text-warn">· touche « Se fier »</span>}
                  </span>
                ))}
              </div>
            ) : <p className="text-[13px] text-fg-muted">{scanning ? "Recherche…" : "Aucun iPhone branché. Branche-le avec un câble et déverrouille-le pour renouveler tes apps."}</p>}
          </div>
        </GlassCard>
        <GlassCard className="rounded-[22px] p-4">
          <div className="relative z-[3] flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--control)]"><UserRound className="size-4 text-fg-muted" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-fg-subtle">Compte Apple qui signe</p>
              <p className="truncate text-[14px] font-medium">{profile?.email ?? "Aucun compte connecté"}</p>
            </div>
            <GlassButton size="sm" variant="ghost" icon={<KeyRound className="size-3.5" />} onClick={() => setAccountOpen(true)}>{profile ? "Changer" : "Connecter"}</GlassButton>
          </div>
        </GlassCard>
      </motion.div>

      <AnimatePresence>
        {apple.error && (
          <motion.p role="alert" className="rounded-[18px] bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] px-4 py-3 text-sm text-danger" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{apple.error}</motion.p>
        )}
      </AnimatePresence>

      {apps === null ? (
        <div className="grid gap-3">{[0, 1].map(i => <Skeleton key={i} className="h-[132px] rounded-[24px]" />)}</div>
      ) : !list.length ? (
        <GlassCard variants={itemVariants} className="rounded-[28px] p-10">
          <div className="relative z-[3] grid justify-items-center gap-3 text-center">
            <motion.span className="grid size-16 place-items-center rounded-[20px] bg-[var(--control)]" animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
              <Smartphone className="size-8 text-fg-muted" />
            </motion.span>
            <h2 className="font-display text-[20px] font-semibold">Aucune app installée sur iPhone pour l’instant</h2>
            <p className="max-w-[46ch] text-[13.5px] text-fg-muted">Ouvre la fiche d’une app et choisis « Sur iPhone » : elle apparaîtra ici avec le temps qu’il lui reste avant de devoir être renouvelée.</p>
            <GlassButton variant="primary" icon={<Compass className="size-4" />} onClick={onDiscover}>Découvrir la suite</GlassButton>
          </div>
        </GlassCard>
      ) : (
        <motion.ul layout className="grid gap-3">
          <AnimatePresence initial={false}>
            {list.map(a => {
              const cat = catalog.find(c => c.id === a.id);
              const h = health(a);
              const tone = TONE[h];
              const onDevice = present[a.udid];
              const missing = onDevice != null && a.bundleId != null && !onDevice.includes(a.bundleId);
              const connected = trusted.has(a.udid);
              const progress = apple.progress?.id === a.id ? apple.progress : null;
              const key = `${a.id}:${a.udid}`;
              const upd = updates[a.id];
              return (
                <motion.li key={key} layout variants={itemVariants} initial="hidden" animate="show" exit={{ opacity: 0, x: -24 }}
                  className={cn("relative overflow-hidden rounded-[24px] bg-[var(--glass-fill)] p-4 ring-1 ring-inset", h === "ok" ? "ring-[var(--glass-stroke)]" : h === "soon" ? "ring-warn/40" : "ring-danger/40")}>
                  <div className="flex flex-wrap items-center gap-4">
                    {cat ? <AppIcon app={cat} size={56} /> : <span className="tint-fill grid size-14 place-items-center rounded-[14px] font-display text-xl font-semibold text-white">{a.name[0]}</span>}
                    <div className="min-w-[200px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-[18px] font-semibold tracking-[-0.01em]">{a.name}</h3>
                        {a.version && <span className="font-mono text-[12px] text-fg-subtle">v{a.version}</span>}
                        <span className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[10.5px] font-semibold tracking-[0.06em] uppercase", h === "ok" ? "bg-ok/14 text-ok" : h === "soon" ? "bg-warn/14 text-warn" : "bg-danger/14 text-danger")}>
                          {tone.label}
                        </span>
                        {upd && (
                          <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: springBouncy }}
                            className="tint-fill inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[10.5px] font-semibold tracking-[0.04em] text-white uppercase">
                            <ArrowDownCircle className="size-3" />Mise à jour · {upd.label}
                          </motion.span>
                        )}
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-fg-muted">
                        <span className="flex items-center gap-1"><Smartphone className="size-3.5" />{a.deviceName ?? "iPhone"}{connected ? " · branché" : ""}</span>
                        {a.appleEmail && <span className="flex items-center gap-1"><UserRound className="size-3.5" />{a.appleEmail}</span>}
                        {a.expiresAt && <span className="flex items-center gap-1"><Clock className="size-3.5" />{h === "expired" ? "Expirée le" : "Expire le"} {dateTime(a.expiresAt)}</span>}
                      </p>
                      {!a.ipa && !a.appleEmail && <p className="mt-1.5 text-[12.5px] text-fg-subtle">Installée sans CordLauncher : date d’expiration inconnue. Une mise à jour d’ici la reprend en main.</p>}
                      {missing && <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-warn"><AlertTriangle className="size-3.5" />Plus présente sur cet iPhone : renouveler la réinstalle.</p>}
                    </div>
                    <CountdownRing app={a} />
                    <div className="flex shrink-0 flex-col gap-1.5">
                      {upd && (
                        <GlassButton size="sm" variant="primary" icon={<ArrowDownCircle className="size-3.5" />} disabled={!connected || apple.busy}
                          title={!connected ? "Branche cet iPhone pour mettre à jour" : undefined}
                          onClick={() => void updateIphoneApp(a, upd)}>Mettre à jour</GlassButton>
                      )}
                      <GlassButton size="sm" variant={h === "ok" || upd ? "glass" : "primary"} icon={<RotateCw className="size-3.5" />} disabled={!renewable(a)}
                        title={!a.ipa ? "IPA non gardée : réinstalle depuis la fiche" : !connected ? "Branche cet iPhone pour renouveler" : undefined}
                        onClick={() => void renew(a)}>Renouveler</GlassButton>
                      <AnimatePresence mode="popLayout" initial={false}>
                        {confirm === key ? (
                          <motion.span key="c" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, transition: springBouncy }} exit={{ opacity: 0 }}>
                            <GlassButton size="sm" variant="danger" className="w-full" onClick={() => { setConfirm(null); void forgetIphoneApp(a); }}>Ne plus suivre ?</GlassButton>
                          </motion.span>
                        ) : (
                          <motion.span key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <GlassButton size="sm" variant="ghost" className="w-full" icon={<Trash2 className="size-3.5" />} disabled={apple.busy} onClick={() => { setConfirm(key); setTimeout(() => setConfirm(c => (c === key ? null : c)), 3500); }}>Oublier</GlassButton>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {upd && (upd.notes || upd.size) && (
                    <div className="mt-3 rounded-[16px] bg-[var(--control)] px-3.5 py-2.5 ring-1 ring-[var(--line)] ring-inset">
                      <button type="button" onClick={() => setNotesOpen(o => (o === key ? null : key))} className="flex w-full items-center gap-2 text-left text-[12.5px] font-semibold">
                        <Sparkles className="size-3.5 text-[var(--tint-a)]" />Nouveautés de {upd.label}
                        {upd.size ? <span className="font-mono font-normal text-fg-subtle">· {formatBytes(upd.size)}</span> : null}
                        {upd.notes && <ChevronDown className={cn("ml-auto size-3.5 transition-transform", notesOpen === key && "rotate-180")} />}
                      </button>
                      <AnimatePresence initial={false}>
                        {upd.notes && notesOpen === key && (
                          <motion.p className="overflow-hidden text-[12.5px] leading-relaxed whitespace-pre-line text-fg-muted" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1, transition: springSoft }} exit={{ height: 0, opacity: 0 }}>
                            <span className="block pt-2">{upd.notes.slice(0, 900)}{upd.notes.length > 900 ? "…" : ""}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <AnimatePresence>
                    {progress && (
                      <motion.div className="mt-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto", transition: springSoft }} exit={{ opacity: 0, height: 0 }}>
                        <InstallProgress app={a} phase={progress.phase} value={progress.progress} device={{ name: a.deviceName }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}

      <motion.p variants={itemVariants} className="text-center text-[12px] text-fg-subtle">
        Compte Apple gratuit : chaque app est valable 7 jours et 3 apps au plus peuvent être actives en même temps. Compte développeur payant : un an.
      </motion.p>

      <GlassModal open={accountOpen} onClose={() => setAccountOpen(false)} width={560} labelledBy="apple-accounts">
        <div className="relative z-[3] max-h-full overflow-y-auto p-7">{IS_TAURI && <AppleAccount />}</div>
      </GlassModal>
    </motion.div>
  );
}
