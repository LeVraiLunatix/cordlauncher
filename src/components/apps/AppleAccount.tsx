import { AlertCircle, Check, KeyRound, Loader2, LogIn, MessageSquareText, RefreshCw, RotateCcw, Smartphone, Trash2, UserPlus } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  forgetApple, initApple, loginApple, refreshApple, resetAppleDevice, respondApple, switchApple, useApple,
  type AppleProfile, type TwoFactor, type VerifyPhase,
} from "../../lib/apple";
import { cn } from "../../lib/cn";
import { easeGlass, springBouncy, springSnappy, springSoft } from "../../lib/motion";
import { IS_TAURI, openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { GlassButton, GlassModal, GlassToggle } from "../glass";

// ── Comptes Apple ────────────────────────────────────────────────────────────

/** Teinte stable par identifiant, pour reconnaître un compte d'un coup d'œil. */
function hueOf(email: string) {
  let h = 0;
  for (const c of email.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 360;
}

function minutes(seconds: number) {
  const m = Math.ceil(seconds / 60);
  return m < 90 ? `${m} min` : `${Math.round(m / 60)} h`;
}

export function AppleAccount() {
  const apple = useApple();
  const profiles = apple.status.profiles;
  const [adding, setAdding] = useState(false);
  const [prefill, setPrefill] = useState("");
  const showForm = adding || profiles.length === 0;
  const paused = profiles.some(p => p.pausedFor);

  useEffect(() => { void refreshApple().catch(error => toast({ tone: "error", title: "Compte Apple indisponible", description: String(error) })); }, []);
  // Une pause en cours : on rafraîchit le décompte.
  useEffect(() => {
    if (!paused) return;
    const t = setInterval(() => void refreshApple().catch(() => {}), 20_000);
    return () => clearInterval(t);
  }, [paused]);

  const openForm = (email = "") => { setPrefill(email); setAdding(true); };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold">Comptes Apple</h3>
          <p className="mt-1 text-sm text-fg-muted">Signe et installe les apps sur ton iPhone depuis ce PC. Branche-le, déverrouille-le et accepte « Se fier à cet ordinateur ».</p>
        </div>
        {profiles.length > 0 && !showForm && (
          <GlassButton size="sm" variant="glass" icon={<UserPlus className="size-4" />} disabled={apple.busy || !IS_TAURI} onClick={() => openForm()}>
            Ajouter un compte
          </GlassButton>
        )}
      </div>

      {profiles.length > 0 && (
        <LayoutGroup id="apple-profiles">
          <motion.ul layout className="space-y-2" aria-label="Comptes Apple enregistrés">
            <AnimatePresence initial={false}>
              {profiles.map(p => (
                <ProfileRow key={p.email} profile={p} busy={apple.busy} onReconnect={() => openForm(p.email)} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      )}

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            key="apple-form"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: springSoft }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.22, ease: easeGlass } }}
          >
            <AppleLoginForm
              key={prefill}
              initialEmail={prefill}
              onDone={() => setAdding(false)}
              onCancel={profiles.length > 0 ? () => setAdding(false) : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {apple.error && (
          <motion.p
            key={apple.error}
            role="alert"
            className="flex gap-2 rounded-xl bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] p-3 text-sm text-danger"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{apple.error}</span>
          </motion.p>
        )}
      </AnimatePresence>

      {IS_TAURI && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--control)] p-4">
          <span className="min-w-0 flex-1 text-sm">
            Réinitialiser l’appareil Apple
            <small className="block text-fg-muted">Si Apple bloque ce PC, CordLauncher se présentera comme un nouvel appareil (nouveau code de vérification demandé). Tes comptes et mots de passe mémorisés sont conservés.</small>
          </span>
          <GlassButton variant="glass" icon={<RotateCcw className="size-4" />} disabled={apple.busy} onClick={() => void resetAppleDevice()}>Réinitialiser</GlassButton>
        </div>
      )}
      {!IS_TAURI && <p className="text-xs text-fg-muted">La connexion Apple et la détection USB sont disponibles dans l’application Windows.</p>}
      <p className="text-xs leading-relaxed text-fg-muted">Avec un compte gratuit, les profils expirent après 7 jours : relance l’installation pour renouveler la signature. Aucun renouvellement automatique n’est activé. La connexion utilise Apple et le service Anisette du moteur isideload.</p>
      <button type="button" className="text-xs underline" onClick={() => void openExternal("https://developer.apple.com/support/compare-memberships/")}>Voir les limites du compte Apple</button>
    </section>
  );
}

