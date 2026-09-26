import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { GlassButton, GlassCard, GlassModal } from "../../components/glass";
import { CordError, cordAsset, type CordUser } from "../../lib/account";
import { cn } from "../../lib/cn";
import { itemVariants } from "../../lib/motion";

/* Briques communes des pages « Compte Cord » : mêmes sections que le portail
 * compte.cordsuite.app, dessinées avec le verre de CordLauncher. */

export type Tone = "tint" | "ok" | "warn" | "danger" | "info" | "muted";
export const TONES: Record<Tone, string> = {
  tint: "tint-fill text-white",
  ok: "bg-ok/14 text-ok ring-1 ring-inset ring-ok/25",
  warn: "bg-warn/14 text-warn ring-1 ring-inset ring-warn/25",
  danger: "bg-danger/14 text-danger ring-1 ring-inset ring-danger/25",
  info: "bg-info/14 text-info ring-1 ring-inset ring-info/25",
  muted: "bg-[var(--control)] text-fg-muted ring-1 ring-inset ring-[var(--line)]",
};

export function IconBadge({ icon: Icon, tone = "tint", size = "md" }: { icon: LucideIcon; tone?: Tone; size?: "sm" | "md" | "lg" }) {
  const box = { sm: "size-8 rounded-[10px]", md: "size-10 rounded-[12px]", lg: "size-14 rounded-[17px]" }[size];
  const glyph = { sm: "size-4", md: "size-[18px]", lg: "size-6" }[size];
  return <span className={cn("grid shrink-0 place-items-center", box, TONES[tone])}><Icon className={glyph} strokeWidth={2} /></span>;
}

