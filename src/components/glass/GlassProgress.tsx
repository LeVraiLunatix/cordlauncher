import { motion } from "motion/react";
import { cn } from "../../lib/cn";

type GlassProgressProps = {
  /** 0 → 1 ; `null` = durée inconnue (barre qui va-et-vient). */
  value: number | null;
  className?: string;
  label?: string;
};

/**
 * Barre de progression creusée dans le verre. Le remplissage prend le
 * dégradé de l'app, avance sur un ressort (pas de saccade entre deux
 * paquets reçus), porte des rayures qui défilent et une lueur à sa pointe.
 */
export function GlassProgress({ value, className, label }: GlassProgressProps) {
  const pct = value == null ? undefined : Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn("glass-inset relative h-2 w-full overflow-hidden rounded-full", className)}
    >
      {value == null ? (
        <motion.div
          className="tint-fill absolute inset-y-0 w-2/5 rounded-full"
          initial={{ x: "-110%" }}
          animate={{ x: "260%" }}
          transition={{ duration: 1.25, repeat: Infinity, ease: [0.45, 0, 0.2, 1] }}
        />
      ) : (
        <motion.div
          className="tint-fill absolute inset-y-0 left-0 rounded-full"
          initial={false}
          animate={{ width: `${Math.max(pct ?? 0, 4)}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        >
          <span
            aria-hidden
            className="absolute inset-0 animate-stripes rounded-full opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgb(255 255 255 / 0.55) 25%, transparent 25%, transparent 50%, rgb(255 255 255 / 0.55) 50%, rgb(255 255 255 / 0.55) 75%, transparent 75%)",
              backgroundSize: "28px 28px",
            }}
          />
          <span
            aria-hidden
            className="absolute top-1/2 right-0 size-4 translate-x-1/3 -translate-y-1/2 rounded-full bg-white/80 blur-[6px]"
          />
        </motion.div>
      )}
    </div>
  );
}
