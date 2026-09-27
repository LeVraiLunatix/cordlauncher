import { Bell, ChartColumn, ExternalLink, History, House, KeyRound, LayoutGrid, LockKeyhole, LogOut, MonitorSmartphone, RefreshCw, Send, ShieldCheck, Smartphone, UserRound, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QrCode } from "../components/apps/QrCode";
import { GlassButton, GlassCard, Skeleton } from "../components/glass";
import { clearCord, cordAsset, CordError, cordRequest, refreshCord, useCordAccount, type CordChallenge } from "../lib/account";
import { cn } from "../lib/cn";
import { itemVariants, springSoft, viewVariants } from "../lib/motion";
import { IS_TAURI, openExternal } from "../lib/platform";
import { toast } from "../lib/toast";
import { Activity } from "./account/Activity";
import { Admin } from "./account/Admin";
import { Apps } from "./account/Apps";
import { AccountContext, type AccountCtx, type AccountTab } from "./account/context";
import { Devices } from "./account/Devices";
import { ActionModal, Field, PasswordInput, type ModalSpec } from "./account/kit";
import { AccountHero, InboxModal, Overview } from "./account/Overview";
import { Privacy } from "./account/Privacy";
import { Profile } from "./account/Profile";
import { Security } from "./account/Security";

const TABS: { id: AccountTab; label: string; icon: LucideIcon; admin?: boolean }[] = [
  { id: "apercu", label: "Accueil", icon: House },
  { id: "securite", label: "Sécurité", icon: ShieldCheck },
  { id: "appareils", label: "Appareils", icon: MonitorSmartphone },
  { id: "apps", label: "Apps", icon: LayoutGrid },
  { id: "profil", label: "Profil", icon: UserRound },
  { id: "activite", label: "Activité", icon: History },
  { id: "confidentialite", label: "Confidentialité", icon: LockKeyhole },
  { id: "admin", label: "Admin", icon: ChartColumn, admin: true },
];

/**
 * Compte Cord dans CordLauncher : la même chose que compte.cordsuite.app
 * (aperçu, sécurité, appareils, apps, profil, activité, confidentialité,
 * admin), en natif, via le proxy Rust qui garde la session dans le coffre.
 */
export function AccountView() {
  const account = useCordAccount();
  const [loading, setLoading] = useState(IS_TAURI);

  useEffect(() => {
    if (!IS_TAURI || !account.server) return;
    setLoading(true);
    refreshCord()
      .catch(e => toast({ tone: "error", title: "Compte Cord indisponible", description: (e as Error).message }))
      .finally(() => setLoading(false));
  }, [account.server]);

  return (
    <motion.div variants={viewVariants} initial="hidden" animate="show" exit="exit" className="mx-auto flex w-full max-w-[920px] flex-col gap-5 px-8 pt-4 pb-14">
      {loading && !account.user ? <LoadingState /> : account.user && account.dashboard ? <SignedIn /> : <SignedOut />}
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div variants={itemVariants} className="grid gap-4">
      <Skeleton className="h-32 rounded-[28px]" />
      <Skeleton className="h-10 w-2/3 rounded-full" />
      <Skeleton className="h-56 rounded-[26px]" />
    </motion.div>
  );
}

// ── Connecté ────────────────────────────────────────────────────────────────

