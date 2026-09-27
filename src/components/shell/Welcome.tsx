import { ArrowLeft, ArrowRight, Check, Minus, Download, FolderOpen, Monitor, Power, RefreshCw, Smartphone, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useCordAccount } from "../../lib/account";
import { activeProfile, refreshApple, useApple } from "../../lib/apple";
import { cn } from "../../lib/cn";
import { easeGlass, springBouncy, springSoft } from "../../lib/motion";
import { defaultAppsDir, IS_TAURI, pickFolder } from "../../lib/platform";
import { updateSettings, useSettings } from "../../lib/settings";
import { toast } from "../../lib/toast";
import { SignedOut } from "../../views/AccountView";
import { AppleAccount, AppleVerification, SuccessMark } from "../apps/AppleAccount";
import { GlassButton, GlassCard, GlassToggle } from "../glass";
import { WindowControls } from "./WindowControls";

const DONE_KEY = "cordlauncher:welcome-done";
/** L'accueil n'apparaît qu'au premier lancement. */
export const welcomeDone = () => { try { return localStorage.getItem(DONE_KEY) === "1"; } catch { return true; } };
const markWelcomeDone = () => { try { localStorage.setItem(DONE_KEY, "1"); } catch { /* stockage indisponible */ } };

type Step = { id: string; title: string; hint: string; icon: LucideIcon };
const STEPS: Step[] = [
  { id: "hello", title: "Bienvenue", hint: "La suite Cord, sur ton PC", icon: Sparkles },
  { id: "account", title: "Ton Compte Cord", hint: "Un compte pour toute la suite", icon: UserRound },
  { id: "apps", title: "Tes apps", hint: "Où les installer, comment", icon: Monitor },
  { id: "iphone", title: "Ton iPhone", hint: "Facultatif", icon: Smartphone },
  { id: "ready", title: "C’est prêt", hint: "À toi de jouer", icon: Check },
];

const ORBIT = ["drivecord", "passcord", "tunecord", "notecord", "linkcord", "bentocord"];

/**
 * Accueil du premier lancement : quelques étapes, dans l'ordre où on en a
 * besoin (compte, dossier des apps, iPhone), chacune modifiable ensuite dans
 * les Réglages. Rien n'est obligatoire.
 */
export function Welcome({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)));
  };
  const finish = () => {
    markWelcomeDone();
    onDone();
  };

  return (
    <motion.div
      className="relative z-10 flex h-full flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)", transition: { duration: 0.45, ease: easeGlass } }}
    >
      <header data-tauri-drag-region="deep" className="relative z-20 flex h-[52px] shrink-0 items-center justify-between pl-5">
        <div className="flex items-center gap-2.5">
          <motion.img layoutId="brand-logo" src="/logos/cordsuite.png" alt="" draggable={false}
            className="size-[22px] rounded-[6px] shadow-[0_2px_10px_-2px_rgb(110_88_240/0.7)]" />
          <span className="font-display text-[13.5px] font-semibold tracking-[-0.01em]">CordLauncher</span>
        </div>
        <WindowControls />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)] gap-3 px-3 pb-3">
        <StepRail step={step} onStep={i => i < step && go(i)} />

        <GlassCard className="flex min-h-0 flex-col overflow-hidden rounded-[28px]">
          <div className="relative z-[3] min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.section
                key={STEPS[step].id}
                custom={direction}
                initial={{ opacity: 0, x: 48 * direction, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: springSoft }}
                exit={{ opacity: 0, x: -36 * direction, filter: "blur(8px)", transition: { duration: 0.22, ease: easeGlass } }}
                className="mx-auto flex min-h-full w-full max-w-[600px] flex-col justify-center px-8 py-10"
              >
                {step === 0 && <HelloStep onNext={() => go(1)} />}
                {step === 1 && <AccountStep onNext={() => go(2)} />}
                {step === 2 && <AppsStep />}
                {step === 3 && <IphoneStep />}
                {step === 4 && <ReadyStep />}
              </motion.section>
            </AnimatePresence>
          </div>

          {step > 0 && (
            <footer className="relative z-[3] flex items-center gap-3 border-t border-[var(--line)] px-6 py-4">
              <GlassButton variant="ghost" icon={<ArrowLeft className="size-4" />} onClick={() => go(step - 1)}>Retour</GlassButton>
              <span className="flex-1" />
              {step === STEPS.length - 1 ? (
                <GlassButton variant="primary" size="lg" trailingIcon={<ArrowRight className="size-4" />} onClick={finish}>Découvrir la suite</GlassButton>
              ) : (
                <NextButton step={step} onNext={() => go(step + 1)} />
              )}
            </footer>
          )}
        </GlassCard>
      </div>
      <AppleVerification />
    </motion.div>
  );
}