/** Carte de section : icône, titre, description, actions, contenu. */
export function Panel({ icon, tone, title, desc, actions, children, className }: {
  icon?: LucideIcon; tone?: Tone; title?: ReactNode; desc?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string;
}) {
  return (
    <GlassCard variants={itemVariants} className={cn("rounded-[26px] p-6", className)}>
      <div className="relative z-[3]">
        {(icon || title || desc || actions) && <div className="flex flex-wrap items-start gap-4">
          {icon && <IconBadge icon={icon} tone={tone} />}
          <div className="min-w-0 flex-1">
            {title && <h3 className="font-display text-[17px] font-semibold tracking-[-0.015em]">{title}</h3>}
            {desc && <p className="mt-1 text-[13.5px] leading-relaxed text-fg-muted">{desc}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>}
        {children && <div className={icon || title ? "mt-5" : undefined}>{children}</div>}
      </div>
    </GlassCard>
  );
}

/** Ligne de liste : icône, titre + méta, actions à droite. */
export function ListRow({ lead, title, meta, actions }: { lead: ReactNode; title: ReactNode; meta?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3.5 rounded-[16px] px-3 py-3 transition-colors hover:bg-[var(--control)]">
      {lead}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">{title}</div>
        {meta && <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[12.5px] text-fg-subtle">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </div>
  );
}

export function Pill({ tone = "muted", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn("inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase", TONES[tone])}>{children}</span>;
}

export function Empty({ icon: Icon, title, desc, action }: { icon: LucideIcon; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-2.5 rounded-[18px] border border-dashed border-[var(--line)] px-5 py-8 text-center">
      <IconBadge icon={Icon} tone="muted" size="lg" />
      <p className="font-semibold">{title}</p>
      {desc && <p className="max-w-[44ch] text-[13.5px] text-fg-muted">{desc}</p>}
      {action}
    </div>
  );
}

/** Avatar : photo si présente, sinon dégradé + initiales (comme le portail). */
const ACCENTS: [string, string][] = [["#6D64F2", "#C64BF1"], ["#126A84", "#1CC3E0"], ["#BD2F98", "#F65D63"], ["#1E8FDC", "#1E61DC"], ["#19A684", "#37CC94"], ["#F16C8E", "#F9A159"], ["#EB981F", "#EF6327"], ["#6E58F0", "#B842EC"]];
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function Avatar({ user, size = 40, ring = false }: { user: Pick<CordUser, "id" | "name" | "avatarUrl">; size?: number; ring?: boolean }) {
  const seed = hash(user.id || user.name);
  const [a, b] = ACCENTS[seed % ACCENTS.length];
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() ?? "").join("") || "?";
  const src = cordAsset(user.avatarUrl);
  const face = src
    ? <img src={src} alt="" className="size-full object-cover" />
    : <span className="grid size-full place-items-center font-display font-semibold text-white" style={{ background: `linear-gradient(${seed % 180}deg, ${a}, ${b})`, fontSize: size * 0.38 }}>{initials}</span>;
  return (
    <span className={cn("inline-block shrink-0 rounded-full", ring && "tint-fill p-[3px] shadow-[0_14px_36px_-14px_var(--tint-a)]")} style={{ width: size, height: size }}>
      <span className={cn("block size-full overflow-hidden rounded-full", ring && "ring-[3px] ring-[var(--bg)]")}>{face}</span>
    </span>
  );
}

/** Anneau de score 0-100. */
export function ScoreRing({ value, size = 104, caption = "sécurité" }: { value: number; size?: number; caption?: string }) {
  const gid = useId();
  const stroke = size / 11;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`Score de ${caption} : ${value} sur 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--tint-a)" /><stop offset="1" stopColor="var(--tint-b)" /></linearGradient></defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="var(--control-hover)" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={`url(#${gid})`} strokeLinecap="round"
          strokeDasharray={length} initial={{ strokeDashoffset: length }} animate={{ strokeDashoffset: length * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      {/* Texte proportionnel à l'anneau ; la légende disparaît sous 80 px, où elle débordait. */}
      <div className="absolute inset-0 grid place-content-center text-center">
        <strong className="font-display leading-none tracking-[-0.03em]" style={{ fontSize: Math.round(size * 0.25) }}>{value}</strong>
        {size >= 80 && <small className="mt-1 text-[9.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">{caption}</small>}
      </div>
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[var(--control-hover)]">
      <motion.span className="tint-fill block h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  );
}

// ── Formulaires ─────────────────────────────────────────────────────────────

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block text-[13px] font-medium text-fg-muted">
      {label}
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1.5 block text-[12px] font-normal text-fg-subtle">{hint}</span>}
    </label>
  );
}

export function PasswordInput({ name, autoComplete = "current-password", minLength, required = true, autoFocus }: {
  name: string; autoComplete?: string; minLength?: number; required?: boolean; autoFocus?: boolean;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input className="cord-input pr-11" name={name} type={shown ? "text" : "password"} autoComplete={autoComplete} minLength={minLength} maxLength={512} required={required} autoFocus={autoFocus} spellCheck={false} />
      <button type="button" onClick={() => setShown(!shown)} aria-label={shown ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-fg-muted hover:bg-[var(--control-hover)] hover:text-fg">
        {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export type ModalSpec = {
  title: string;
  desc?: ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  body?: ReactNode;
  submit?: string;
  danger?: boolean;
  width?: number;
  /** Reçoit les champs du formulaire. Lever une erreur l'affiche dans la modale. */
  onSubmit?: (form: FormData) => Promise<void | boolean> | void | boolean;
};

/**
 * Modale d'action (formulaire + erreur + chargement). `onSubmit` qui renvoie
 * `false` garde la modale ouverte (assistant en plusieurs étapes).
 */
export function ActionModal({ spec, onClose }: { spec: ModalSpec | null; onClose: () => void }) {
  const titleId = useId();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!spec?.onSubmit) return onClose();
    setBusy(true);
    setError(null);
    try {
      if ((await spec.onSubmit(new FormData(e.currentTarget))) !== false) onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <GlassModal open={!!spec} onClose={() => { setError(null); onClose(); }} width={spec?.width ?? 500} labelledBy={titleId}>
      {spec && (
        <form className="relative z-[3] flex max-h-full flex-col gap-5 overflow-y-auto p-8" onSubmit={submit} onInput={() => setError(null)}>
          <div className="flex items-start gap-4 pr-8">
            {spec.icon && <IconBadge icon={spec.icon} tone={spec.tone ?? "tint"} />}
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="font-display text-xl font-semibold tracking-[-0.02em]">{spec.title}</h2>
              {spec.desc && <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">{spec.desc}</p>}
            </div>
          </div>
          {spec.body && <div className="space-y-4">{spec.body}</div>}
          {error && <p role="alert" className="rounded-[12px] bg-danger/12 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <GlassButton variant="ghost" onClick={() => { setError(null); onClose(); }}>Annuler</GlassButton>
            <GlassButton type="submit" variant={spec.danger ? "danger" : "primary"} loading={busy}
              className={spec.danger ? "bg-danger/14 ring-1 ring-danger/30" : undefined}>{spec.submit ?? "Valider"}</GlassButton>
          </div>
        </form>
      )}
    </GlassModal>
  );
}

/**
 * Action sensible (ajouter un facteur) : si la connexion date de plus de
 * 15 min, le serveur répond `reauth_required` ; on demande alors le mot de
 * passe via `askPassword` puis on rejoue avec.
 */
export async function withReauth<T>(call: (extra: { password?: string }) => Promise<T>, askPassword: () => Promise<string | null>): Promise<T | undefined> {
  try {
    return await call({});
  } catch (e) {
    if (!(e instanceof CordError) || e.reason !== "reauth_required") throw e;
  }
  const password = await askPassword();
  if (password === null) return undefined;
  return call({ password });
}

// ── Formats ─────────────────────────────────────────────────────────────────

const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });
export function relative(ms: number | null | undefined): string {
  if (!ms) return "—";
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  if (abs < 60_000) return "à l’instant";
  if (abs < 3600_000) return rtf.format(Math.round(diff / 60_000), "minute");
  if (abs < 86400_000) return rtf.format(Math.round(diff / 3600_000), "hour");
  if (abs < 30 * 86400_000) return rtf.format(Math.round(diff / 86400_000), "day");
  if (abs < 365 * 86400_000) return rtf.format(Math.round(diff / (30 * 86400_000)), "month");
  return rtf.format(Math.round(diff / (365 * 86400_000)), "year");
}
export const dateLong = (ms: number | null | undefined) => (ms ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(ms) : "—");
export const dateShort = (ms: number | null | undefined) => (ms ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(ms) : "—");
export const dateTime = (ms: number | null | undefined) => (ms ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(ms) : "—");
export const timeOnly = (ms: number) => new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(ms);
