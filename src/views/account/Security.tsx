import { Check, ChevronRight, Cloud, Copy, ExternalLink, Fingerprint, KeyRound, Pencil, Plus, RefreshCw, ShieldAlert, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { QrCode } from "../../components/apps/QrCode";
import { GlassButton, GlassModal, GlassToggle } from "../../components/glass";
import { cordAsset, cordRequest, securityScore, useCordAccount } from "../../lib/account";
import { cn } from "../../lib/cn";
import { openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useAccount } from "./context";
import { dateShort, Field, IconBadge, ListRow, Panel, PasswordInput, Pill, relative, ScoreRing, withReauth } from "./kit";

const CORD_GRADIENT = ["#6E58F0", "#B842EC"] as const;

export function Security() {
  const { d, reload, openModal, askPassword, go } = useAccount();
  const { server } = useCordAccount();
  const score = securityScore(d);
  const tips = score.checks.filter(c => !c.ok);
  const [totpOpen, setTotpOpen] = useState(false);

  const changePassword = () => openModal({
    title: "Changer le mot de passe",
    desc: "Les autres appareils seront déconnectés (CordLauncher reste connecté).",
    icon: KeyRound,
    submit: "Changer le mot de passe",
    body: <>
      <Field label="Mot de passe actuel"><PasswordInput name="current" autoFocus /></Field>
      <Field label="Nouveau mot de passe" hint="12 caractères minimum. Une phrase de passe fonctionne très bien."><PasswordInput name="password" autoComplete="new-password" minLength={12} /></Field>
      <Field label="Confirme le nouveau"><PasswordInput name="confirm" autoComplete="new-password" minLength={12} /></Field>
    </>,
    onSubmit: async (f) => {
      if (f.get("password") !== f.get("confirm")) throw new Error("Les deux mots de passe ne correspondent pas.");
      const r = await cordRequest<{ closedSessions: number }>("/api/security/password", { current: f.get("current"), password: f.get("password") });
      toast({ tone: "ok", title: "Mot de passe changé", description: `${r.closedSessions} autre(s) session(s) fermée(s).` });
      await reload();
    },
  });

  const disableTotp = () => openModal({
    title: "Désactiver la double authentification ?",
    desc: "Saisis un code de ton application (ou un code de secours) pour confirmer.",
    icon: ShieldAlert, tone: "danger", danger: true, submit: "Désactiver",
    body: <Field label="Code de vérification"><input className="cord-input text-center font-mono tracking-[0.3em]" name="code" required maxLength={24} autoComplete="one-time-code" autoFocus /></Field>,
    onSubmit: async (f) => {
      await cordRequest("/api/security/totp", { action: "disable", code: String(f.get("code")).trim() });
      toast({ tone: "info", title: "Double authentification désactivée" });
      await reload();
    },
  });

  const regenerate = () => {
    let codes: string[] | null = null;
    openModal({
      title: "Nouveaux codes de secours",
      desc: "Les anciens codes cesseront de fonctionner. Confirme avec un code de ton application.",
      icon: RefreshCw, submit: "Générer",
      body: <Field label="Code à 6 chiffres"><input className="cord-input text-center font-mono tracking-[0.4em]" name="code" inputMode="numeric" required maxLength={7} autoComplete="one-time-code" autoFocus /></Field>,
      onSubmit: async (f) => {
        if (codes) return;
        codes = (await cordRequest<{ recoveryCodes: string[] }>("/api/security/totp", { action: "regenerate", code: f.get("code") })).recoveryCodes;
        await reload();
        openModal({ title: "Tes nouveaux codes de secours", desc: "Garde-les en lieu sûr : chacun permet une connexion si tu perds ton téléphone.", icon: KeyRound, submit: "Terminé", body: <RecoveryCodes codes={codes} email={d.user.email} /> });
        return false;
      },
    });
  };

  const renamePasskey = (id: string, name: string) => openModal({
    title: "Renommer la passkey", icon: Pencil, submit: "Enregistrer",
    body: <Field label="Nom"><input className="cord-input" name="name" defaultValue={name} maxLength={60} required autoFocus /></Field>,
    onSubmit: async (f) => {
      await cordRequest("/api/passkeys", { id, name: String(f.get("name")).trim() }, "PATCH");
      await reload();
    },
  });
  const removePasskey = (id: string, name: string) => openModal({
    title: `Supprimer « ${name} » ?`, desc: "Tu ne pourras plus te connecter avec cette passkey. Retire-la aussi de ton gestionnaire de mots de passe.",
    icon: Trash2, tone: "danger", danger: true, submit: "Supprimer",
    onSubmit: async () => {
      await cordRequest("/api/passkeys", { id }, "DELETE");
      toast({ tone: "info", title: "Passkey supprimée" });
      await reload();
    },
  });

  const toggleAlerts = async (alerts: boolean) => {
    try {
      await cordRequest("/api/me", { alerts }, "PATCH");
      toast({ tone: "info", title: alerts ? "Alertes de connexion activées" : "Alertes de connexion désactivées" });
      await reload();
    } catch (e) {
      toast({ tone: "error", title: "Réglage non enregistré", description: (e as Error).message });
    }
  };

  const tipAction = (id: string) => {
    if (id === "mfa") return () => setTotpOpen(true);
    if (id === "fresh") return changePassword;
    if (id === "recovery") return regenerate;
    if (id === "alerts") return () => void toggleAlerts(true);
    if (id === "strong") return () => go("appareils");
    return undefined;
  };

  return (
    <>
      <Panel>
        <div className="flex flex-wrap items-center gap-5">
          <ScoreRing value={score.value} size={96} />
          <div className="min-w-[220px] flex-1">
            <h3 className="font-display text-[17px] font-semibold">Niveau de protection · <span className={score.tone === "ok" ? "text-ok" : score.tone === "warn" ? "text-warn" : "text-danger"}>{score.label}</span></h3>
            {tips.length
              ? <ul className="mt-2 grid gap-1">{tips.map(t => <li key={t.id} className="flex items-center gap-2 text-[13.5px] text-fg-muted"><ChevronRight className="size-3.5 text-[var(--tint-a)]" />{t.label}</li>)}</ul>
              : <p className="mt-1 text-[13.5px] text-fg-muted">Tout est en ordre. Ton compte est très bien protégé.</p>}
          </div>
          {tips[0] && tipAction(tips[0].id) && <GlassButton size="sm" variant="primary" onClick={tipAction(tips[0].id)}>{tips[0].label}</GlassButton>}
        </div>
      </Panel>

      <p className="px-1 pt-2 text-[11px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Méthodes de connexion</p>

      <Panel icon={KeyRound} title="Mot de passe"
        desc={d.security.passwordChangedAt ? `Modifié ${relative(d.security.passwordChangedAt)}` : "Défini à la création du compte"}
        actions={<GlassButton size="sm" icon={<Pencil className="size-3.5" />} onClick={changePassword}>Changer</GlassButton>} />

      <Panel icon={d.security.mfa ? ShieldCheck : ShieldAlert} tone={d.security.mfa ? "ok" : "warn"} title="Double authentification (2FA)"
        desc={d.security.mfa
          ? `Activée le ${dateShort(d.security.mfaSince)} · ${d.security.recoveryCodesLeft} codes de secours restants`
          : "Un code à 6 chiffres depuis une app comme 1Password, Authy ou Google Authenticator, en plus du mot de passe."}
        actions={d.security.mfa
          ? <><Pill tone="ok">Activée</Pill><GlassButton size="sm" variant="ghost" icon={<RefreshCw className="size-3.5" />} onClick={regenerate}>Nouveaux codes</GlassButton><GlassButton size="sm" variant="danger" onClick={disableTotp}>Désactiver</GlassButton></>
          : <GlassButton size="sm" variant="primary" icon={<ShieldCheck className="size-3.5" />} onClick={() => setTotpOpen(true)}>Activer</GlassButton>} />

      <Panel icon={Fingerprint} tone={d.passkeys.length ? "ok" : "tint"} title="Passkeys"
        desc="Connexion instantanée avec Face ID, Touch ID ou Windows Hello. Une passkey est liée au site du Compte Cord : on l’ajoute depuis ton navigateur."
        actions={<GlassButton size="sm" icon={<Plus className="size-3.5" />} trailingIcon={<ExternalLink className="size-3" />} onClick={() => void openExternal(`${server}/#securite`)}>Ajouter</GlassButton>}>
        {d.passkeys.length > 0 && (
          <div className="grid gap-1">
            {d.passkeys.map(p => (
              <ListRow key={p.id} lead={<IconBadge icon={Fingerprint} tone="muted" size="sm" />}
                title={<>{p.name}{p.backedUp && <Pill tone="info"><Cloud className="size-3" />Synchronisée</Pill>}</>}
                meta={<><span>Ajoutée le {dateShort(p.createdAt)}</span><span>{p.lastUsedAt ? `Utilisée ${relative(p.lastUsedAt)}` : "Jamais utilisée"}</span></>}
                actions={<>
                  <GlassButton size="icon-sm" variant="ghost" aria-label={`Renommer ${p.name}`} onClick={() => renamePasskey(p.id, p.name)}><Pencil className="size-3.5" /></GlassButton>
                  <GlassButton size="icon-sm" variant="ghost" aria-label={`Supprimer ${p.name}`} onClick={() => removePasskey(p.id, p.name)}><Trash2 className="size-3.5" /></GlassButton>
                </>} />
            ))}
          </div>
        )}
      </Panel>

      <Panel icon={Smartphone} tone={d.passcord.length ? "ok" : "tint"} title="Passcord sur iPhone"
        desc={d.passcord.length ? `${d.passcord.length} iPhone associé(s)` : "Ton iPhone peut valider tes connexions avec Face ID."}
        actions={<GlassButton size="sm" trailingIcon={<ChevronRight className="size-3.5" />} onClick={() => go("appareils")}>Gérer</GlassButton>} />

      <p className="px-1 pt-2 text-[11px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Alertes par email</p>
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div><p className="font-semibold">Nouvelle connexion</p><p className="text-[13px] text-fg-muted">Un email quand ton compte est utilisé depuis un appareil inconnu.</p></div>
          <GlassToggle label="Alertes de nouvelle connexion" checked={Boolean(d.user.alerts)} onChange={v => void toggleAlerts(v)} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div><p className="font-semibold">Toujours envoyées</p><p className="text-[13px] text-fg-muted">Changement de mot de passe, d’email, de 2FA ou ajout de passkey.</p></div>
          <Pill tone="ok"><Check className="size-3" />Activées</Pill>
        </div>
      </Panel>

      <TotpWizard open={totpOpen} onClose={() => setTotpOpen(false)} email={d.user.email} askPassword={askPassword} onDone={reload} />
    </>
  );
}

/** Assistant 2FA : QR à scanner → code → codes de secours. */
function TotpWizard({ open, onClose, email, askPassword, onDone }: {
  open: boolean; onClose: () => void; email: string; askPassword: () => Promise<string | null>; onDone: () => Promise<void>;
}) {
  const titleId = useId();
  const [step, setStep] = useState<"start" | "scan" | "codes">("start");
  const [setup, setSetup] = useState<{ secret: string; otpauth: string } | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => { setStep("start"); setSetup(null); setCodes([]); setCode(""); setSaved(false); setError(null); onClose(); };
  const begin = async () => {
    setBusy(true); setError(null);
    try {
      const s = await withReauth(extra => cordRequest<{ secret: string; otpauth: string }>("/api/security/totp", { action: "setup", ...extra }), askPassword);
      if (!s) return close();
      setSetup(s); setStep("scan");
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const enable = async () => {
    setBusy(true); setError(null);
    try {
      const r = await cordRequest<{ recoveryCodes: string[] }>("/api/security/totp", { action: "enable", code });
      setCodes(r.recoveryCodes); setStep("codes");
      void onDone();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  useEffect(() => {
    if (open && step === "start") void begin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <GlassModal open={open} onClose={close} width={520} labelledBy={titleId} hideClose={step === "codes"}>
      <div className="relative z-[3] flex max-h-full flex-col gap-5 overflow-y-auto p-8">
        <div className="flex items-start gap-4 pr-8">
          <IconBadge icon={ShieldCheck} />
          <div>
            <h2 id={titleId} className="font-display text-xl font-semibold">Activer la double authentification</h2>
            <div className="mt-2.5 flex gap-1.5">{["scan", "code", "codes"].map((s, i) => <span key={s} className={cn("h-1 w-16 rounded-full", i <= (step === "codes" ? 2 : step === "scan" ? 1 : 0) ? "tint-fill" : "bg-[var(--control-hover)]")} />)}</div>
          </div>
        </div>
        {step === "start" && <p className="text-sm text-fg-muted">{error ?? "Préparation…"}</p>}
        {step === "scan" && setup && (
          <form className="grid gap-4" onSubmit={e => { e.preventDefault(); void enable(); }}>
            <p className="text-[13.5px] text-fg-muted">Scanne ce QR code avec ton application d’authentification, puis saisis le code à 6 chiffres qu’elle affiche.</p>
            <div className="mx-auto w-52 rounded-[22px] bg-white p-3.5 shadow-[0_24px_60px_-24px_var(--tint-a)]">
              <QrCode value={setup.otpauth} colors={CORD_GRADIENT} logo={cordAsset("/assets/icon-180.png") ?? undefined} className="aspect-square w-full" />
            </div>
            <details className="text-[13px]">
              <summary className="cursor-pointer text-[var(--tint-a)]">Ou saisis la clé à la main</summary>
              <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-[var(--control)] px-3 py-2">
                <code className="flex-1 font-mono text-[12.5px] break-all">{setup.secret.match(/.{1,4}/g)?.join(" ")}</code>
                <GlassButton size="icon-sm" variant="ghost" aria-label="Copier la clé" onClick={() => void navigator.clipboard.writeText(setup.secret).then(() => toast({ tone: "ok", title: "Clé copiée" }))}><Copy className="size-3.5" /></GlassButton>
              </div>
            </details>
            <input className="cord-input text-center font-mono text-2xl tracking-[0.4em]" aria-label="Code à 6 chiffres" inputMode="numeric" autoComplete="one-time-code" maxLength={7} required autoFocus value={code} onChange={e => { setCode(e.target.value); setError(null); }} placeholder="••••••" />
            {error && <p role="alert" className="rounded-[12px] bg-danger/12 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
            <div className="flex justify-end gap-2"><GlassButton variant="ghost" onClick={close}>Annuler</GlassButton><GlassButton type="submit" variant="primary" loading={busy}>Vérifier et activer</GlassButton></div>
          </form>
        )}
        {step === "codes" && (
          <div className="grid gap-4">
            <p className="text-[13.5px] text-fg-muted">C’est activé ! Garde ces codes de secours en lieu sûr : chacun permet une connexion si tu perds ton téléphone.</p>
            <RecoveryCodes codes={codes} email={email} />
            <label className="flex items-center gap-2.5 text-sm"><input type="checkbox" checked={saved} onChange={e => setSaved(e.target.checked)} className="size-4 accent-[var(--tint-a)]" />J’ai mis mes codes de secours à l’abri</label>
            <div className="flex justify-end"><GlassButton variant="primary" disabled={!saved} onClick={() => { close(); toast({ tone: "ok", title: "Double authentification activée", description: "Ton compte est bien mieux protégé." }); }}>Terminer</GlassButton></div>
          </div>
        )}
      </div>
    </GlassModal>
  );
}

function RecoveryCodes({ codes }: { codes: string[]; email?: string }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 rounded-[16px] border border-dashed border-[var(--line)] bg-[var(--control)] p-4">
        {codes.map(c => <code key={c} className="rounded-[9px] bg-[var(--control)] py-2 text-center font-mono text-[13.5px] tracking-wider">{c}</code>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <GlassButton size="sm" icon={<Copy className="size-3.5" />} onClick={() => void navigator.clipboard.writeText(codes.join("\n")).then(() => toast({ tone: "ok", title: "Codes copiés" }))}>Tout copier</GlassButton>
      </div>
    </>
  );
}
