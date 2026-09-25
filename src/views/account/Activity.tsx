import { Activity as ActivityIcon, AppWindow, Download, AtSign, Ban, ChevronDown, History, Key, KeyRound, LogIn, LogOut, Mail, MailCheck, Pencil, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, Smartphone, Sparkles, Trash2, Fingerprint, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { GlassButton } from "../../components/glass";
import { cordRequest, type CordEvent } from "../../lib/account";
import { cn } from "../../lib/cn";
import { useAccount } from "./context";
import { dateLong, dateTime, Empty, IconBadge, Panel, relative, timeOnly, type Tone } from "./kit";

const EVENTS: Record<string, [string, LucideIcon, Tone]> = {
  register: ["Compte créé", Sparkles, "tint"], login: ["Connexion", LogIn, "info"], login_failed: ["Tentative de connexion refusée", Ban, "danger"],
  email_verified: ["Adresse email confirmée", MailCheck, "ok"], email_changed: ["Adresse email modifiée", AtSign, "warn"],
  password_changed: ["Mot de passe modifié", KeyRound, "warn"], password_reset: ["Mot de passe réinitialisé", RotateCcw, "warn"],
  password_reset_requested: ["Réinitialisation demandée", Mail, "muted"],
  mfa_enabled: ["Double authentification activée", ShieldCheck, "ok"], mfa_disabled: ["Double authentification désactivée", ShieldAlert, "danger"],
  recovery_used: ["Code de secours utilisé", Key, "warn"], recovery_regenerated: ["Codes de secours régénérés", RefreshCw, "muted"],
  passkey_added: ["Passkey ajoutée", Fingerprint, "ok"], passkey_removed: ["Passkey supprimée", Trash2, "muted"],
  passcord_paired: ["iPhone associé à Passcord", Smartphone, "ok"], passcord_revoked: ["iPhone Passcord révoqué", Trash2, "muted"],
  app_authorized: ["App autorisée", AppWindow, "tint"], app_revoked: ["Accès d’une app révoqué", Ban, "muted"],
  session_revoked: ["Session fermée à distance", LogOut, "muted"], sessions_revoked: ["Autres sessions fermées", LogOut, "muted"],
  profile_updated: ["Profil mis à jour", Pencil, "muted"],
  beta_joined: ["Bêta rejointe", KeyRound, "ok"], beta_download: ["Build de bêta téléchargé", Download, "info"], beta_keys_created: ["Clés de bêta générées", Key, "muted"], beta_downloads_configured: ["Installation directe de la bêta activée", Download, "ok"],
};
const VIA: Record<string, string> = { password: "mot de passe", passkey: "passkey", passcord: "Passcord", reset: "lien de réinitialisation", mfa: "code 2FA incorrect", register: "mot de passe", name: "nom", avatar: "photo" };
const GROUPS = {
  all: null,
  logins: ["register", "login", "login_failed", "session_revoked", "sessions_revoked"],
  security: ["password_changed", "password_reset", "password_reset_requested", "mfa_enabled", "mfa_disabled", "recovery_used", "recovery_regenerated", "passkey_added", "passkey_removed", "passcord_paired", "passcord_revoked", "email_changed", "email_verified"],
  apps: ["app_authorized", "app_revoked", "beta_joined", "beta_download", "beta_keys_created", "beta_downloads_configured"],
} as const;
const FILTER_LABELS = { all: "Tout", logins: "Connexions", security: "Sécurité", apps: "Apps" } as const;

function detail(e: CordEvent) {
  if (!e.detail) return null;
  if (["login", "register", "login_failed", "profile_updated"].includes(e.kind)) return VIA[e.detail] ?? null;
  if (e.kind === "sessions_revoked") return `× ${e.detail}`;
  return e.detail;
}
function dayLabel(ms: number) {
  const d = new Date(ms).toDateString();
  if (d === new Date().toDateString()) return "Aujourd’hui";
  if (d === new Date(Date.now() - 86400_000).toDateString()) return "Hier";
  return dateLong(ms);
}

export function Timeline({ events, grouped = true }: { events: CordEvent[]; grouped?: boolean }) {
  if (!events.length) return <Empty icon={History} title="Rien à signaler pour l’instant." desc="Tes connexions et tes changements apparaîtront ici." />;
  let lastDay = "";
  return (
    <ol className="grid">
      {events.map((e, i) => {
        const [label, icon, tone] = EVENTS[e.kind] ?? [e.kind, ActivityIcon, "muted"];
        const day = dayLabel(e.at);
        const header = grouped && day !== lastDay;
        lastDay = day;
        const next = events[i + 1];
        const last = !next || (grouped && dayLabel(next.at) !== day);
        const extra = detail(e);
        return (
          <li key={e.id}>
            {header && <p className={cn("mb-2 text-[10.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase", i > 0 && "mt-4")}>{day}</p>}
            <div className="relative flex gap-3.5 py-2">
              {!last && <span aria-hidden className="absolute top-12 bottom-[-8px] left-4 w-px bg-[var(--line)]" />}
              <IconBadge icon={icon} tone={tone} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium">{label}{extra && <span className="text-fg-muted"> · {extra}</span>}</p>
                <p className="mt-0.5 flex flex-wrap gap-x-2.5 text-[12px] text-fg-subtle">{e.device && <span>{e.device.label}</span>}{e.ip && <span className="font-mono">{e.ip}</span>}</p>
              </div>
              <time className="pt-1 font-mono text-[11.5px] whitespace-nowrap text-fg-subtle" title={dateTime(e.at)}>{grouped ? timeOnly(e.at) : relative(e.at)}</time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Activity() {
  const { d } = useAccount();
  const [filter, setFilter] = useState<keyof typeof GROUPS>("all");
  const [extra, setExtra] = useState<CordEvent[]>([]);
  const [more, setMore] = useState(d.activity.length >= 40);
  const [busy, setBusy] = useState(false);
  const events = [...d.activity, ...extra];
  const group = GROUPS[filter];
  const shown = group ? events.filter(e => (group as readonly string[]).includes(e.kind)) : events;

  const loadMore = async () => {
    setBusy(true);
    try {
      const page = await cordRequest<{ events: CordEvent[]; more: boolean }>(`/api/activity?before=${events.at(-1)?.at ?? Date.now()}`, undefined, "GET");
      setExtra(x => [...x, ...page.events]);
      setMore(page.more);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(GROUPS) as (keyof typeof GROUPS)[]).map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={cn("h-8 rounded-full px-3.5 text-[12.5px] font-medium ring-1 ring-inset transition-colors", filter === f ? "tint-fill text-white ring-white/20" : "bg-[var(--control)] text-fg-muted ring-[var(--line)] hover:text-fg")}>
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>
      <Panel>
        <Timeline events={shown} />
        {more && <div className="mt-4"><GlassButton size="sm" icon={<ChevronDown className="size-3.5" />} loading={busy} onClick={() => void loadMore()}>Charger plus</GlassButton></div>}
      </Panel>
      <p className="px-1 text-[12px] text-fg-subtle">Journal conservé 180 jours, visible uniquement par toi. Les adresses IP sont tronquées à l’affichage.</p>
    </>
  );
}