/** « Continuer », ou « Plus tard » tant que l'étape facultative n'est pas faite. */
function NextButton({ step, onNext }: { step: number; onNext: () => void }) {
  const { user } = useCordAccount();
  const apple = useApple();
  const done = step === 1 ? !!user : step === 3 ? !!activeProfile(apple.status) : true;
  return done
    ? <GlassButton variant="primary" size="lg" trailingIcon={<ArrowRight className="size-4" />} onClick={onNext}>Continuer</GlassButton>
    : <GlassButton variant="glass" size="lg" trailingIcon={<ArrowRight className="size-4" />} onClick={onNext}>{step === 3 ? "Je n’ai pas d’iPhone" : "Plus tard"}</GlassButton>;
}

function StepRail({ step, onStep }: { step: number; onStep: (i: number) => void }) {
  // Étape facultative passée sans être faite : un tiret, pas une coche.
  const { user } = useCordAccount();
  const apple = useApple();
  const skipped = (i: number) => (i === 1 && !user) || (i === 3 && !activeProfile(apple.status));
  return (
    <GlassCard className="flex flex-col rounded-[28px] p-5">
      <div className="relative z-[3] flex h-full flex-col">
        <p className="text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Premier lancement</p>
        <p className="mt-1 font-display text-[20px] font-semibold tracking-[-0.02em]">Bienvenue</p>

        <ol className="relative mt-7 flex flex-col gap-1.5">
          {/* Fil qui se remplit à mesure qu'on avance. */}
          <span aria-hidden className="absolute top-5 bottom-5 left-[21px] w-[2px] rounded-full bg-[var(--line)]" />
          <motion.span aria-hidden className="tint-fill absolute top-5 left-[21px] w-[2px] origin-top rounded-full"
            initial={false} animate={{ height: `calc(${(step / (STEPS.length - 1)) * 100}% - ${(step / (STEPS.length - 1)) * 40}px)` }} transition={springSoft} />
          {STEPS.map((s, i) => {
            const state = i < step ? (skipped(i) ? "skipped" : "done") : i === step ? "current" : "todo";
            return (
              <li key={s.id}>
                <button type="button" disabled={i >= step} onClick={() => onStep(i)}
                  className={cn("relative flex w-full items-center gap-3 rounded-[16px] px-2 py-2 text-left transition-colors", i < step && "hover:bg-[var(--control)]")}>
                  <motion.span layout
                    className={cn("relative z-[1] grid size-[30px] shrink-0 place-items-center rounded-full text-[12px] font-bold ring-1 ring-inset",
                      state === "current" ? "tint-fill text-white ring-white/20" : state === "done" ? "bg-ok text-white ring-white/10" : state === "skipped" ? "bg-[var(--control-hover)] text-fg-muted ring-[var(--line)]" : "bg-[var(--glass-fill)] text-fg-subtle ring-[var(--line)]")}
                    animate={state === "current" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={state === "current" ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : springSoft}>
                    {state === "done" ? <Check className="size-4" strokeWidth={3} /> : state === "skipped" ? <Minus className="size-4" strokeWidth={3} /> : i + 1}
                  </motion.span>
                  <span className="min-w-0">
                    <span className={cn("block text-[13.5px] font-semibold", state === "todo" && "text-fg-muted")}>{s.title}</span>
                    <span className="block truncate text-[11.5px] text-fg-subtle">{state === "skipped" ? "Plus tard" : s.hint}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="mt-auto pt-6 text-[11.5px] leading-relaxed text-fg-subtle">Rien n’est définitif : tout se retrouve dans les Réglages et l’onglet Compte Cord.</p>
      </div>
    </GlassCard>
  );
}

// ── Étapes ──────────────────────────────────────────────────────────────────

function StepHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-7">
      <p className="text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">{eyebrow}</p>
      <h1 className="mt-1.5 font-display text-[30px] leading-tight font-semibold tracking-[-0.03em]">{title}</h1>
      {children && <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-fg-muted">{children}</p>}
    </div>
  );
}

function HelloStep({ onNext }: { onNext: () => void }) {
  const features: [LucideIcon, string, string][] = [
    [Download, "Installe en un clic", "Sans droits administrateur, dans le dossier de ton choix."],
    [RefreshCw, "Tout reste à jour", "Les nouvelles versions arrivent toutes seules, sur ton PC comme sur ton iPhone."],
    [UserRound, "Un seul compte", "Ton Compte Cord t’ouvre toutes les apps de la suite."],
  ];
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-9 grid size-[220px] place-items-center">
        <motion.div aria-hidden className="absolute inset-6 rounded-full"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--tint-a) 55%, transparent), transparent)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
          {ORBIT.map((id, i) => {
            const angle = (i / ORBIT.length) * Math.PI * 2;
            return (
              <motion.img key={id} src={`/logos/${id}.png`} alt="" draggable={false}
                className="absolute size-9 rounded-[10px] shadow-[0_8px_20px_-8px_rgb(0_0_0/0.6)]"
                style={{ left: `calc(50% + ${Math.cos(angle) * 96}px - 18px)`, top: `calc(50% + ${Math.sin(angle) * 96}px - 18px)` }}
                initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1, rotate: -360 }}
                transition={{ opacity: { delay: 0.2 + i * 0.08 }, scale: { ...springBouncy, delay: 0.2 + i * 0.08 }, rotate: { duration: 40, repeat: Infinity, ease: "linear" } }} />
            );
          })}
        </motion.div>
        <motion.img src="/logos/cordsuite.png" alt="" draggable={false}
          className="relative size-[92px] rounded-[24px] shadow-[0_20px_60px_-10px_rgb(110_88_240/0.8)]"
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springBouncy} />
      </div>
      <h1 className="font-display text-[34px] leading-tight font-semibold tracking-[-0.03em]">Bienvenue dans la suite Cord</h1>
      <p className="mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-fg-muted">CordLauncher installe les apps de la suite et les garde à jour, sur ton PC et sur ton iPhone. Trois petites étapes, et c’est parti.</p>
      <ul className="mt-8 grid w-full gap-2.5 text-left">
        {features.map(([Icon, title, text], i) => (
          <motion.li key={title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { ...springSoft, delay: 0.35 + i * 0.08 } }}
            className="flex items-center gap-3.5 rounded-[18px] bg-[var(--control)] px-4 py-3 ring-1 ring-[var(--line)] ring-inset">
            <span className="tint-fill grid size-9 shrink-0 place-items-center rounded-[11px] text-white"><Icon className="size-[17px]" /></span>
            <span><span className="block text-[14px] font-semibold">{title}</span><span className="block text-[12.5px] text-fg-muted">{text}</span></span>
          </motion.li>
        ))}
      </ul>
      <GlassButton variant="primary" size="lg" className="mt-8" trailingIcon={<ArrowRight className="size-4" />} onClick={onNext}>Commencer</GlassButton>
    </div>
  );
}

