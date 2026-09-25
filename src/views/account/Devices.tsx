import { Clock, Copy, ExternalLink, Globe, Laptop, LogIn, LogOut, MonitorSmartphone, Pencil, QrCode as QrIcon, Smartphone, TabletSmartphone, Cpu } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { QrCode } from "../../components/apps/QrCode";
import { GlassButton, GlassModal } from "../../components/glass";
import { cordAsset, cordRequest, type CordChallenge } from "../../lib/account";
import { toast } from "../../lib/toast";
import { useAccount } from "./context";
import { dateShort, dateTime, Empty, Field, IconBadge, ListRow, Panel, Pill, relative } from "./kit";

const DEVICE_ICONS = { desktop: Laptop, mobile: Smartphone, tablet: TabletSmartphone, api: Cpu } as const;
const METHODS: Record<string, string> = { password: "mot de passe", register: "mot de passe", passkey: "passkey", passcord: "Passcord", reset: "lien de réinitialisation" };

export function Devices() {
  const { d, reload, openModal } = useAccount();
  const [pairing, setPairing] = useState(false);
  const others = d.sessions.filter(s => !s.current).length;

  const rename = (id: string, name: string) => openModal({
    title: "Renommer l’iPhone", icon: Pencil, submit: "Enregistrer",
    body: <Field label="Nom de l’iPhone"><input className="cord-input" name="name" defaultValue={name} maxLength={60} required autoFocus /></Field>,
    onSubmit: async (f) => { await cordRequest("/api/passcord/keys", { id, name: String(f.get("name")).trim() }, "PATCH"); await reload(); },
  });
  const revoke = (id: string, name: string) => openModal({
    title: `Révoquer « ${name} » ?`, desc: "Cet iPhone ne pourra plus valider de connexion. Tu pourras l’associer de nouveau à tout moment.",
    icon: Smartphone, tone: "danger", danger: true, submit: "Révoquer",
    onSubmit: async () => { await cordRequest("/api/passcord/keys", { id }, "DELETE"); toast({ tone: "info", title: "iPhone révoqué" }); await reload(); },
  });
  const signOut = (id: string, label: string) => openModal({
    title: `Déconnecter ${label} ?`, desc: "Cet appareil devra se reconnecter pour accéder à ton compte.",
    icon: LogOut, tone: "danger", danger: true, submit: "Déconnecter",
    onSubmit: async () => { await cordRequest("/api/sessions", { id }, "DELETE"); toast({ tone: "info", title: "Session fermée" }); await reload(); },
  });
  const signOutOthers = () => openModal({
    title: "Déconnecter tous les autres appareils ?", desc: "Tous les appareils sauf CordLauncher devront se reconnecter.",
    icon: LogOut, tone: "danger", danger: true, submit: "Déconnecter les autres",
    onSubmit: async () => {
      const r = await cordRequest<{ closed: number }>("/api/sessions/revoke-others", {});
      toast({ tone: "info", title: `${r.closed} session(s) fermée(s)` });
      await reload();
    },
  });

  return (
    <>
      <Panel icon={Smartphone} title="Passcord, ta clé iPhone"
        desc="Associe ton iPhone une fois : ensuite, tes connexions se valident dans Passcord avec Face ID. La clé privée ne quitte jamais le téléphone."
        actions={<GlassButton size="sm" variant="primary" icon={<QrIcon className="size-3.5" />} onClick={() => setPairing(true)}>Associer un iPhone</GlassButton>}>
        {d.passcord.length
          ? <div className="grid gap-1">{d.passcord.map(k => (
              <ListRow key={k.id} lead={<IconBadge icon={Smartphone} tone="ok" size="sm" />} title={k.name}
                meta={<><span>Associé le {dateShort(k.createdAt)}</span><span>{k.lastUsedAt ? `Dernière validation ${relative(k.lastUsedAt)}` : "Jamais utilisé pour se connecter"}</span></>}
                actions={<>
                  <GlassButton size="icon-sm" variant="ghost" aria-label={`Renommer ${k.name}`} onClick={() => rename(k.id, k.name)}><Pencil className="size-3.5" /></GlassButton>
                  <GlassButton size="sm" variant="danger" onClick={() => revoke(k.id, k.name)}>Révoquer</GlassButton>
                </>} />
            ))}</div>
          : <Empty icon={Smartphone} title="Aucun iPhone associé" desc="Passcord transforme ton iPhone en clé de connexion pour toute la suite." />}
      </Panel>

      <Panel icon={MonitorSmartphone} tone="info" title="Sessions actives"
        desc="Les navigateurs et apps connectés à ton compte Cord. Ferme ceux que tu ne reconnais pas."
        actions={others > 0 && <GlassButton size="sm" variant="danger" icon={<LogOut className="size-3.5" />} onClick={signOutOthers}>Déconnecter les autres</GlassButton>}>
        <div className="grid gap-1">
          {d.sessions.map(s => (
            <ListRow key={s.id}
              lead={<IconBadge icon={DEVICE_ICONS[s.device.kind as keyof typeof DEVICE_ICONS] ?? MonitorSmartphone} tone={s.current ? "tint" : "muted"} size="sm" />}
              title={<>{s.device.label}{s.current && <Pill tone="ok">Cet appareil</Pill>}</>}
              meta={<>
                <span className="inline-flex items-center gap-1"><Clock className="size-3" />Actif {relative(s.lastSeenAt || s.createdAt)}</span>
                {s.method && <span className="inline-flex items-center gap-1"><LogIn className="size-3" />via {METHODS[s.method] ?? s.method}</span>}
                {s.ip && <span className="inline-flex items-center gap-1 font-mono"><Globe className="size-3" />{s.ip}</span>}
                <span title={dateTime(s.createdAt)}>Connecté {relative(s.createdAt)}</span>
              </>}
              actions={!s.current && <GlassButton size="sm" variant="ghost" icon={<LogOut className="size-3.5" />} onClick={() => signOut(s.id, s.device.label)}>Déconnecter</GlassButton>} />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-fg-subtle">Tu ne reconnais pas un appareil ? Déconnecte-le puis change ton mot de passe.</p>
      </Panel>

      <PairModal open={pairing} onClose={() => setPairing(false)} onPaired={reload} />
    </>
  );
}

/** Association Passcord : QR à scanner, attente de l'iPhone, compte à rebours. */
function PairModal({ open, onClose, onPaired }: { open: boolean; onClose: () => void; onPaired: () => Promise<void> }) {
  const titleId = useId();
  const [request, setRequest] = useState<CordChallenge | null>(null);
  const [left, setLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setRequest(null); setError(null); return; }
    let active = true;
    let poll: ReturnType<typeof setTimeout> | undefined;
    void cordRequest<CordChallenge>("/api/passcord/pair").then(r => {
      if (!active) return;
      setRequest(r);
      const check = async () => {
        if (!active) return;
        if (Date.now() >= r.expiresAt) { setError("La demande a expiré (3 minutes). Ferme et recommence."); return; }
        try {
          const s = await cordRequest<{ pending: boolean }>("/api/passcord/pair/status", { id: r.id });
          if (!s.pending && active) {
            await onPaired();
            toast({ tone: "ok", title: "iPhone associé !", description: "Tes prochaines connexions pourront se valider avec Face ID." });
            onClose();
            return;
          }
        } catch { /* on réessaie */ }
        poll = setTimeout(() => void check(), 2500);
      };
      poll = setTimeout(() => void check(), 2500);
    }).catch(e => active && setError((e as Error).message));
    return () => { active = false; clearTimeout(poll); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!request) return;
    const tick = () => setLeft(Math.max(0, request.expiresAt - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [request]);

  return (
    <GlassModal open={open} onClose={onClose} width={500} labelledBy={titleId}>
      <div className="relative z-[3] grid gap-5 p-8">
        <div className="flex items-start gap-4 pr-8">
          <IconBadge icon={Smartphone} />
          <div>
            <h2 id={titleId} className="font-display text-xl font-semibold">Associer Passcord</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">Sur ton iPhone, scanne ce code avec l’appareil photo : Passcord s’ouvre. Connecte-toi avec ton compte Cord et valide avec Face ID.</p>
          </div>
        </div>
        {request ? (
          <>
            <div className="mx-auto w-56 rounded-[24px] bg-white p-4 shadow-[0_30px_70px_-30px_var(--tint-a)]">
              <QrCode value={request.url} colors={["#6E58F0", "#B842EC"]} logo={cordAsset("/assets/icon-180.png") ?? undefined} className="aspect-square w-full" />
            </div>
            <div className="flex items-center justify-center gap-3 text-[13.5px] text-fg-muted">
              <span className="size-2 animate-pulse-dot rounded-full bg-[var(--tint-a)] text-[var(--tint-a)]" />
              En attente de ton iPhone…
              <span className="font-mono text-fg-subtle">{Math.floor(left / 60000)}:{String(Math.floor((left % 60000) / 1000)).padStart(2, "0")}</span>
            </div>
            <details className="text-[13px] text-fg-muted">
              <summary className="cursor-pointer text-[var(--tint-a)]">Pas d’appareil photo ? Colle le lien dans Passcord</summary>
              <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-[var(--control)] px-3 py-2">
                <code className="flex-1 truncate font-mono text-[12px]">{request.url}</code>
                <GlassButton size="icon-sm" variant="ghost" aria-label="Copier le lien" onClick={() => void navigator.clipboard.writeText(request.url).then(() => toast({ tone: "ok", title: "Lien copié" }))}><Copy className="size-3.5" /></GlassButton>
              </div>
              <p className="mt-1.5 text-[12px] text-fg-subtle">Dans Passcord : Réglages › Compte Cord. <ExternalLink className="inline size-3" /></p>
            </details>
          </>
        ) : !error && <div className="mx-auto size-56 animate-pulse rounded-[24px] bg-[var(--control)]" />}
        {error && <p role="alert" className="rounded-[12px] bg-danger/12 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
      </div>
    </GlassModal>
  );
}
