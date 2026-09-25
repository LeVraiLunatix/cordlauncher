import { AlertCircle, ArrowUpRight, KeyRound, Loader2, LockKeyhole, LockKeyholeOpen, LogIn, Smartphone } from "lucide-react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCordAccount } from "../../lib/account";
import { closeBetaSheet, formatBetaKey, isCompleteBetaKey, navigateTo, redeemBeta, useBetaSheet } from "../../lib/beta";
import type { CatalogApp } from "../../lib/catalog/types";
import { hasIphoneVersion, openIphoneInstall } from "../../lib/iphone";
import { springBouncy, springSoft } from "../../lib/motion";
import { openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { GlassButton, GlassModal } from "../glass";
import { AppIcon } from "./AppIcon";
import { SuccessMark } from "./AppleAccount";

/**
 * Fenêtre « Rejoindre la bêta » : la clé d'accès reçue (PASS-XXXX-XXXX-XXXX)
 * est validée par le Compte Cord, qui ouvre alors le téléchargement du build.
 */
export function BetaKeySheet({ apps }: { apps: CatalogApp[] }) {
  const openId = useBetaSheet();
  const app = apps.find(a => a.id === openId) ?? null;
  const last = useRef<CatalogApp | null>(app);
  if (app) last.current = app;
  const shown = app ?? last.current;
  return (
    <GlassModal open={!!app} onClose={closeBetaSheet} tint={shown?.iconGradient} width={500} labelledBy="beta-key-title">
      {shown && <Body key={shown.id} app={shown} />}
    </GlassModal>
  );
}

function Body({ app }: { app: CatalogApp }) {
  const { user } = useCordAccount();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [scope, animate] = useAnimate();
  const inputRef = useRef<HTMLInputElement>(null);
  const groups = key.split("-").filter(Boolean);

  useEffect(() => { if (user?.emailVerified) setTimeout(() => inputRef.current?.focus(), 120); }, [user?.emailVerified]);

  async function submit() {
    if (!isCompleteBetaKey(key) || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await redeemBeta(key);
      setDone(true);
      if (result.already) toast({ tone: "info", title: "Tu fais déjà partie de la bêta" });
    } catch (e) {
      setError((e as Error).message);
      void animate(scope.current, { x: [0, -12, 10, -7, 5, -2, 0] }, { duration: 0.45 });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative z-[3] flex flex-col items-center gap-5 px-8 pt-10 pb-8 text-center">
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {done ? <SuccessMark key="ok" /> : (
            <motion.div key="icon" className="relative grid size-[132px] place-items-center" exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.18 } }}>
              <motion.span
                aria-hidden
                className="absolute inset-3 rounded-[34px]"
                style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--tint-a) 45%, transparent), transparent 70%)" }}
                animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div initial={{ y: 10, scale: 0.9 }} animate={{ y: [0, -5, 0], scale: 1 }} transition={{ scale: springBouncy, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}>
                <AppIcon app={app} size={84} />
              </motion.div>
              <motion.span
                className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-[var(--bg)] text-fg shadow-lg ring-1 ring-[var(--line)]"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0, transition: { ...springBouncy, delay: 0.25 } }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isCompleteBetaKey(key)
                    ? <motion.span key="open" initial={{ scale: 0.4, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.4 }} transition={springBouncy}><LockKeyholeOpen className="size-4 text-ok" /></motion.span>
                    : <motion.span key="closed" initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0.4 }} transition={springBouncy}><LockKeyhole className="size-4" /></motion.span>}
                </AnimatePresence>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <h2 id="beta-key-title" className="font-display text-[22px] font-semibold tracking-[-0.02em]">
          {done ? `Bienvenue dans la bêta de ${app.name} !` : `Rejoindre la bêta de ${app.name}`}
        </h2>
        <p className="mx-auto max-w-[370px] text-sm leading-relaxed text-fg-muted">
          {done
            ? "Ton Compte Cord a maintenant accès au dernier build. Installe-le sur ton iPhone depuis ce PC."
            : !user
              ? `La bêta de ${app.name} est réservée aux testeurs : connecte-toi à ton Compte Cord pour utiliser ta clé d’accès.`
              : !user.emailVerified
                ? "Confirme d’abord l’adresse email de ton Compte Cord : tu pourras ensuite utiliser ta clé."
                : "Entre la clé d’accès que tu as reçue. Elle est liée à ton Compte Cord dès qu’elle est acceptée."}
        </p>
      </div>

      {done ? (
        <motion.div className="flex flex-wrap justify-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { ...springSoft, delay: 0.5 } }}>
          {hasIphoneVersion(app.ios) && (
            <GlassButton variant="primary" tint={app.iconGradient} icon={<Smartphone className="size-4" />} onClick={() => { closeBetaSheet(); openIphoneInstall(app); }}>
              Installer sur iPhone
            </GlassButton>
          )}
          <GlassButton variant="ghost" onClick={closeBetaSheet}>Fermer</GlassButton>
        </motion.div>
      ) : !user ? (
        <GlassButton variant="primary" tint={app.iconGradient} icon={<LogIn className="size-4" />} onClick={() => { closeBetaSheet(); navigateTo("account"); }}>
          Se connecter au Compte Cord
        </GlassButton>
      ) : (
        <form className="w-full space-y-4" onSubmit={e => { e.preventDefault(); void submit(); }}>
          <div ref={scope} className="space-y-2.5">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-subtle" />
              <input
                ref={inputRef}
                aria-label="Clé d’accès à la bêta"
                className="cord-input h-14 pl-11 text-center font-mono text-[19px] font-semibold tracking-[0.12em] uppercase"
                placeholder="PASS-XXXX-XXXX-XXXX"
                autoComplete="off"
                spellCheck={false}
                value={key}
                disabled={busy || !user.emailVerified}
                onChange={e => { setKey(formatBetaKey(e.target.value)); setError(null); }}
              />
            </div>
            <div className="mx-auto flex w-[220px] gap-1.5" aria-hidden>
              {[0, 1, 2, 3].map(i => (
                <span key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-[var(--control)]">
                  <motion.span
                    className={error ? "absolute inset-0 rounded-full bg-danger" : "tint-fill absolute inset-0 rounded-full"}
                    initial={false}
                    animate={{ scaleX: groups[i]?.length === 4 ? 1 : (groups[i]?.length ?? 0) / 4 }}
                    style={{ originX: 0 }}
                    transition={springSoft}
                  />
                </span>
              ))}
            </div>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p role="alert" className="flex items-center justify-center gap-2 text-sm text-danger" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCircle className="size-4 shrink-0" />{error}
              </motion.p>
            )}
          </AnimatePresence>
          <GlassButton type="submit" variant="primary" tint={app.iconGradient} className="w-full justify-center"
            disabled={!isCompleteBetaKey(key) || busy || !user.emailVerified}
            icon={busy ? <Loader2 className="size-4 animate-spin" /> : <LockKeyholeOpen className="size-4" />}>
            {busy ? "Vérification…" : "Débloquer la bêta"}
          </GlassButton>
        </form>
      )}

      {!done && app.betaUrl && (
        <button type="button" className="inline-flex items-center gap-1 text-xs text-fg-muted underline-offset-2 hover:text-fg hover:underline" onClick={() => void openExternal(app.betaUrl!)}>
          Pas encore de clé ? Inscris-toi sur la liste d’attente <ArrowUpRight className="size-3" />
        </button>
      )}
    </div>
  );
}
