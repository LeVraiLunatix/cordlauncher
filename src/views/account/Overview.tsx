import { ArrowRight, ArrowUpRight, Bell, CheckCheck, CheckCircle2, MailWarning, MonitorSmartphone, Orbit, ShieldCheck, Trash2, BadgeCheck } from "lucide-react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState, type PointerEvent } from "react";
import { GlassButton, GlassCard, GlassModal, Skeleton } from "../../components/glass";
import {
  cordAsset, cordRequest, deleteNotification, loadInbox, markInboxRead, refreshCord, securityScore, useCordAccount,
  type CordAppStatus, type CordDashboard, type CordHubApp,
} from "../../lib/account";
import { cn } from "../../lib/cn";
import { itemVariants, springSoft } from "../../lib/motion";
import { openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { EVENTS } from "./Activity";
import { useAccount, type AccountTab } from "./context";
import { Avatar, Empty, IconBadge, relative, ScoreRing, TONES } from "./kit";

/**
 * Accueil du Compte Cord dans CordLauncher : le même hub que compte.cordsuite.app
 * (Carte Cord, Aujourd'hui, la suite avec l'état de chaque app, fil commun).
 */

type Step = { id: string; label: string; desc: string; done: boolean; tab?: AccountTab; url?: string; action?: "verify" };
function steps(d: CordDashboard): Step[] {
  return [
    { id: "email", label: "Confirmer ton adresse email", desc: "Pour utiliser Cord dans les apps.", done: d.user.emailVerified, action: "verify" },
    { id: "key", label: "Associer Passcord ou une passkey", desc: "Connexion sans mot de passe, validée par Face ID.", done: d.passkeys.length + d.passcord.length > 0, tab: "appareils" },
    { id: "mfa", label: "Activer la double authentification", desc: "Un code à usage unique en plus du mot de passe.", done: d.security.mfa, tab: "securite" },
    { id: "avatar", label: "Ajouter une photo", desc: "Pour te reconnaître d’un coup d’œil dans les apps.", done: Boolean(d.user.avatarUrl), tab: "profil" },
    { id: "app", label: "Connecter une app", desc: "Drivecord t’attend avec « Continuer avec Cord ».", done: d.apps.length > 0, url: "https://drivecord.app/login?via=cord" },
  ];
}

/** Identifiant lisible et stable, dérivé de l'id interne (CORD·4F2A·91C3) — le même que sur le web. */
function cordId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(-8);
  return `CORD·${hex.slice(0, 4)}·${hex.slice(4)}`;
}

// ── Email : code à 6 chiffres ────────────────────────────────────────────────

export function VerifyBanner() {
  const { d } = useAccount();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  if (d.user.emailVerified) return null;
  const send = async () => {
    setSending(true);
    try {
      await cordRequest("/api/email/send");
      toast({ tone: "ok", title: "Code envoyé", description: `Regarde ta boîte ${d.user.email} (valable 15 minutes).` });
    } catch (e) {
      toast({ tone: "error", title: "Envoi impossible", description: (e as Error).message });
    } finally {
      setSending(false);
    }
  };
  const verify = async () => {
    setBusy(true);
    try {
      await cordRequest("/api/email/verify-code", { code });
      toast({ tone: "ok", title: "Adresse confirmée", description: "Ton compte Cord est prêt dans toute la suite." });
      await refreshCord();
    } catch (e) {
      toast({ tone: "error", title: "Code refusé", description: (e as Error).message });
      setCode("");
    } finally {
      setBusy(false);
    }
  };
  return (
    <GlassCard variants={itemVariants} className="rounded-[22px] p-4">
      <form className="relative z-[3] flex flex-wrap items-center gap-3.5" onSubmit={e => { e.preventDefault(); void verify(); }}>
        <IconBadge icon={MailWarning} tone="warn" />
        <div className="min-w-[200px] flex-1">
          <p className="font-semibold">Confirme ton adresse email</p>
          <p className="text-[13px] text-fg-muted">Tape le code à 6 chiffres reçu par email.</p>
        </div>
        <input className="cord-input w-[150px] text-center font-mono text-lg tracking-[0.35em]" inputMode="numeric" autoComplete="one-time-code" maxLength={7}
          placeholder="••••••" aria-label="Code reçu par email" value={code} onChange={e => setCode(e.target.value.replace(/[^\d ]/g, ""))} />
        <GlassButton type="submit" size="sm" variant="primary" loading={busy} disabled={code.replace(/\D/g, "").length !== 6}>Valider</GlassButton>
        <GlassButton size="sm" variant="ghost" loading={sending} onClick={() => void send()}>Renvoyer</GlassButton>
      </form>
    </GlassCard>
  );
}

