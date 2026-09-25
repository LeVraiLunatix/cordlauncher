import { LogIn, MailCheck, MonitorSmartphone, RefreshCw, Server, Users } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { GlassButton, GlassCard, Skeleton } from "../../components/glass";
import { cordAsset, cordRequest } from "../../lib/account";
import { itemVariants } from "../../lib/motion";
import { dateShort, IconBadge, Panel, Pill, Progress, relative } from "./kit";

type Overview = {
  totals: Record<"users" | "verified" | "mfa" | "passkey_users" | "passcord_users" | "sessions" | "signups7" | "signups30" | "logins24" | "failures24", number>;
  signups: { day: number; count: number }[];
  clients: { id: string; name: string; logo: string | null; redirectUris: string[]; users: number; lastUsedAt: number | null }[];
  mail: boolean;
};

/** Administration (propriétaire, CORD_ADMINS) : aucune donnée personnelle. */
export function Admin() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => {
    setData(null); setError(null);
    cordRequest<Overview>("/api/admin/overview", undefined, "GET").then(setData, e => setError((e as Error).message));
  }, []);
  useEffect(load, [load]);

  if (error) return <Panel title="Administration indisponible" desc={error} />;
  if (!data) return <div className="grid gap-3"><Skeleton className="h-24 rounded-[22px]" /><Skeleton className="h-48 rounded-[22px]" /></div>;

  const t = data.totals;
  const today = Math.floor(Date.now() / 86400_000);
  const byDay = new Map(data.signups.map(s => [s.day, s.count]));
  const days = Array.from({ length: 30 }, (_, i) => ({ day: (today - 29 + i) * 86400_000, count: byDay.get((today - 29 + i) * 86400_000) ?? 0 }));
  const max = Math.max(1, ...days.map(x => x.count));
  const pct = (n: number) => (t.users ? Math.round((n / t.users) * 100) : 0);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={data.mail ? "ok" : "warn"}>{data.mail ? "Resend configuré" : "Emails non configurés"}</Pill>
        <GlassButton size="sm" variant="ghost" icon={<RefreshCw className="size-3.5" />} onClick={load}>Actualiser</GlassButton>
      </div>
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([[Users, t.users, "Comptes", "tint"], [MailCheck, t.verified, "Emails vérifiés", "ok"], [MonitorSmartphone, t.sessions, "Sessions actives", "info"], [LogIn, t.logins24, "Connexions (24 h)", "warn"]] as const).map(([icon, value, label, tone]) => (
          <GlassCard key={label} className="rounded-[22px] p-4">
            <div className="relative z-[3] grid gap-3"><IconBadge icon={icon} tone={tone} size="sm" /><strong className="font-display text-[28px] leading-none">{value}</strong><span className="text-[12.5px] text-fg-muted">{label}</span></div>
          </GlassCard>
        ))}
      </motion.div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Inscriptions — 30 derniers jours" desc={`${t.signups7} cette semaine`}>
          <div className="flex h-36 items-end gap-1">
            {days.map((x, i) => (
              <motion.span key={x.day} title={`${dateShort(x.day)} · ${x.count}`} className={x.count ? "tint-fill flex-1 rounded-t-[5px] rounded-b-[2px]" : "flex-1 rounded-[2px] bg-[var(--control-hover)]"}
                style={{ height: `${Math.max(3, (x.count / max) * 100)}%`, originY: 1 }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.012, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[11px] text-fg-subtle"><span>{dateShort(days[0].day)}</span><span>{dateShort(days[29].day)}</span></div>
        </Panel>
        <Panel title="Adoption de la sécurité" desc={`${t.failures24} échec(s) de connexion en 24 h`}>
          <div className="grid gap-4">
            {([["Double authentification", t.mfa], ["Passkeys", t.passkey_users], ["Passcord", t.passcord_users]] as const).map(([label, n]) => (
              <div key={label} className="grid gap-1.5">
                <div className="flex justify-between text-[13.5px]"><span>{label}</span><span className="font-mono text-fg-subtle">{n} · {pct(n)} %</span></div>
                <Progress value={pct(n)} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel icon={Server} title="Clients OAuth" desc="Déclarés dans CORD_CLIENTS (les secrets ne sont jamais affichés).">
        <div className="grid gap-2">
          {data.clients.map(c => (
            <div key={c.id} className="flex flex-wrap items-center gap-3.5 rounded-[16px] bg-[var(--control)] p-3.5">
              {c.logo ? <img src={cordAsset(c.logo) ?? undefined} alt="" className="size-10 rounded-[11px]" /> : <span className="tint-fill grid size-10 place-items-center rounded-[11px] font-semibold text-white">{c.name[0]}</span>}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.name} <span className="font-mono text-[12px] font-normal text-fg-subtle">{c.id}</span></p>
                {c.redirectUris.map(u => <p key={u} className="truncate font-mono text-[11.5px] text-fg-subtle">{u}</p>)}
              </div>
              <div className="text-right text-[12.5px] text-fg-muted"><p><strong className="text-fg">{c.users}</strong> compte(s)</p><p>{c.lastUsedAt ? relative(c.lastUsedAt) : "Jamais utilisé"}</p></div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