function AccountStep({ onNext }: { onNext: () => void }) {
  const { user } = useCordAccount();
  let remembered = "";
  try { remembered = localStorage.getItem("cordlauncher:email") ?? ""; } catch { /* rien */ }
  if (user) {
    return (
      <div className="flex flex-col items-center text-center">
        <SuccessMark />
        <h1 className="mt-6 font-display text-[28px] font-semibold tracking-[-0.03em]">Content de te voir, {user.name}</h1>
        <p className="mt-2 text-[14px] text-fg-muted">Connecté en tant que <strong className="font-semibold text-fg">{user.email}</strong>. Ton compte est prêt dans toute la suite.</p>
        <GlassButton variant="primary" size="lg" className="mt-7" trailingIcon={<ArrowRight className="size-4" />} onClick={onNext}>Continuer</GlassButton>
      </div>
    );
  }
  return (
    <>
      <p className="mb-3 text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">Étape 1 sur 3 · Compte Cord</p>
      <SignedOut bare initialMode={remembered ? "login" : "register"} />
    </>
  );
}

function AppsStep() {
  const s = useSettings(x => x);
  const [fallback, setFallback] = useState<string | null>(null);
  useEffect(() => { void defaultAppsDir().then(setFallback).catch(() => {}); }, []);
  const folder = s.installBase ?? fallback;
  const choose = () => void pickFolder("Dossier des apps Cord", folder ?? undefined)
    .then(installBase => { if (installBase) updateSettings({ installBase }); })
    .catch(error => toast({ tone: "error", title: "Dossier inaccessible", description: String(error) }));
  const toggles: { icon: LucideIcon; title: string; text: string; checked: boolean; set: (v: boolean) => void }[] = [
    { icon: Monitor, title: "Raccourci sur le Bureau", text: "Pour chaque app installée.", checked: s.desktopShortcut, set: v => updateSettings({ desktopShortcut: v }) },
    { icon: RefreshCw, title: "Mises à jour automatiques", text: "Les nouvelles versions s’installent toutes seules.", checked: s.autoInstallUpdates, set: v => updateSettings({ autoInstallUpdates: v, autoCheckUpdates: v || s.autoCheckUpdates }) },
    { icon: Power, title: "Lancer avec Windows", text: "CordLauncher démarre discrètement, réduit.", checked: s.launchAtStartup, set: v => updateSettings({ launchAtStartup: v, startMinimized: true }) },
  ];
  return (
    <>
      <StepHead eyebrow="Étape 2 sur 3" title="Tes apps">Drivecord, Tunecord et les autres s’installent chacune dans un sous-dossier. Pas besoin de droits administrateur.</StepHead>
      <div className="flex items-center gap-4 rounded-[20px] bg-[var(--control)] p-4 ring-1 ring-[var(--line)] ring-inset">
        <span className="tint-fill grid size-11 shrink-0 place-items-center rounded-[13px] text-white"><FolderOpen className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-fg-subtle">Dossier des apps</p>
          <p className="truncate font-mono text-[13px]" title={folder ?? undefined}>{folder ?? "Ton dossier Windows habituel"}</p>
        </div>
        <GlassButton variant="glass" disabled={!IS_TAURI} onClick={choose}>Changer…</GlassButton>
        {s.installBase && <GlassButton variant="ghost" onClick={() => updateSettings({ installBase: null })}>Par défaut</GlassButton>}
      </div>
      <div className="mt-3 grid gap-1 rounded-[20px] p-1 ring-1 ring-[var(--line)] ring-inset">
        {toggles.map(t => (
          <div key={t.title} className="flex items-center gap-3.5 rounded-[16px] px-3 py-3 transition-colors hover:bg-[var(--control)]">
            <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[var(--control)] text-fg-muted ring-1 ring-[var(--line)] ring-inset"><t.icon className="size-[17px]" /></span>
            <span className="min-w-0 flex-1"><span className="block text-[14px] font-medium">{t.title}</span><span className="block text-[12.5px] text-fg-subtle">{t.text}</span></span>
            <GlassToggle label={t.title} checked={t.checked} onChange={t.set} />
          </div>
        ))}
      </div>
    </>
  );
}