function SignedIn() {
  const { dashboard } = useCordAccount();
  const [tab, setTab] = useState<AccountTab>("apercu");
  const [modal, setModal] = useState<ModalSpec | null>(null);
  const [inboxOpen, setInboxOpen] = useState(false);
  const unread = useCordAccount().hub?.unread ?? 0;
  const passwordResolver = useRef<((value: string | null) => void) | null>(null);
  const d = dashboard!;

  const reload = useCallback(async () => {
    try {
      await refreshCord();
    } catch (e) {
      toast({ tone: "error", title: "Actualisation impossible", description: (e as Error).message });
    }
  }, []);
  const askPassword = useCallback(() => new Promise<string | null>(resolve => {
    passwordResolver.current = resolve;
    setModal({
      title: "Confirme que c’est bien toi",
      desc: "Pour ajouter une protection à ton compte, saisis ton mot de passe. On ne te le redemandera pas avant un moment.",
      icon: KeyRound,
      submit: "Continuer",
      body: <Field label="Mot de passe"><PasswordInput name="password" autoFocus /></Field>,
      onSubmit: f => {
        passwordResolver.current?.(String(f.get("password")));
        passwordResolver.current = null;
      },
    });
  }), []);
  const closeModal = () => {
    passwordResolver.current?.(null);
    passwordResolver.current = null;
    setModal(null);
  };

  const ctx = useMemo<AccountCtx>(() => ({ d, reload, openModal: setModal, askPassword, go: setTab }), [d, reload, askPassword]);
  const tabs = TABS.filter(t => !t.admin || d.user.admin);

  const logout = async () => {
    try {
      await cordRequest("/api/logout");
    } finally {
      clearCord();
    }
  };

  return (
    <AccountContext.Provider value={ctx}>
      <motion.div variants={itemVariants} className="flex items-center gap-2">
      <nav aria-label="Sections du compte" className="glass-inset flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none]">
        {tabs.map(t => {
          const active = t.id === tab;
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-current={active ? "page" : undefined}
              className={cn("relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-medium transition-colors", active ? "text-fg" : "text-fg-muted hover:text-fg")}>
              {active && <motion.span layoutId="account-tab" aria-hidden className="absolute inset-0 rounded-full bg-[var(--glass-fill-hover)] shadow-[inset_0_1px_0_var(--glass-inner),inset_0_0_0_1px_var(--glass-stroke),0_6px_16px_-8px_rgb(0_0_0/0.4)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <Icon className={cn("relative size-3.5", active && "text-[var(--tint-a)]")} />
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </nav>
      <button type="button" onClick={() => setInboxOpen(true)} aria-label={`Notifications${unread ? ` (${unread} non lues)` : ""}`}
        className="glass-inset relative grid size-11 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:text-fg">
        <Bell className="size-4" />
        {unread > 0 && <span className="tint-fill absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 font-mono text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
      </button>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} className="flex flex-col gap-4" variants={viewVariants} initial="hidden" animate="show" exit="exit">
          {tab !== "apercu" && <AccountHero />}
          {tab === "apercu" && <Overview />}
          {tab === "securite" && <Security />}
          {tab === "appareils" && <Devices />}
          {tab === "apps" && <Apps />}
          {tab === "profil" && <Profile />}
          {tab === "activite" && <Activity />}
          {tab === "confidentialite" && <Privacy />}
          {tab === "admin" && d.user.admin && <Admin />}
        </motion.div>
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 pt-2">
        <GlassButton size="sm" variant="ghost" icon={<RefreshCw className="size-3.5" />} onClick={() => void reload()}>Actualiser</GlassButton>
        <GlassButton size="sm" variant="ghost" icon={<ExternalLink className="size-3.5" />} onClick={() => void openExternal(`${useCordServer()}/#${tab}`)}>Ouvrir sur le web</GlassButton>
        <span className="flex-1" />
        <GlassButton size="sm" variant="danger" icon={<LogOut className="size-3.5" />} onClick={() => void logout()}>Se déconnecter</GlassButton>
      </motion.div>

      <ActionModal spec={modal} onClose={closeModal} />
      <InboxModal open={inboxOpen} onClose={() => setInboxOpen(false)} />
    </AccountContext.Provider>
  );
}

const useCordServer = () => useCordAccount().server;

// ── Non connecté ────────────────────────────────────────────────────────────

type Mode = "login" | "register" | "forgot" | "passcord";

/** Dernière adresse du Compte Cord sur ce PC : préremplie, Passcord part tout seul. */
const EMAIL_KEY = "cordlauncher:email";
const rememberedEmail = () => { try { return localStorage.getItem(EMAIL_KEY) ?? ""; } catch { return ""; } };
const rememberEmail = (email: string) => { try { if (email) localStorage.setItem(EMAIL_KEY, email); } catch { /* stockage indisponible */ } };

function SignedOut() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState(rememberedEmail);
  const [needsOtp, setNeedsOtp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setBusy(true); setError(null); setNotice(null);
    try {
      await action();
    } catch (e) {
      if (e instanceof CordError && (e.reason === "mfa_required" || e.reason === "mfa_invalid")) setNeedsOtp(true);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const submit = (f: FormData) => run(async () => {
    const addr = String(f.get("email") ?? email).trim();
    setEmail(addr);
    if (mode === "forgot") {
      const r = await cordRequest<{ devUrl?: string }>("/api/password/forgot", { email: addr });
      setNotice(r.devUrl ?? `Si un compte Cord utilise ${addr}, un lien de réinitialisation vient de partir (valable 30 minutes).`);
      return;
    }
    const otp = String(f.get("otp") ?? "").trim();
    await cordRequest(mode === "register" ? "/api/register" : "/api/login", {
      email: addr, password: f.get("password"), name: f.get("name") ?? undefined, ...(otp ? { otp } : {}),
    });
    if (mode === "register") await cordRequest("/api/email/send").catch(() => {});
    rememberEmail(addr);
    await refreshCord();
    toast({ tone: "ok", title: mode === "register" ? "Bienvenue dans la suite Cord !" : "Connecté à ton compte Cord" });
  });

  const heading = { login: ["Bon retour", "Connecte-toi à ton compte Cord : une identité pour toute la suite."], register: ["Crée ton compte Cord", "Une identité pour toutes les apps de la suite. Gratuit, sans pub, sans pistage."], forgot: ["Mot de passe oublié", "Indique ton adresse : on t’envoie un lien pour en choisir un nouveau."], passcord: ["Connexion avec Passcord", "Reçois la demande sur ton iPhone (ou scanne le code avec l’appareil photo), puis valide avec Face ID dans Passcord."] }[mode];

  return (
    <>
      <motion.header variants={itemVariants}>
        <p className="text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Un compte, toute la suite</p>
        <h1 className="mt-1.5 font-display text-[32px] leading-tight font-semibold tracking-[-0.03em]">Ton espace Cord.</h1>
        <p className="mt-2 text-sm text-fg-muted">Ton identité commune pour Drivecord, Tunecord, Passcord… Et avec Passcord, ton iPhone devient ta clé.</p>
      </motion.header>
      <GlassCard variants={itemVariants} className="rounded-[26px] p-7">
        <div className="relative z-[3] mx-auto max-w-[460px]">
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: springSoft }} exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">{heading[0]}</h2>
              <p className="mt-1.5 mb-5 text-[13.5px] text-fg-muted">{heading[1]}</p>
              {mode === "passcord"
                ? <PasscordLogin email={email} onEmail={setEmail} onDone={() => void refreshCord()} onCancel={() => setMode("login")} />
                : (
                  <form className="grid gap-4" onSubmit={e => { e.preventDefault(); void submit(new FormData(e.currentTarget)); }}>
                    {mode === "register" && <Field label="Ton prénom ou pseudo"><input className="cord-input" name="name" required maxLength={60} autoComplete="nickname" /></Field>}
                    <Field label="Adresse email"><input className="cord-input" name="email" type="email" required maxLength={254} autoComplete="username" defaultValue={email} disabled={!IS_TAURI} /></Field>
                    {mode !== "forgot" && <Field label="Mot de passe" hint={mode === "register" ? "12 caractères minimum. Ce compte reste distinct de ton compte Apple." : undefined}>
                      <PasswordInput name="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={mode === "register" ? 12 : undefined} />
                    </Field>}
                    {mode === "login" && needsOtp && <Field label="Code de double authentification" hint="Code à 6 chiffres de ton application, ou un code de secours.">
                      <input className="cord-input text-center font-mono tracking-[0.3em]" name="otp" required maxLength={24} inputMode="numeric" autoComplete="one-time-code" autoFocus />
                    </Field>}
                    {error && <p role="alert" className="rounded-[12px] bg-danger/12 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
                    {notice && <p role="status" className="rounded-[12px] bg-ok/12 px-3.5 py-2.5 text-sm break-all text-ok">{notice}</p>}
                    <GlassButton type="submit" variant="primary" size="lg" loading={busy} disabled={!IS_TAURI}>
                      {mode === "register" ? "Créer mon compte" : mode === "forgot" ? "Envoyer le lien" : "Se connecter"}
                    </GlassButton>
                  </form>
                )}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
                {mode === "login" && <>
                  <GlassButton variant="glass" icon={<Smartphone className="size-4" />} disabled={!IS_TAURI} onClick={() => {
                    // L'adresse déjà tapée sert à envoyer la demande directement à l'iPhone.
                    const typed = document.querySelector<HTMLInputElement>('input[name="email"]')?.value.trim();
                    if (typed) setEmail(typed);
                    setError(null); setMode("passcord");
                  }}>Passcord</GlassButton>
                  <button type="button" className="text-fg-muted hover:text-fg" onClick={() => { setError(null); setMode("forgot"); }}>Mot de passe oublié ?</button>
                  <span className="flex-1" />
                  <button type="button" className="font-medium text-[var(--tint-a)] hover:underline" onClick={() => { setError(null); setMode("register"); }}>Créer un compte</button>
                </>}
                {mode !== "login" && mode !== "passcord" && <button type="button" className="text-fg-muted hover:text-fg" onClick={() => { setError(null); setNotice(null); setMode("login"); }}>← J’ai déjà un compte</button>}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </GlassCard>
    </>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PasscordLogin({ email, onEmail, onDone, onCancel }: { email: string; onEmail: (email: string) => void; onDone: () => void; onCancel: () => void }) {
  const [challenge, setChallenge] = useState<CordChallenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(0);
  const [code, setCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [address, setAddress] = useState(email);
  const sentTo = useRef("");

  // « Envoyer à mon iPhone » : la demande arrive dans Passcord (et en
  // notification), avec un nombre à retrouver sur l'iPhone.
  const send = async (c: CordChallenge, to: string) => {
    setSending(true);
    try {
      const r = await cordRequest<{ code: string }>("/api/passcord/notify", { id: c.id, pollToken: c.pollToken, email: to });
      onEmail(to);
      sentTo.current = to;
      setCode(r.code);
    } catch (e) {
      toast({ tone: "error", title: "Envoi impossible", description: (e as Error).message });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    void cordRequest<CordChallenge>("/api/passcord/login").then(c => {
      if (!active) return;
      setChallenge(c);
      if (EMAIL_RE.test(email)) void send(c, email);
      const poll = async () => {
        if (!active) return;
        if (Date.now() >= c.expiresAt) { setError("La demande Passcord a expiré. Tu peux recommencer."); return; }
        try {
          const r = await cordRequest<{ pending?: boolean }>("/api/passcord/poll", { id: c.id, pollToken: c.pollToken });
          if (!r.pending) { rememberEmail(sentTo.current); onDone(); return; }
        } catch (e) { if (active) setError((e as Error).message); return; }
        timer = setTimeout(() => void poll(), 2500);
      };
      timer = setTimeout(() => void poll(), 2500);
    }).catch(e => active && setError((e as Error).message));
    return () => { active = false; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!challenge) return;
    const tick = () => setLeft(Math.max(0, challenge.expiresAt - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [challenge]);
  return (
    <div className="grid justify-items-center gap-4 text-center">
      <AnimatePresence mode="wait" initial={false}>
        {code ? (
          <motion.div key="code" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1, transition: springSoft }} exit={{ opacity: 0 }}
            className="grid w-full justify-items-center gap-1.5 rounded-[20px] bg-[color-mix(in_oklab,var(--tint-a)_12%,transparent)] px-4 pt-4 pb-3 ring-1 ring-[color-mix(in_oklab,var(--tint-a)_30%,transparent)] ring-inset" aria-live="polite">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-fg-muted"><Smartphone className="size-4" />Dans Passcord, choisis</span>
            <motion.strong initial={{ scale: 0.6, filter: "blur(6px)" }} animate={{ scale: 1, filter: "blur(0px)", transition: { type: "spring", bounce: 0.45, duration: 0.7 } }}
              className="text-tint font-display text-[60px] leading-none font-bold tracking-[0.06em]">{code}</motion.strong>
            <p className="max-w-[40ch] text-[12.5px] text-fg-muted">Demande envoyée à l’iPhone de {address}. Ouvre Passcord : elle t’attend. Rien reçu ? Scanne le QR code.</p>
            <div className="mt-1 flex gap-4 text-[12.5px]">
              <button type="button" className="font-medium text-[var(--tint-a)] hover:underline disabled:opacity-50" disabled={sending || !challenge} onClick={() => challenge && void send(challenge, address)}>Renvoyer</button>
              <button type="button" className="text-fg-muted hover:text-fg" onClick={() => setCode(null)}>Autre adresse</button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="send" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: springSoft }} exit={{ opacity: 0 }} className="grid w-full gap-2 text-left"
            onSubmit={e => { e.preventDefault(); if (challenge && EMAIL_RE.test(address.trim())) void send(challenge, address.trim()); }}>
            <div className="flex gap-2">
              <input className="cord-input flex-1" type="email" required maxLength={254} autoComplete="username" placeholder="Adresse de ton compte Cord" aria-label="Adresse de ton compte Cord" value={address} onChange={e => setAddress(e.target.value)} />
              <GlassButton type="submit" variant="primary" icon={<Send className="size-4" />} disabled={!challenge || sending || !EMAIL_RE.test(address.trim())}>Envoyer à mon iPhone</GlassButton>
            </div>
            <p className="text-[12px] text-fg-subtle">La demande arrive dans Passcord, et en notification si tu les as activées dans ton Compte Cord.</p>
          </motion.form>
        )}
      </AnimatePresence>
      <p className="flex w-full items-center gap-3 text-[11.5px] tracking-[0.08em] text-fg-subtle uppercase before:h-px before:flex-1 before:bg-[var(--line)] after:h-px after:flex-1 after:bg-[var(--line)]">ou scanne avec l’appareil photo</p>
      {challenge
        ? <div className="w-44 rounded-[20px] bg-white p-3 shadow-[0_24px_60px_-24px_var(--tint-a)]"><QrCode value={challenge.url} colors={["#6E58F0", "#B842EC"]} logo={cordAsset("/assets/icon-180.png") ?? undefined} className="aspect-square w-full" /></div>
        : !error && <Skeleton className="size-44 rounded-[20px]" />}
      {challenge && !error && <p className="inline-flex items-center gap-2.5 text-[13.5px] text-fg-muted"><span className="size-2 animate-pulse-dot rounded-full bg-[var(--tint-a)] text-[var(--tint-a)]" />En attente de ton iPhone… <span className="font-mono text-fg-subtle">{Math.floor(left / 60000)}:{String(Math.floor((left % 60000) / 1000)).padStart(2, "0")}</span></p>}
      {error && <p role="alert" className="rounded-[12px] bg-danger/12 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
      <GlassButton variant="ghost" onClick={onCancel}>← Retour</GlassButton>
    </div>
  );
}


