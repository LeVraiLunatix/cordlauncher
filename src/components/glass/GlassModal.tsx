import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Gradient } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { easeGlass } from "../../lib/motion";
import { GlassCard } from "./GlassCard";

type GlassModalProps = {
  open: boolean;
  onClose: () => void;
  /** Teinte du verre (dégradé de l'app présentée). */
  tint?: Gradient;
  /** Largeur maximale du panneau, en px. */
  width?: number;
  /** id du titre, pour `aria-labelledby`. */
  labelledBy?: string;
  className?: string;
  /** Masque le bouton de fermeture intégré (dialogues de confirmation). */
  hideClose?: boolean;
  children: ReactNode;
};

/**
 * Modale en verre épais. Le voile et le panneau sont FRÈRES, pas parent et
 * enfant : un voile flouté qui contiendrait le panneau deviendrait sa racine
 * de fond, et le panneau ne flouterait plus rien (cf. styles.css).
 *
 * Fermeture : Échap, clic sur le voile, bouton ×. Le focus revient à
 * l'élément qui a ouvert la modale.
 */
/** Modales ouvertes, de la plus ancienne à la plus récente : Échap ne ferme que celle du dessus. */
const openStack: symbol[] = [];

export function GlassModal({
  open,
  onClose,
  tint,
  width = 860,
  labelledBy,
  className,
  hideClose = false,
  children,
}: GlassModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const token = Symbol("modal");
    openStack.push(token);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openStack[openStack.length - 1] === token) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    // Laisse le panneau entrer avant de lui donner le focus.
    const t = setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 60);
    return () => {
      openStack.splice(openStack.indexOf(token), 1);
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="glass-modal" className="fixed inset-0 z-50 grid place-items-center p-6 pt-14">
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "var(--scrim)",
              backdropFilter: "blur(8px) saturate(1.15)",
              WebkitBackdropFilter: "blur(8px) saturate(1.15)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35, ease: easeGlass } }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: easeGlass } }}
            onClick={onClose}
          />
          <GlassCard
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            strong
            tint={tint}
            rimAngle={160}
            className={cn(
              "relative flex max-h-full w-full flex-col overflow-hidden rounded-[32px] outline-none",
              className,
            )}
            style={{ maxWidth: width }}
            initial={{ opacity: 0, y: 28, scale: 0.955 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 260, damping: 26, mass: 0.9 },
            }}
            exit={{ opacity: 0, y: 18, scale: 0.97, transition: { duration: 0.22, ease: easeGlass } }}
          >
            {!hideClose && (
              <motion.button
                type="button"
                aria-label="Fermer"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-[var(--control)] text-fg-muted ring-1 ring-[var(--line)] transition-colors hover:bg-[var(--control-hover)] hover:text-fg"
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <X className="size-4" />
              </motion.button>
            )}
            {children}
          </GlassCard>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