// ── Carte Cord ───────────────────────────────────────────────────────────────

function CordCard({ d, linked }: { d: CordDashboard; linked: number }) {
  const reduce = useReducedMotion();
  const score = securityScore(d);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const px = useMotionValue(30);
  const py = useMotionValue(20);
  const shine = useMotionTemplate`radial-gradient(460px circle at ${px}% ${py}%, rgb(255 255 255 / 0.24), transparent 45%)`;
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    rx.set((0.5 - y) * 7);
    ry.set((x - 0.5) * 9);
    px.set(x * 100);
    py.set(y * 100);
  };
  const leave = () => { rx.set(0); ry.set(0); };
  const since = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" }).format(d.user.createdAt);
  const hour = new Date().getHours();
  const first = d.user.name.split(/\s+/)[0];
  const greeting = hour >= 5 && hour < 18 ? `Bonjour, ${first}` : hour >= 18 || hour < 1 ? `Bonsoir, ${first}` : `Encore debout, ${first} ?`;
  return (
    <motion.div
      variants={itemVariants}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className="relative isolate flex min-h-[290px] flex-col gap-5 overflow-hidden rounded-[30px] p-6 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.28),inset_0_0_0_1px_rgb(255_255_255/0.12),0_34px_80px_-34px_rgb(139_92_255/0.75)]"
    >
      <span aria-hidden className="absolute inset-0 -z-20" style={{ background: "radial-gradient(120% 90% at 0% 0%, rgb(110 88 240 / 0.95) 0%, transparent 55%), radial-gradient(90% 80% at 100% 100%, rgb(210 75 239 / 0.85) 0%, transparent 60%), linear-gradient(135deg, #150d2e, #2b1454 55%, #3b1257)" }} />
      {/* Calque holographique : assez grand pour couvrir la carte à tout angle, flouté. */}
      <span aria-hidden className={cn("absolute inset-[-110%] -z-10 opacity-85 mix-blend-screen blur-[46px]", !reduce && "animate-[holo-spin_16s_linear_infinite]")}
        style={{ background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgb(120 220 255 / 0.22) 60deg, rgb(255 120 220 / 0.24) 140deg, transparent 220deg, rgb(160 255 200 / 0.18) 300deg, transparent 360deg)" }} />
      <motion.span aria-hidden className="absolute inset-0 -z-10" style={{ background: shine }} />

      <div className="flex flex-wrap items-center gap-2.5">
        <img src="/logos/cordsuite.png" alt="" className="size-[30px] rounded-[9px] shadow-md" />
        <span className="font-mono text-[12px] font-semibold tracking-[0.22em] uppercase opacity-85">Compte Cord</span>
        <span className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 text-[12.5px] font-semibold backdrop-blur">
          <ShieldCheck className={cn("size-3.5", score.tone === "ok" ? "text-[#7ff0bf]" : score.tone === "warn" ? "text-[#ffd38a]" : "text-[#ff9cae]")} />{score.label}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar user={d.user} size={78} ring />
        <div className="min-w-0">
          <h1 className="font-display text-[32px] leading-[1.05] font-semibold tracking-[-0.035em]">{greeting}</h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-white/80">
            <span className="truncate">{d.user.email}</span>{d.user.emailVerified && <BadgeCheck className="size-4 shrink-0 text-[#8ff0c4]" />}
          </p>
        </div>
      </div>
      <dl className="mt-auto flex flex-wrap items-end gap-x-7 gap-y-3">
        {[["Membre depuis", since, false], ["Identifiant", cordId(d.user.id), true], ["Apps reliées", String(linked), false]].map(([k, v, mono]) => (
          <div key={String(k)}>
            <dt className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-white/60 uppercase">{k}</dt>
            <dd className={cn("mt-1.5 font-semibold", mono ? "font-mono text-[13.5px] tracking-[0.06em]" : "font-display text-[15px]")}>{v}</dd>
          </div>
        ))}
        <span aria-hidden className="relative ml-auto h-[34px] w-[46px] rounded-lg bg-[linear-gradient(135deg,#f6e3a5,#caa24d_45%,#f3d98c_70%,#b88d3a)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.2)] after:absolute after:inset-[7px_9px] after:rounded-[4px] after:border after:border-black/25" />
      </dl>
    </motion.div>
  );
}