function IphoneStep() {
  useEffect(() => { void refreshApple().catch(() => {}); }, []);
  return (
    <>
      <StepHead eyebrow="Étape 3 sur 3 · facultatif" title="Ton iPhone">
        CordLauncher installe aussi les apps iPhone de la suite (Passcord, Drivecord…) et les renouvelle avant qu’elles expirent. Il lui faut ton compte Apple pour les signer : il reste sur ce PC, dans le coffre de Windows.
      </StepHead>
      <div className="rounded-[22px] bg-[var(--control)] p-5 ring-1 ring-[var(--line)] ring-inset">
        {IS_TAURI ? <AppleAccount /> : <p className="text-sm text-fg-muted">Disponible dans l’application Windows.</p>}
      </div>
    </>
  );
}

function ReadyStep() {
  const { user } = useCordAccount();
  const apple = useApple();
  const s = useSettings(x => x);
  const profile = activeProfile(apple.status);
  const rows: [LucideIcon, string, string, boolean][] = [
    [UserRound, "Compte Cord", user ? user.email : "Pas encore : connecte-toi quand tu veux, onglet Compte Cord", !!user],
    [FolderOpen, "Dossier des apps", s.installBase ?? "Dossier Windows par défaut", true],
    [Smartphone, "Compte Apple", profile ? profile.email : "Pas configuré : onglet iPhone, quand tu en auras besoin", !!profile],
  ];
  return (
    <div className="flex flex-col items-center text-center">
      <SuccessMark />
      <h1 className="mt-6 font-display text-[32px] font-semibold tracking-[-0.03em]">C’est prêt !</h1>
      <p className="mt-2 max-w-[44ch] text-[14px] text-fg-muted">Choisis une app dans Découvrir et installe-la en un clic. Bonne découverte de la suite.</p>
      <ul className="mt-8 grid w-full gap-2 text-left">
        {rows.map(([Icon, title, value, ok], i) => (
          <motion.li key={title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0, transition: { ...springSoft, delay: 0.3 + i * 0.08 } }}
            className="flex items-center gap-3.5 rounded-[18px] bg-[var(--control)] px-4 py-3 ring-1 ring-[var(--line)] ring-inset">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-[11px]", ok ? "bg-ok/15 text-ok" : "bg-[var(--control-hover)] text-fg-subtle")}><Icon className="size-[17px]" /></span>
            <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-semibold">{title}</span><span className="block truncate text-[12.5px] text-fg-muted">{value}</span></span>
            {ok && <Check className="size-4 text-ok" strokeWidth={3} />}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
