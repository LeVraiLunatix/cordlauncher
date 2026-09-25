import { ArrowRight, Check, Clock, Fingerprint, LayoutGrid, MailWarning, MonitorSmartphone, Send, WandSparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { GlassButton, GlassCard } from "../../components/glass";
import { cordRequest, cordAsset, securityScore, useCordAccount } from "../../lib/account";
import { cn } from "../../lib/cn";
import { itemVariants } from "../../lib/motion";
import { openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useAccount, type AccountTab } from "./context";
import { Timeline } from "./Activity";
import { Avatar, IconBadge, Panel, Progress, relative, ScoreRing } from "./kit";

const HIDE_KEY = "cordlauncher:onboarding-hidden";

export function VerifyBanner() {
  const { d } = useAccount();
  const [busy, setBusy] = useState(false);
  if (d.user.emailVerified) return null;
  const send = async () => {
    setBusy(true);
    try {
      const r = await cordRequest<{ devUrl?: string }>("/api/email/send");
      toast({ tone: "ok", title: "Lien de confirmation envoyé", description: r.devUrl ?? `Regarde ta boîte ${d.user.email} (valable 15 minutes).` });
    } catch (e) {
      toast({ tone: "error", title: "Envoi impossible", description: String((e as Error).message) });
    } finally {
      setBusy(false);
    }
  };
  return (
    <GlassCard variants={itemVariants} className="rounded-[22px] p-4">
      <div className="relative z-[3] flex flex-wrap items-center gap-3.5">
        <IconBadge icon={MailWarning} tone="warn" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Confirme ton adresse email</p>
          <p className="text-[13px] text-fg-muted">Indispensable pour te connecter à Drivecord et aux autres apps avec ton compte Cord.</p>
        </div>
        <GlassButton size="sm" icon={<Send className="size-3.5" />} loading={busy} onClick={() => void send()}>Envoyer le lien</GlassButton>
      </div>
    </GlassCard>
  );
}

export function Overview() {
  const { d, go } = useAccount();
  const { suite } = useCordAccount();
  const [hidden, setHidden] = useState(() => localStorage.getItem(HIDE_KEY) === "1");
  const steps: { id: string; label: string; desc: string; done: boolean; tab?: AccountTab; url?: string }[] = [
    { id: "email", label: "Confirmer ton adresse email", desc: "Pour utiliser Cord dans les apps.", done: d.user.emailVerified },
    { id: "key", label: "Associer Passcord ou une passkey", desc: "Connexion sans mot de passe, validée par Face ID.", done: d.passkeys.length + d.passcord.length > 0, tab: "appareils" },
    { id: "mfa", label: "Activer la double authentification", desc: "Un code à usage unique en plus du mot de passe.", done: d.security.mfa, tab: "securite" },
    { id: "avatar", label: "Ajouter une photo", desc: "Pour te reconnaître d’un coup d’œil dans les apps.", done: Boolean(d.user.avatarUrl), tab: "profil" },
    { id: "app", label: "Connecter une app", desc: "Drivecord t’attend avec « Continuer avec Cord ».", done: d.apps.length > 0, url: "https://drivecord.app" },
  ];
  const done = steps.filter(s => s.done).length;
  const last = d.activity.find(e => e.kind === "login" || e.kind === "register");
  const connected = new Set(d.apps.map(a => a.id));
  const stats = [
    { icon: LayoutGrid, value: String(d.apps.length), label: "Apps connectées", tab: "apps" as const, tone: "tint" as const },
    { icon: MonitorSmartphone, value: String(d.sessions.length), label: "Sessions actives", tab: "appareils" as const, tone: "info" as const },
    { icon: Fingerprint, value: String(d.passkeys.length + d.passcord.length), label: "Clés sans mot de passe", tab: "securite" as const, tone: "ok" as const },
    { icon: Clock, value: last ? relative(last.at) : "—", label: "Dernière connexion", tab: "activite" as const, tone: "warn" as const, small: true },
  ];

  return (
    <>
      {done < steps.length && !hidden && (
        <Panel icon={WandSparkles} title="Bien démarrer" desc={`${done} sur ${steps.length} — encore quelques gestes pour un compte au top.`}
          actions={<GlassButton size="sm" variant="ghost" onClick={() => { localStorage.setItem(HIDE_KEY, "1"); setHidden(true); }}>Masquer</GlassButton>}>
          <div className="mb-4"><Progress value={(done / steps.length) * 100} /></div>
          <ul className="grid gap-2">
            {steps.map(s => (
              <li key={s.id} className="flex items-center gap-3.5 rounded-[15px] bg-[var(--control)] px-3.5 py-3 ring-1 ring-inset ring-[var(--line)]">
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full", s.done ? "bg-ok text-white" : "ring-2 ring-inset ring-[var(--line)]")}>
                  {s.done && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[14px] font-medium", s.done && "text-fg-subtle line-through")}>{s.label}</span>
                  {!s.done && <span className="block text-[12.5px] text-fg-subtle">{s.desc}</span>}
                </span>
                {!s.done && (s.tab || s.url) && (
                  <GlassButton size="sm" trailingIcon={<ArrowRight className="size-3.5" />} onClick={() => (s.url ? void openExternal(s.url) : go(s.tab!))}>Y aller</GlassButton>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(s => (
          <GlassCard key={s.label} interactive className="cursor-pointer rounded-[22px] p-4" onClick={() => go(s.tab)}>
            <div className="relative z-[3] grid gap-3">
              <IconBadge icon={s.icon} tone={s.tone} size="sm" />
              <strong className={cn("font-display leading-none tracking-[-0.04em]", s.small ? "text-[17px]" : "text-[28px]")}>{s.value}</strong>
              <span className="text-[12.5px] text-fg-muted">{s.label}</span>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Ta suite Cord" actions={<GlassButton size="sm" variant="ghost" onClick={() => go("apps")}>Tout voir</GlassButton>}>
          <div className="grid gap-1">
            {suite.filter(a => a.status !== "soon").map(a => (
              <div key={a.slug} className="flex items-center gap-3 rounded-[14px] px-2 py-2">
                <img src={cordAsset(a.logo) ?? undefined} alt="" className="size-10 rounded-[11px]" />
                <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold">{a.name}</span><span className="block text-[12.5px] text-fg-subtle">{a.tagline}</span></span>
                {connected.has(a.slug)
                  ? <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ok"><Check className="size-3.5" />Connectée</span>
                  : a.url ? <GlassButton size="sm" variant="ghost" onClick={() => void openExternal(a.url!)}>Découvrir</GlassButton>
                    : <span className="text-[12px] text-fg-subtle">En développement</span>}
              </div>
            ))}
            {!suite.length && <p className="text-sm text-fg-subtle">Chargement de la suite…</p>}
          </div>
        </Panel>
        <Panel title="Activité récente" actions={<GlassButton size="sm" variant="ghost" onClick={() => go("activite")}>Tout voir</GlassButton>}>
          <Timeline events={d.activity.slice(0, 5)} grouped={false} />
        </Panel>
      </div>
    </>
  );
}

/** En-tête du compte : avatar, salutation, score. */
export function AccountHero() {
  const { d, go } = useAccount();
  const score = securityScore(d);
  const hour = new Date().getHours();
  const first = d.user.name.split(/\s+/)[0];
  const greeting = hour >= 5 && hour < 18 ? `Bonjour, ${first}` : `Bonsoir, ${first}`;
  return (
    <GlassCard variants={itemVariants} className="overflow-hidden rounded-[28px] p-6">
      <div className="relative z-[3] flex flex-wrap items-center gap-6">
        <Avatar user={d.user} size={84} ring />
        <div className="min-w-[220px] flex-1">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Compte Cord</p>
          <h1 className="mt-1 font-display text-[30px] leading-tight font-semibold tracking-[-0.035em]">{greeting}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13.5px] text-fg-muted">
            <span>{d.user.email}</span>
            {d.user.emailVerified
              ? <span className="rounded-full bg-ok/14 px-2 py-0.5 text-[11px] font-semibold text-ok uppercase">Email vérifié</span>
              : <span className="rounded-full bg-warn/14 px-2 py-0.5 text-[11px] font-semibold text-warn uppercase">Email à confirmer</span>}
          </div>
        </div>
        <button type="button" onClick={() => go("securite")} className="grid justify-items-center gap-1.5 rounded-[20px] p-2 transition-colors hover:bg-[var(--control)]">
          <ScoreRing value={score.value} />
          <span className={cn("text-[12.5px] font-semibold", score.tone === "ok" ? "text-ok" : score.tone === "warn" ? "text-warn" : "text-danger")}>{score.label}</span>
        </button>
      </div>
    </GlassCard>
  );
}