function ProfileRow({ profile: p, busy, onReconnect }: { profile: AppleProfile; busy: boolean; onReconnect: () => void }) {
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3500);
    return () => clearTimeout(t);
  }, [confirming]);
  const hue = hueOf(p.email);
  const usable = p.connected || p.remembered;

  const state = p.pausedFor
    ? { tone: "text-warn", label: `En pause · réessai possible dans ${minutes(p.pausedFor)}` }
    : p.connected
      ? { tone: "text-ok", label: p.remembered ? "Connecté · mot de passe mémorisé" : "Connecté pour cette session" }
      : p.remembered
        ? { tone: "text-fg-muted", label: "Mot de passe mémorisé · connexion à la prochaine installation" }
        : { tone: "text-fg-muted", label: "À reconnecter (mot de passe non mémorisé)" };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: springSoft }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2, ease: easeGlass } }}
      className="relative isolate flex flex-wrap items-center gap-3.5 rounded-2xl p-3.5"
    >
      {p.active ? (
        <motion.span
          layoutId="apple-active-profile"
          transition={springSnappy}
          aria-hidden
          className="absolute inset-0 -z-10 rounded-2xl"
          style={{
            background: "linear-gradient(120deg, color-mix(in oklab, var(--tint-a) 22%, transparent), color-mix(in oklab, var(--tint-b) 14%, transparent))",
            boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--tint-a) 45%, transparent)",
          }}
        />
      ) : (
        <span aria-hidden className="absolute inset-0 -z-10 rounded-2xl bg-[var(--control)]" />
      )}

      <span className="relative shrink-0">
        <span
          className="grid size-11 place-items-center rounded-full text-[17px] font-semibold text-white uppercase shadow-lg"
          style={{ backgroundImage: `linear-gradient(135deg, hsl(${hue} 72% 62%), hsl(${(hue + 48) % 360} 70% 48%))` }}
        >
          {p.email[0]}
        </span>
        <AnimatePresence>
          {p.active && (
            <motion.span
              key="check"
              className="absolute -right-0.5 -bottom-0.5 grid size-[18px] place-items-center rounded-full bg-ok text-[var(--bg)] ring-2 ring-[var(--bg)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: springBouncy }}
              exit={{ scale: 0 }}
            >
              <Check className="size-3" strokeWidth={3.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-medium">
          <span className="truncate">{p.email}</span>
          {p.active && <span className="shrink-0 rounded-full bg-[var(--control-hover)] px-2 py-0.5 text-[10.5px] font-semibold tracking-[0.08em] text-fg-muted uppercase">Actif</span>}
        </p>
        <p className={cn("mt-0.5 flex items-center gap-1.5 text-xs", state.tone)}>
          {p.connected && !p.pausedFor && <span className="size-1.5 shrink-0 rounded-full bg-current animate-pulse-dot" />}
          {state.label}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {!usable && (
          <GlassButton size="sm" variant="glass" icon={<LogIn className="size-3.5" />} disabled={busy} onClick={onReconnect}>Reconnecter</GlassButton>
        )}
        {!p.active && (
          <GlassButton size="sm" variant={usable ? "primary" : "glass"} disabled={busy} onClick={() => void switchApple(p.email)}>Utiliser</GlassButton>
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          {confirming ? (
            <motion.span key="confirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <GlassButton size="sm" variant="danger" disabled={busy} onClick={() => { setConfirming(false); void forgetApple(p.email); }}>Oublier ?</GlassButton>
            </motion.span>
          ) : (
            <motion.span key="trash" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <GlassButton size="icon-sm" variant="ghost" aria-label={`Oublier ${p.email}`} title="Oublier ce compte" disabled={busy} onClick={() => setConfirming(true)}>
                <Trash2 className="size-3.5" />
              </GlassButton>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

function AppleLoginForm({ initialEmail, onDone, onCancel }: { initialEmail: string; onDone: () => void; onCancel?: () => void }) {
  const apple = useApple();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const disabled = apple.busy || !IS_TAURI;

  return (
    <form
      className="space-y-3 rounded-2xl bg-[var(--control)] p-4"
      onSubmit={async e => {
        e.preventDefault();
        const secret = password;
        setPassword("");
        if (await loginApple(email, secret, remember)) onDone();
      }}
    >
      <p className="flex items-center gap-2 text-sm font-semibold"><KeyRound className="size-4 text-fg-muted" />{initialEmail ? "Reconnecter le compte" : "Ajouter un compte Apple"}</p>
      <label className="block text-sm">Adresse du compte Apple<input className="cord-input mt-1" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} disabled={disabled} /></label>
      <label className="block text-sm">Mot de passe Apple<input className="cord-input mt-1" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={disabled} autoFocus={!!initialEmail} /></label>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>Mémoriser dans le coffre Windows<small className="block text-xs text-fg-muted">Nécessaire pour changer de compte et re-signer sans tout retaper.</small></span>
        <GlassToggle label="Mémoriser le mot de passe Apple" checked={remember} onChange={setRemember} disabled={disabled} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <GlassButton type="submit" variant="primary" disabled={disabled} icon={apple.busy ? <Loader2 className="size-4 animate-spin" /> : undefined}>
          {apple.busy ? "Connexion en cours…" : "Connecter"}
        </GlassButton>
        {onCancel && <GlassButton variant="ghost" disabled={apple.busy} onClick={onCancel}>Annuler</GlassButton>}
      </div>
      <AnimatePresence>
        {apple.busy && (
          <motion.p className="text-xs text-fg-muted" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            Les serveurs d’Apple refusent souvent la première tentative en ce moment : CordLauncher réessaie tout seul plusieurs fois.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

// ── Code de vérification ─────────────────────────────────────────────────────

const CODE_LENGTH = 6;

export function AppleVerification() {
  const { twoFactor, verify } = useApple();
  useEffect(() => { void initApple().catch(error => toast({ tone: "error", title: "Vérification Apple indisponible", description: String(error) })); }, []);
  // Garde le contenu affiché pendant l'animation de fermeture.
  const last = useRef<TwoFactor | null>(twoFactor);
  if (twoFactor) last.current = twoFactor;
  const shown = twoFactor ?? last.current;

  return (
    <GlassModal
      open={!!twoFactor}
      onClose={() => { if (verify !== "success") void respondApple("Abort"); }}
      width={500}
      labelledBy="apple-2fa-title"
      hideClose={verify === "success"}
    >
      {shown && <VerificationBody twoFactor={shown} verify={verify} />}
    </GlassModal>
  );
}

function VerificationBody({ twoFactor: tf, verify }: { twoFactor: TwoFactor; verify: VerifyPhase }) {
  const [code, setCode] = useState("");
  const [errorTick, setErrorTick] = useState(0);
  const [resent, setResent] = useState(false);
  const prevVerify = useRef(verify);
  const mode: "device" | "sms" | "unknown" = tf.sms ? "sms" : tf.unknown ? "unknown" : "device";
  const selected = tf.numbers.find(n => n.id === tf.selectedNumberId) ?? null;
  const success = verify === "success";

  // Nouveau passage du moteur : code refusé (erreur) ou code renvoyé.
  useEffect(() => {
    if (tf.lastError) { setErrorTick(t => t + 1); setCode(""); }
    if (prevVerify.current === "sending") { setResent(true); setCode(""); }
  }, [tf.receivedAt]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { prevVerify.current = verify; }, [verify]);
  useEffect(() => {
    if (!resent) return;
    const t = setTimeout(() => setResent(false), 3500);
    return () => clearTimeout(t);
  }, [resent]);

  const submit = (value: string) => {
    if (value.length === CODE_LENGTH && verify === "idle") void respondApple({ SubmitCode: value });
  };

  const title = success ? "Compte connecté" : mode === "unknown" ? "Vérifie que c’est bien toi" : "Entre le code de vérification";
  const subtitle = success
    ? "Apple a validé le code. CordLauncher peut signer tes apps."
    : mode === "sms"
      ? `Apple a envoyé un code à 6 chiffres par SMS au ${selected?.numberWithDialCode ?? "numéro choisi"}.`
      : mode === "unknown"
        ? "Choisis où recevoir le code à 6 chiffres, puis entre-le ici."
        : "Un code à 6 chiffres vient de s’afficher sur ton iPhone, ton iPad ou ton Mac. Autorise la connexion, puis entre-le ici.";

  return (
    <div className="relative z-[3] flex flex-col">
      <div className="space-y-5 px-8 pt-9 pb-6 text-center">
        <AnimatePresence mode="wait" initial={false}>
          {success ? <SuccessMark key="ok" /> : <DeviceIllustration key={mode} mode={mode} />}
        </AnimatePresence>

        <div className="space-y-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={title}
              id="apple-2fa-title"
              className="font-display text-[22px] font-semibold tracking-[-0.02em]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: springSoft }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            >
              {title}
            </motion.h2>
          </AnimatePresence>
          <p className="mx-auto max-w-[360px] text-sm leading-relaxed text-fg-muted">{subtitle}</p>
          <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[var(--control)] py-1 pr-3 pl-1 text-xs text-fg-muted">
            <span
              className="grid size-5 place-items-center rounded-full text-[10px] font-semibold text-white uppercase"
              style={{ backgroundImage: `linear-gradient(135deg, hsl(${hueOf(tf.email)} 72% 62%), hsl(${(hueOf(tf.email) + 48) % 360} 70% 48%))` }}
            >
              {tf.email[0]}
            </span>
            <span className="truncate">{tf.email}</span>
          </span>
        </div>

        {mode !== "unknown" && (
          <CodeInput
            value={code}
            onChange={value => { setCode(value); if (value.length === CODE_LENGTH) submit(value); }}
            phase={success ? "success" : verify === "verifying" ? "verifying" : tf.lastError && !code ? "error" : "idle"}
            errorTick={errorTick}
            disabled={verify !== "idle"}
          />
        )}

        <div className="min-h-6 text-sm">
          <AnimatePresence mode="wait" initial={false}>
            {verify === "verifying" ? (
              <Status key="verifying" className="text-fg-muted"><Loader2 className="size-4 animate-spin" />Vérification auprès d’Apple…</Status>
            ) : verify === "sending" ? (
              <Status key="sending" className="text-fg-muted"><Loader2 className="size-4 animate-spin" />Envoi d’un nouveau code…</Status>
            ) : resent ? (
              <Status key="resent" className="text-ok"><Check className="size-4" strokeWidth={3} />Nouveau code envoyé</Status>
            ) : tf.lastError && !success ? (
              <Status key={`err-${errorTick}`} className="text-danger"><AlertCircle className="size-4" />{friendlyError(tf.lastError)}</Status>
            ) : null}
          </AnimatePresence>
        </div>

        {!success && (
          <div className="flex flex-wrap justify-center gap-2">
            {mode === "device" && (
              <GlassButton size="sm" variant="glass" icon={<RefreshCw className="size-3.5" />} disabled={verify !== "idle"} onClick={() => void respondApple("ResendCode")}>Renvoyer le code</GlassButton>
            )}
            {mode !== "device" && (
              <GlassButton size="sm" variant="glass" icon={<Smartphone className="size-3.5" />} disabled={verify !== "idle"} onClick={() => void respondApple("SendToDevices")}>Sur mes appareils</GlassButton>
            )}
            {tf.numbers.map(n => (
              <GlassButton key={n.id} size="sm" variant="glass" icon={<MessageSquareText className="size-3.5" />} disabled={verify !== "idle"} onClick={() => void respondApple({ SendSms: n.id })}>
                SMS {n.lastTwoDigits ? `•• ${n.lastTwoDigits}` : n.numberWithDialCode}
              </GlassButton>
            ))}
          </div>
        )}
      </div>

      {!success && (
        <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-8 py-4">
          <Countdown key={tf.receivedAt} seconds={tf.expiresIn} />
          <GlassButton size="sm" variant="ghost" onClick={() => void respondApple("Abort")}>Annuler</GlassButton>
        </div>
      )}
    </div>
  );
}

function Status({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.p
      className={cn("inline-flex items-center justify-center gap-2", className)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, transition: springSoft }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }}
    >
      {children}
    </motion.p>
  );
}

/** Messages d'Apple (« -21669 - Incorrect verification code ») rendus lisibles. */
function friendlyError(message: string) {
  if (/-21669|incorrect|invalid/i.test(message)) return "Code incorrect. Vérifie-le et réessaie.";
  if (/-21?2(0|1)\d\d|expired/i.test(message)) return "Ce code a expiré : demande-en un nouveau.";
  return message;
}

function CodeInput({ value, onChange, phase, errorTick, disabled }: {
  value: string;
  onChange: (value: string) => void;
  phase: "idle" | "error" | "verifying" | "success";
  errorTick: number;
  disabled: boolean;
}) {
  const [scope, animate] = useAnimate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (errorTick) void animate(scope.current, { x: [0, -14, 12, -9, 6, -3, 0] }, { duration: 0.5, ease: "easeOut" });
  }, [errorTick]); // eslint-disable-line react-hooks/exhaustive-deps
  // Le focus revient au champ dès qu'on peut retaper.
  useEffect(() => { if (!disabled) inputRef.current?.focus({ preventScroll: true }); }, [disabled, errorTick]);

  return (
    <div ref={scope} className="relative mx-auto flex w-fit items-center gap-2.5" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        aria-label="Code de vérification Apple à six chiffres"
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={CODE_LENGTH}
        value={value}
        disabled={disabled}
        autoFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))}
        className="absolute inset-0 z-10 cursor-text opacity-0"
      />
      {Array.from({ length: CODE_LENGTH }, (_, i) => {
        const digit = value[i];
        const current = focused && !disabled && i === Math.min(value.length, CODE_LENGTH - 1) && value.length < CODE_LENGTH;
        const ring =
          phase === "success" ? "var(--ok)"
          : phase === "error" ? "var(--danger)"
          : current || phase === "verifying" ? "color-mix(in oklab, var(--tint-a) 80%, white)"
          : digit ? "color-mix(in oklab, var(--fg) 30%, transparent)"
          : "var(--line)";
        return (
          <motion.div
            key={i}
            className={cn("relative grid h-[58px] w-[46px] place-items-center rounded-[14px] bg-[var(--control)] font-display text-[26px] font-semibold", i === 2 && "mr-3")}
            animate={
              phase === "verifying" ? { y: [0, -7, 0], boxShadow: `inset 0 0 0 1.5px ${ring}` }
              : phase === "success" ? { y: 0, scale: [1, 1.12, 1], boxShadow: `inset 0 0 0 1.5px ${ring}, 0 0 22px -4px ${ring}` }
              : { y: 0, scale: current ? 1.06 : 1, boxShadow: `inset 0 0 0 ${current ? 2 : 1.5}px ${ring}${current ? `, 0 0 24px -8px ${ring}` : ""}` }
            }
            transition={
              phase === "verifying" ? { y: { duration: 0.8, repeat: Infinity, delay: i * 0.09, ease: "easeInOut" } }
              : phase === "success" ? { scale: { duration: 0.45, delay: i * 0.05 }, boxShadow: { duration: 0.3, delay: i * 0.05 } }
              : springSnappy
            }
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {digit && (
                <motion.span
                  key={`${i}-${digit}`}
                  className={cn(phase === "success" && "text-ok", phase === "error" && "text-danger")}
                  initial={{ opacity: 0, y: 12, scale: 0.4, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: springBouncy }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.12 } }}
                >
                  {digit}
                </motion.span>
              )}
            </AnimatePresence>
            {current && !digit && <span aria-hidden className="absolute h-7 w-[2px] rounded-full bg-fg animate-caret" />}
          </motion.div>
        );
      })}
    </div>
  );
}

/** iPhone stylisé qui reçoit le code : ondes, puis bannière ou bulle SMS. */
function DeviceIllustration({ mode }: { mode: "device" | "sms" | "unknown" }) {
  return (
    <motion.div
      className="relative mx-auto grid size-[132px] place-items-center"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, transition: springSoft }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.18 } }}
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "inset 0 0 0 1.5px color-mix(in oklab, var(--tint-a) 70%, transparent)" }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.2], opacity: [0.7, 0] }}
          transition={{ duration: 2.7, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
        />
      ))}
      <motion.div
        aria-hidden
        className="relative h-[100px] w-[58px] rounded-[15px] p-[3px]"
        style={{ background: "linear-gradient(160deg, color-mix(in oklab, var(--fg) 40%, transparent), color-mix(in oklab, var(--fg) 12%, transparent))" }}
        initial={{ y: 16, rotate: -8 }}
        animate={{ y: [0, -4, 0], rotate: 0 }}
        transition={{ rotate: springBouncy, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[12px]" style={{ background: "linear-gradient(170deg, color-mix(in oklab, var(--tint-a) 55%, #0b0913), color-mix(in oklab, var(--tint-b) 40%, #0b0913))" }}>
          <span className="absolute top-[5px] left-1/2 h-[7px] w-[20px] -translate-x-1/2 rounded-full bg-black/70" />
          <motion.div
            className="absolute inset-x-[4px] top-[18px] rounded-[7px] bg-white/85 px-[5px] py-[5px] shadow-lg"
            initial={{ y: -26, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ ...springBouncy, delay: 0.35 }}
          >
            {mode === "sms" ? (
              <span className="flex items-center justify-center gap-[3px] py-[2px]">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="size-[4px] rounded-full bg-[#6e58f0]" animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.5 + i * 0.15 }} />
                ))}
              </span>
            ) : (
              <span className="flex flex-col items-center gap-[3px]">
                <span className="h-[3px] w-[26px] rounded-full bg-black/25" />
                <span className="flex gap-[2px]">
                  {Array.from({ length: 6 }, (_, i) => (
                    <motion.span key={i} className="size-[4px] rounded-[1.5px] bg-[#6e58f0]" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 1, 0.35], scale: 1 }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6, delay: 0.7 + i * 0.08 }} />
                  ))}
                </span>
              </span>
            )}
          </motion.div>
          {mode === "unknown" && (
            <motion.span className="absolute bottom-[10px] left-1/2 grid size-[18px] -translate-x-1/2 place-items-center rounded-full bg-white/85 text-[#6e58f0]" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <KeyRound className="size-[10px]" />
            </motion.span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Coche qui se trace, avec une gerbe de particules. */
function SuccessMark() {
  return (
    <motion.div
      className="relative mx-auto grid size-[132px] place-items-center"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, transition: springBouncy }}
      exit={{ opacity: 0 }}
    >
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            aria-hidden
            className="absolute size-[7px] rounded-full"
            style={{ background: i % 2 ? "var(--ok)" : "var(--tint-a)" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * 64, y: Math.sin(angle) * 64, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.9, ease: easeGlass, delay: 0.15 }}
          />
        );
      })}
      <motion.span
        aria-hidden
        className="absolute inset-[22px] rounded-full"
        style={{ background: "color-mix(in oklab, var(--ok) 20%, transparent)" }}
        initial={{ scale: 0.4 }}
        animate={{ scale: [0.4, 1.15, 1] }}
        transition={{ duration: 0.6, ease: easeGlass }}
      />
      <svg viewBox="0 0 88 88" className="relative size-[88px]" aria-hidden>
        <motion.circle cx="44" cy="44" r="38" fill="none" stroke="var(--ok)" strokeWidth="4" strokeLinecap="round"
          initial={{ pathLength: 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, ease: easeGlass }} style={{ originX: "50%", originY: "50%" }} />
        <motion.path d="M27 45 l11 11 l23 -24" fill="none" stroke="var(--ok)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.45, ease: easeGlass }} />
      </svg>
    </motion.div>
  );
}

/** Temps laissé pour répondre : barre qui se vide et décompte m:ss. */
function Countdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => setLeft(Math.max(0, seconds - Math.floor((Date.now() - start) / 1000))), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const urgent = left <= 30;
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="relative h-1.5 w-28 overflow-hidden rounded-full bg-[var(--control)]">
        <motion.span
          className={cn("absolute inset-y-0 left-0 rounded-full", urgent ? "bg-warn" : "tint-fill")}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: seconds, ease: "linear" }}
        />
      </div>
      <span className={cn("font-mono text-xs tabular-nums", urgent ? "text-warn" : "text-fg-subtle")}>
        {left > 0 ? `Expire dans ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : "Délai dépassé"}
      </span>
    </div>
  );
}