function TodayPanel({ d, unread, onInbox }: { d: CordDashboard; unread: number; onInbox: () => void }) {
  const { go } = useAccount();
  const score = securityScore(d);
  const list = steps(d);
  const next = list.find(s => !s.done);
  const done = list.filter(s => s.done).length;
  const today = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(Date.now());
  return (
    <GlassCard variants={itemVariants} className="rounded-[28px] p-5">
      <div className="relative z-[3] flex h-full flex-col gap-4">
        <p className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-fg-subtle uppercase">Aujourd’hui · {today}</p>
        <button type="button" onClick={() => go("securite")} className="flex items-center gap-3.5 rounded-[18px] text-left transition-opacity hover:opacity-85">
          <ScoreRing value={score.value} size={78} />
          <span><strong className="block text-[16px]">{score.label}</strong><small className="text-[12.5px] text-fg-subtle">{done} sur {list.length} étapes</small></span>
        </button>
        {next ? (
          <div className="grid justify-items-start gap-1 rounded-[16px] bg-[var(--control)] p-3.5 ring-1 ring-[var(--line)] ring-inset">
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-fg-subtle uppercase">Prochaine étape</p>
            <p className="font-semibold">{next.label}</p>
            <p className="text-[13px] text-fg-muted">{next.desc}</p>
            {(next.tab || next.url) && (
              <GlassButton size="sm" variant="primary" className="mt-1.5" trailingIcon={<ArrowRight className="size-3.5" />}
                onClick={() => (next.url ? void openExternal(next.url) : go(next.tab!))}>Y aller</GlassButton>
            )}
          </div>
        ) : (
          <div className="grid gap-1 rounded-[16px] bg-[var(--control)] p-3.5 ring-1 ring-[var(--line)] ring-inset">
            <p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="size-4 text-ok" />Tout est en ordre</p>
            <p className="text-[13px] text-fg-muted">Ton compte est protégé et relié à ta suite.</p>
          </div>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2.5">
          <button type="button" onClick={onInbox} className="grid gap-1 rounded-[16px] bg-[var(--control)] p-3 text-left ring-1 ring-[var(--line)] ring-inset transition-colors hover:bg-[var(--control-hover)]">
            <strong className="font-display text-[24px] leading-none">{unread}</strong>
            <span className="flex items-center gap-1.5 text-[12px] text-fg-subtle"><Bell className="size-3.5" />non lue(s)</span>
          </button>
          <button type="button" onClick={() => go("appareils")} className="grid gap-1 rounded-[16px] bg-[var(--control)] p-3 text-left ring-1 ring-[var(--line)] ring-inset transition-colors hover:bg-[var(--control-hover)]">
            <strong className="font-display text-[24px] leading-none">{d.sessions.length}</strong>
            <span className="flex items-center gap-1.5 text-[12px] text-fg-subtle"><MonitorSmartphone className="size-3.5" />session(s)</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

// ── La suite ─────────────────────────────────────────────────────────────────

function StatusBody({ s }: { s: CordAppStatus }) {
  return (
    <div className="grid gap-1.5">
      <p className="font-display text-[20px] leading-tight font-semibold tracking-[-0.02em]">{s.headline}</p>
      {s.detail && <p className="text-[13px] text-fg-muted">{s.detail}</p>}
      {!!s.metrics.length && (
        <div className="mt-1 flex flex-wrap gap-2">
          {s.metrics.map(m => (
            <span key={m.label} className="grid gap-0.5 rounded-[12px] bg-[var(--control)] px-3 py-2 text-[11.5px] text-fg-subtle">
              <strong className="font-display text-[16px] leading-none text-fg">{m.value}</strong>{m.label}
            </span>
          ))}
        </div>
      )}
      <p className="mt-1 font-mono text-[11px] text-fg-subtle">Mis à jour {relative(s.updatedAt)}</p>
    </div>
  );
}

function Tile({ app, wide }: { app: CordHubApp; wide: boolean }) {
  const { go } = useAccount();
  const s = app.appStatus;
  const [a, b] = app.accent;
  const open = (url: string | null) => url && void openExternal(url);
  let body;
  let action = null;
  if (app.beta && !app.connected) {
    body = <p className="font-display text-[18px] font-semibold">{app.beta.access ? "Tu es testeur" : "Bêta fermée, sur invitation."}</p>;
    action = <GlassButton size="sm" variant={app.beta.access ? "primary" : "glass"} trailingIcon={<ArrowRight className="size-3.5" />} onClick={() => go("apps")}>{app.beta.access ? "Installer" : "Rejoindre la bêta"}</GlassButton>;
  } else if (app.connected && s) {
    body = <StatusBody s={s} />;
    action = app.launch && <GlassButton size="sm" variant="primary" trailingIcon={<ArrowUpRight className="size-3.5" />} onClick={() => open(s.url ?? app.launch)}>Ouvrir</GlassButton>;
  } else if (app.connected) {
    body = <p className="text-[13px] text-fg-muted">Reliée à ton compte. Ouvre-la pour que son résumé apparaisse ici.</p>;
    action = app.launch && <GlassButton size="sm" variant="primary" trailingIcon={<ArrowUpRight className="size-3.5" />} onClick={() => open(app.launch)}>Ouvrir</GlassButton>;
  } else {
    body = <p className="text-[13px] text-fg-muted">{app.description}</p>;
    action = app.launch && <GlassButton size="sm" variant="glass" trailingIcon={<ArrowUpRight className="size-3.5" />} onClick={() => open(app.launch)}>Commencer avec Cord</GlassButton>;
  }
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={springSoft}
      className={cn("group relative isolate flex min-h-[190px] flex-col gap-3.5 overflow-hidden rounded-[24px] bg-[var(--glass-fill)] p-[18px] ring-1 ring-[var(--glass-stroke)] ring-inset", wide ? "sm:col-span-2" : "")}
    >
      <span aria-hidden className={cn("absolute -right-[30%] -bottom-[60%] -z-10 aspect-square w-[75%] rounded-full transition-opacity duration-300 group-hover:opacity-90", app.connected ? "opacity-60" : "opacity-30")}
        style={{ background: `radial-gradient(circle, color-mix(in oklab, ${b} 50%, transparent), transparent 65%)` }} />
      <header className="flex items-center gap-3">
        <img src={cordAsset(app.logo) ?? undefined} alt="" className="size-11 shrink-0 rounded-[13px]" style={{ boxShadow: `0 10px 24px -12px ${a}` }} />
        <div className="min-w-0 flex-1"><h3 className="text-[16px] font-semibold">{app.name}</h3><p className="truncate text-[12.5px] text-fg-subtle">{app.tagline}</p></div>
        {app.connected ? <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[10.5px] font-semibold tracking-[0.06em] uppercase", TONES.ok)}><span className="size-1.5 rounded-full bg-current" />Reliée</span>
          : app.beta ? <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-[10.5px] font-semibold uppercase", TONES.warn)}>Bêta</span> : null}
      </header>
      <div>{body}</div>
      {action && <footer className="mt-auto flex gap-2">{action}</footer>}
    </motion.article>
  );
}

function Suite() {
  const { hub } = useCordAccount();
  if (!hub) return <div className="grid gap-3 sm:grid-cols-3">{[0, 1, 2].map(i => <Skeleton key={i} className="h-[190px] rounded-[24px]" />)}</div>;
  const active = hub.apps.filter(a => a.status !== "soon")
    .sort((x, y) => Number(y.connected) - Number(x.connected) || Number(Boolean(y.appStatus)) - Number(Boolean(x.appStatus)));
  const soon = hub.apps.filter(a => a.status === "soon");
  return (
    <section className="grid gap-3.5">
      <motion.div variants={itemVariants} className="px-1">
        <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em]">Ta suite</h2>
        <p className="mt-1 text-[13.5px] text-fg-muted">Chaque app reliée à ton compte Cord te montre où tu en es, et s’ouvre déjà connectée.</p>
      </motion.div>
      <div className="grid gap-3.5 sm:grid-cols-3">
        {active.map(app => <Tile key={app.slug} app={app} wide={app.connected && !!app.appStatus} />)}
        {hub.launcher && (
          <motion.article variants={itemVariants} className="relative isolate flex min-h-[190px] flex-col gap-3.5 overflow-hidden rounded-[24px] bg-[var(--glass-fill)] p-[18px] ring-1 ring-[var(--glass-stroke)] ring-inset">
            <span aria-hidden className="absolute -right-[30%] -bottom-[60%] -z-10 aspect-square w-[75%] rounded-full opacity-60" style={{ background: "radial-gradient(circle, color-mix(in oklab, #b842ec 50%, transparent), transparent 65%)" }} />
            <header className="flex items-center gap-3">
              <img src="/logos/cordsuite.png" alt="" className="size-11 rounded-[13px]" />
              <div className="min-w-0 flex-1"><h3 className="text-[16px] font-semibold">CordLauncher</h3><p className="text-[12.5px] text-fg-subtle">Ce PC</p></div>
            </header>
            <StatusBody s={hub.launcher} />
          </motion.article>
        )}
      </div>
      {!!soon.length && (
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 px-1">
          <span className="mr-1 font-mono text-[10.5px] font-semibold tracking-[0.16em] text-fg-subtle uppercase">Bientôt dans la suite</span>
          {soon.map(app => (
            <span key={app.slug} title={app.description} className="inline-flex h-[34px] items-center gap-2 rounded-full bg-[var(--control)] py-0 pr-3 pl-1.5 text-[13px] text-fg-muted ring-1 ring-[var(--line)] ring-inset">
              <img src={cordAsset(app.logo) ?? undefined} alt="" className="size-[22px] rounded-[7px] saturate-[0.65]" />{app.name}
            </span>
          ))}
        </motion.div>
      )}
    </section>
  );
}

// ── Fil de la suite et notifications ────────────────────────────────────────

function Feed({ d }: { d: CordDashboard }) {
  const { inbox } = useCordAccount();
  const { go } = useAccount();
  const items = [
    ...(inbox ?? []).slice(0, 8).map(n => ({ at: n.createdAt, n })),
    ...d.activity.slice(0, 8).map(e => ({ at: e.at, e })),
  ].sort((x, y) => y.at - x.at).slice(0, 8);
  return (
    <GlassCard variants={itemVariants} className="rounded-[26px] p-6">
      <div className="relative z-[3]">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[17px] font-semibold">Fil de la suite</h3>
            <p className="mt-1 text-[13.5px] text-fg-muted">Ce que tes apps t’envoient et ce qui se passe sur ton compte.</p>
          </div>
          <GlassButton size="sm" variant="ghost" onClick={() => go("activite")}>Tout voir</GlassButton>
        </div>
        {items.length ? (
          <ol className="mt-4 grid gap-1">
            {items.map(it => "n" in it && it.n ? (
              <li key={it.n.id} className={cn("flex items-center gap-3 rounded-[14px] p-2.5", !it.n.readAt && "bg-[color-mix(in_oklab,var(--tint-a)_10%,transparent)]")}>
                <img src={cordAsset(it.n.logo) ?? "/logos/cordsuite.png"} alt="" className="size-[34px] shrink-0 rounded-[10px]" />
                <div className="min-w-0 flex-1"><p className="truncate text-[14px]"><strong>{it.n.name}</strong> · {it.n.title}</p>{it.n.body && <p className="truncate text-[12.5px] text-fg-subtle">{it.n.body}</p>}</div>
                <time className="shrink-0 font-mono text-[11.5px] text-fg-subtle">{relative(it.at)}</time>
                {it.n.url && <GlassButton size="icon-sm" variant="ghost" aria-label="Ouvrir" onClick={() => void openExternal(it.n.url!)}><ArrowUpRight className="size-3.5" /></GlassButton>}
              </li>
            ) : "e" in it && it.e ? (() => {
              const [label, Icon, tone] = EVENTS[it.e.kind] ?? [it.e.kind, Orbit, "muted" as const];
              return (
                <li key={it.e.id} className="flex items-center gap-3 rounded-[14px] p-2.5">
                  <IconBadge icon={Icon} tone={tone} size="sm" />
                  <div className="min-w-0 flex-1"><p className="truncate text-[14px]">{label}</p>{it.e.device && <p className="truncate text-[12.5px] text-fg-subtle">{it.e.device.label}</p>}</div>
                  <time className="shrink-0 font-mono text-[11.5px] text-fg-subtle">{relative(it.at)}</time>
                </li>
              );
            })() : null)}
          </ol>
        ) : <div className="mt-4"><Empty icon={Orbit} title="Rien pour l’instant" desc="Les nouvelles de tes apps et de ton compte arriveront ici." /></div>}
      </div>
    </GlassCard>
  );
}

/** Boîte de notifications (cloche) : ce que les apps de la suite envoient. */
export function InboxModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { inbox } = useCordAccount();
  useEffect(() => { if (open) void loadInbox().catch(() => {}); }, [open]);
  return (
    <GlassModal open={open} onClose={onClose} width={500} labelledBy="inbox-title">
      <div className="relative z-[3] flex max-h-full flex-col gap-4 overflow-y-auto p-7">
        <div className="flex items-start gap-4 pr-8">
          <IconBadge icon={Bell} />
          <div><h2 id="inbox-title" className="font-display text-xl font-semibold">Notifications</h2><p className="mt-1 text-[13.5px] text-fg-muted">Envoyées par les apps reliées à ton compte Cord.</p></div>
        </div>
        {!inbox ? <div className="grid gap-2">{[0, 1, 2].map(i => <Skeleton key={i} className="h-16 rounded-[14px]" />)}</div>
          : !inbox.length ? <Empty icon={Bell} title="Aucune notification" desc="Quand une app de la suite a du nouveau pour toi, ça s’affiche ici." />
          : (
            <ol className="grid gap-2">
              <AnimatePresence initial={false}>
                {inbox.map(n => (
                  <motion.li key={n.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                    className={cn("flex gap-3 rounded-[14px] bg-[var(--control)] p-3 ring-1 ring-inset", n.readAt ? "ring-[var(--line)]" : "ring-[color-mix(in_oklab,var(--tint-a)_45%,transparent)]")}>
                    <img src={cordAsset(n.logo) ?? "/logos/cordsuite.png"} alt="" className="size-9 shrink-0 rounded-[10px]" />
                    <div className="min-w-0 flex-1">
                      <p className="flex justify-between gap-2 text-[12px] text-fg-subtle"><span>{n.name}</span><time className="font-mono">{relative(n.createdAt)}</time></p>
                      <p className="text-[14px] font-semibold">{n.title}</p>
                      {n.body && <p className="text-[13px] text-fg-muted">{n.body}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      {n.url && <GlassButton size="icon-sm" variant="glass" aria-label="Ouvrir" onClick={() => { void openExternal(n.url!); void markInboxRead([n.id]).catch(() => {}); }}><ArrowUpRight className="size-3.5" /></GlassButton>}
                      <GlassButton size="icon-sm" variant="ghost" aria-label="Supprimer" onClick={() => void deleteNotification(n.id).catch(() => {})}><Trash2 className="size-3.5" /></GlassButton>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          )}
        <div className="flex justify-end">
          <GlassButton variant="ghost" icon={<CheckCheck className="size-4" />} disabled={!inbox?.some(n => !n.readAt)} onClick={() => void markInboxRead().catch(() => {})}>Tout marquer comme lu</GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}

// ── Accueil ──────────────────────────────────────────────────────────────────

export function Overview() {
  const { d } = useAccount();
  const { hub, inbox } = useCordAccount();
  const [inboxOpen, setInboxOpen] = useState(false);
  useEffect(() => { if (!inbox) void loadInbox().catch(() => {}); }, [inbox]);
  const linked = hub ? hub.apps.filter(a => a.connected).length : d.apps.length;
  return (
    <>
      <VerifyBanner />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <CordCard d={d} linked={linked} />
        <TodayPanel d={d} unread={hub?.unread ?? d.unread ?? 0} onInbox={() => setInboxOpen(true)} />
      </div>
      <Suite />
      <Feed d={d} />
      <InboxModal open={inboxOpen} onClose={() => setInboxOpen(false)} />
    </>
  );
}

/** En-tête compact des autres onglets : avatar, nom, score. */
export function AccountHero() {
  const { d, go } = useAccount();
  const score = securityScore(d);
  return (
    <GlassCard variants={itemVariants} className="overflow-hidden rounded-[24px] p-4">
      <div className="relative z-[3] flex flex-wrap items-center gap-4">
        <Avatar user={d.user} size={52} ring />
        <div className="min-w-[200px] flex-1">
          <p className="font-display text-[18px] font-semibold tracking-[-0.02em]">{d.user.name}</p>
          <p className="text-[13px] text-fg-muted">{d.user.email}</p>
        </div>
        <button type="button" onClick={() => go("securite")} className="flex items-center gap-2.5 rounded-[16px] p-1.5 pr-3 transition-colors hover:bg-[var(--control)]">
          <ScoreRing value={score.value} size={52} />
          <span className={cn("text-[12.5px] font-semibold", score.tone === "ok" ? "text-ok" : score.tone === "warn" ? "text-warn" : "text-danger")}>{score.label}</span>
        </button>
      </div>
    </GlassCard>
  );
}
