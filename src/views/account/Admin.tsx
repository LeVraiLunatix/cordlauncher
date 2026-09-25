import { AlertTriangle, Check, Copy, KeyRound, LogIn, MailCheck, MessageSquareText, MonitorSmartphone, RefreshCw, Server, Smartphone, Sparkles, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { GlassButton, GlassCard, GlassModal, GlassSegmented, Skeleton } from "../../components/glass";
import { cordAsset, cordRequest } from "../../lib/account";
import type { BetaAdmin, BetaKey } from "../../lib/beta";
import { easeGlass, itemVariants, springSoft } from "../../lib/motion";
import { toast } from "../../lib/toast";
import { useAccount } from "./context";
import { Avatar, dateShort, Empty, IconBadge, ListRow, Panel, Pill, Progress, relative, type Tone } from "./kit";

type Overview = {
  totals: Record<"users" | "verified" | "mfa" | "passkey_users" | "passcord_users" | "sessions" | "signups7" | "signups30" | "logins24" | "failures24", number>;
  signups: { day: number; count: number }[];
  clients: { id: string; name: string; logo: string | null; redirectUris: string[]; users: number; lastUsedAt: number | null }[];
  mail: boolean;
};
type AdminTab = "overview" | "beta";

/** Administration (propriétaire, CORD_ADMINS) : statistiques et bêta fermée de Passcord. */
export function Admin() {
  const [tab, setTab] = useState<AdminTab>("overview");
  return (
    <>
      <motion.div variants={itemVariants}>
        <GlassSegmented<AdminTab>
          label="Administration"
          value={tab}
          onChange={setTab}
          options={[{ value: "overview", label: "Vue d’ensemble" }, { value: "beta", label: "Bêta Passcord" }]}
        />
      </motion.div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          className="grid gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: springSoft }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: easeGlass } }}
        >
          {tab === "overview" ? <OverviewTab /> : <BetaTab />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// ── Vue d'ensemble ───────────────────────────────────────────────────────────

function OverviewTab() {
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([[Users, t.users, "Comptes", "tint"], [MailCheck, t.verified, "Emails vérifiés", "ok"], [MonitorSmartphone, t.sessions, "Sessions actives", "info"], [LogIn, t.logins24, "Connexions (24 h)", "warn"]] as const).map(([icon, value, label, tone]) => (
          <Stat key={label} icon={icon} value={value} label={label} tone={tone} />
        ))}
      </div>
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

function Stat({ icon, value, label, tone, small = false }: { icon: typeof Users; value: string | number; label: string; tone: Tone; small?: boolean }) {
  return (
    <GlassCard className="rounded-[22px] p-4">
      <div className="relative z-[3] grid gap-3">
        <IconBadge icon={icon} tone={tone} size="sm" />
        <motion.strong key={String(value)} className={small ? "font-display text-[20px] leading-tight" : "font-display text-[28px] leading-none"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{value}</motion.strong>
        <span className="text-[12.5px] text-fg-muted">{label}</span>
      </div>
    </GlassCard>
  );
}

// ── Bêta Passcord ────────────────────────────────────────────────────────────

const STATUS: Record<BetaKey["status"], [Tone, string]> = {
  active: ["ok", "Active"], used: ["muted", "Utilisée"], expired: ["warn", "Expirée"], revoked: ["danger", "Désactivée"],
};
const VALIDITY = [[0, "Sans limite"], [7, "7 jours"], [30, "30 jours"], [90, "90 jours"]] as const;
const invitation = (codes: string[]) =>
  `Tu es invité·e à la bêta fermée de Passcord !\n\n${codes.length > 1 ? "Tes clés d’accès" : "Ta clé d’accès"} :\n${codes.join("\n")}\n\n` +
  "Utilise-la sur https://compte.cordsuite.app/#apps (onglet Apps) ou dans CordLauncher (fiche Passcord → Rejoindre la bêta), " +
  "puis installe l’app sur ton iPhone.";

async function copy(text: string, title = "Copié dans le presse-papiers") {
  try {
    await navigator.clipboard.writeText(text);
    toast({ tone: "ok", title });
  } catch {
    toast({ tone: "error", title: "Copie impossible", description: "Sélectionne le texte et copie-le à la main." });
  }
}

function BetaTab() {
  const { openModal } = useAccount();
  const [data, setData] = useState<BetaAdmin | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<BetaKey[] | null>(null);
  const [count, setCount] = useState(1);
  const [maxUses, setMaxUses] = useState(1);
  const [days, setDays] = useState(30);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setError(null);
    cordRequest<BetaAdmin>("/api/admin/beta?product=passcord", undefined, "GET").then(setData, e => setError((e as Error).message));
  }, []);
  useEffect(load, [load]);

  async function generate() {
    setBusy(true);
    try {
      const { keys } = await cordRequest<{ keys: BetaKey[] }>("/api/admin/beta/keys", { product: "passcord", count, maxUses, expiresInDays: days, label });
      setCreated(keys);
      setLabel("");
      load();
    } catch (e) {
      toast({ tone: "error", title: "Clés non créées", description: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  const revoke = (k: BetaKey) => openModal({
    title: "Désactiver cette clé ?",
    desc: `PASS-••••-••••-${k.hint} ne pourra plus être utilisée. Les testeurs qui l’ont déjà utilisée gardent leur accès.`,
    icon: KeyRound, tone: "danger", danger: true, submit: "Désactiver",
    onSubmit: async () => {
      await cordRequest("/api/admin/beta/keys", { id: k.id }, "DELETE");
      toast({ tone: "info", title: "Clé désactivée" });
      load();
    },
  });
  const removeTester = (userId: string, name: string) => openModal({
    title: `Retirer ${name} de la bêta ?`,
    desc: "Son Compte Cord reste intact, mais il ne pourra plus télécharger Passcord sans une nouvelle clé.",
    icon: Users, tone: "danger", danger: true, submit: "Retirer",
    onSubmit: async () => {
      await cordRequest("/api/admin/beta/testers", { userId, product: "passcord" }, "DELETE");
      toast({ tone: "info", title: "Testeur retiré" });
      load();
    },
  });

  if (error) return <Panel title="Bêta indisponible" desc={error} actions={<GlassButton size="sm" variant="glass" onClick={load}>Réessayer</GlassButton>} />;
  if (!data) return <div className="grid gap-3"><div className="grid grid-cols-3 gap-3">{[0, 1, 2].map(i => <Skeleton key={i} className="h-28 rounded-[22px]" />)}</div><Skeleton className="h-56 rounded-[22px]" /></div>;

  const active = data.keys.filter(k => k.status === "active").length;
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat icon={KeyRound} value={active} label="Clés actives" tone="ok" />
        <Stat icon={Users} value={data.testers.length} label="Testeurs" tone="info" />
        <Stat icon={Smartphone} value={data.release?.build ?? "Aucun"} small label={data.release?.publishedAt ? `Dernier build · ${relative(data.release.publishedAt)}` : "Dernier build"} tone="tint" />
      </div>

      {!data.downloads && (
        <div className="flex gap-3 rounded-[20px] bg-[color-mix(in_oklab,var(--warn)_12%,transparent)] p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warn" />
          <p><strong>Téléchargement direct non configuré.</strong> <span className="text-fg-muted">Ajoute la variable <code>PASSCORD_RELEASES_TOKEN</code> (jeton GitHub en lecture seule sur le dépôt Passcord) au Compte Cord : les testeurs installeront alors l’app sans fichier à récupérer.</span></p>
        </div>
      )}

      <Panel icon={Sparkles} title="Générer des clés" desc="Chaque clé n’est affichée qu’une fois : copie-la avant de fermer.">
        <form className="grid gap-3 sm:grid-cols-[repeat(3,minmax(0,1fr))]" onSubmit={e => { e.preventDefault(); void generate(); }}>
          <label className="grid gap-1.5 text-[13px] text-fg-muted">Nombre de clés
            <input className="cord-input" type="number" min={1} max={50} value={count} onChange={e => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} />
          </label>
          <label className="grid gap-1.5 text-[13px] text-fg-muted">Utilisations par clé
            <input className="cord-input" type="number" min={1} max={1000} value={maxUses} onChange={e => setMaxUses(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))} />
          </label>
          <label className="grid gap-1.5 text-[13px] text-fg-muted">Validité
            <select className="cord-input" value={days} onChange={e => setDays(Number(e.target.value))}>
              {VALIDITY.map(([n, text]) => <option key={n} value={n}>{text}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-[13px] text-fg-muted sm:col-span-2">Note (facultatif)
            <input className="cord-input" maxLength={60} placeholder="Ex. Serveur Discord, amis…" value={label} onChange={e => setLabel(e.target.value)} />
          </label>
          <div className="flex items-end justify-end">
            <GlassButton type="submit" variant="primary" loading={busy} icon={<KeyRound className="size-4" />}>Générer</GlassButton>
          </div>
        </form>
      </Panel>

      <Panel icon={KeyRound} title="Clés d’accès" desc={`${data.keys.length} clé(s) · les clés ne sont jamais réaffichées en entier`}
        actions={<GlassButton size="sm" variant="ghost" icon={<RefreshCw className="size-3.5" />} onClick={load}>Actualiser</GlassButton>}>
        {data.keys.length ? (
          <motion.div layout className="grid gap-1.5">
            <AnimatePresence initial={false}>
              {data.keys.map(k => {
                const [tone, text] = STATUS[k.status];
                return (
                  <motion.div key={k.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex flex-wrap items-center gap-3 rounded-[16px] bg-[var(--control)] px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[13.5px] font-semibold tracking-[0.04em]">PASS-••••-••••-{k.hint}</p>
                      <p className="mt-0.5 truncate text-[12px] text-fg-subtle">{k.label ? `${k.label} · ` : ""}créée {relative(k.createdAt)} · {k.expiresAt ? `expire le ${dateShort(k.expiresAt)}` : "sans limite"}</p>
                    </div>
                    <span className="font-mono text-[12.5px] text-fg-muted">{k.uses} / {k.maxUses}</span>
                    <Pill tone={tone}>{text}</Pill>
                    {k.status === "active" && <GlassButton size="sm" variant="ghost" onClick={() => revoke(k)}>Désactiver</GlassButton>}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : <Empty icon={KeyRound} title="Aucune clé pour l’instant" desc="Génère une première clé pour inviter un testeur." />}
      </Panel>

      <Panel icon={Users} title="Testeurs" desc="Les comptes Cord qui ont utilisé une clé.">
        {data.testers.length ? (
          <div className="grid gap-1">
            {data.testers.map(u => (
              <ListRow key={u.userId}
                lead={<Avatar user={{ id: u.userId, name: u.name, avatarUrl: null }} size={40} />}
                title={u.name}
                meta={<>{u.email} · a rejoint {relative(u.grantedAt)}{u.keyHint ? <span className="font-mono"> · via {u.keyLabel ?? `…${u.keyHint}`}</span> : null}</>}
                actions={<GlassButton size="sm" variant="ghost" onClick={() => removeTester(u.userId, u.name)}>Retirer</GlassButton>} />
            ))}
          </div>
        ) : <Empty icon={Users} title="Aucun testeur" desc="Ils apparaîtront ici dès qu’ils auront utilisé une clé." />}
      </Panel>

      <CreatedKeys keys={created} onClose={() => setCreated(null)} />
    </>
  );
}

/** Fenêtre des clés tout juste créées : seule occasion de les voir en entier. */
function CreatedKeys({ keys, onClose }: { keys: BetaKey[] | null; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const codes = keys?.map(k => k.code!).filter(Boolean) ?? [];
  const copyOne = (code: string) => { void copy(code); setCopied(code); setTimeout(() => setCopied(c => (c === code ? null : c)), 1600); };
  return (
    <GlassModal open={!!keys} onClose={onClose} width={codes.length > 6 ? 660 : 560} labelledBy="beta-created-title">
      {keys && (
        <div className="relative z-[3] flex max-h-full flex-col gap-5 overflow-y-auto p-8">
          <div className="flex items-start gap-4 pr-8">
            <IconBadge icon={Sparkles} tone="ok" />
            <div>
              <h2 id="beta-created-title" className="font-display text-xl font-semibold tracking-[-0.02em]">{codes.length > 1 ? `${codes.length} clés créées` : "Clé créée"}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">Elles ne seront plus jamais affichées en entier : copie-les maintenant.</p>
            </div>
          </div>
          <ul className={codes.length > 6 ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
            {codes.map((code, i) => (
              <motion.li key={code} className="flex items-center justify-between gap-2 rounded-[14px] bg-[var(--control)] py-2 pr-2 pl-4"
                initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { ...springSoft, delay: 0.08 + i * 0.05 } }}>
                <code className="font-mono text-[15px] font-semibold tracking-[0.06em] select-all">{code}</code>
                <GlassButton size="icon-sm" variant="ghost" aria-label={`Copier ${code}`} onClick={() => copyOne(code)}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {copied === code
                      ? <motion.span key="ok" initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0.4 }}><Check className="size-3.5 text-ok" strokeWidth={3} /></motion.span>
                      : <motion.span key="copy" initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0.4 }}><Copy className="size-3.5" /></motion.span>}
                  </AnimatePresence>
                </GlassButton>
              </motion.li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-end gap-2">
            <GlassButton variant="ghost" icon={<MessageSquareText className="size-4" />} onClick={() => void copy(invitation(codes), "Message d’invitation copié")}>Copier un message d’invitation</GlassButton>
            <GlassButton variant="glass" icon={<Copy className="size-4" />} onClick={() => void copy(codes.join("\n"), codes.length > 1 ? "Clés copiées" : "Clé copiée")}>{codes.length > 1 ? "Tout copier" : "Copier"}</GlassButton>
            <GlassButton variant="primary" onClick={onClose}>C’est noté</GlassButton>
          </div>
        </div>
      )}
    </GlassModal>
  );
}

