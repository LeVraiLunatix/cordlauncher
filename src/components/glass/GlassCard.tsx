import { motion, useSpring, type HTMLMotionProps, type MotionStyle } from "motion/react";
import type { PointerEvent, Ref } from "react";
import type { Gradient } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";

export type GlassCardProps = HTMLMotionProps<"div"> & {
  ref?: Ref<HTMLDivElement>;
  /** Teinte locale du verre (dégradé de l'app). Hérite de l'ambiance sinon. */
  tint?: Gradient;
  /** Survol vivant : reflet qui suit le curseur, lueur colorée, verre éclairci. */
  interactive?: boolean;
  /** Inclinaison 3D maximale au survol, en degrés (0 = à plat). */
  tilt?: number;
  /** Verre épais (barres, modales) : plus opaque, plus flouté. */
  strong?: boolean;
  /** Angle du liseré lumineux, pour varier d'une vitre à l'autre. */
  rimAngle?: number;
};

/**
 * La vitre de base de toute l'interface.
 *
 * Le rendu est entièrement en CSS (utilitaires `glass`, `glass-rim`,
 * `glass-sheen` de styles.css) ; ce composant ne fait que deux choses en JS :
 * écrire la position du curseur dans `--mx/--my` (sans re-rendu React), et
 * piloter l'inclinaison par des ressorts.
 *
 * Pour l'animer, on anime CETTE vitre (opacity/y/scale), pas un conteneur
 * autour — cf. le piège du flou en tête de styles.css.
 */
export function GlassCard({
  ref,
  tint,
  interactive = false,
  tilt = 0,
  strong = false,
  rimAngle,
  className,
  style,
  onPointerMove,
  onPointerLeave,
  children,
  ...rest
}: GlassCardProps) {
  const rotateX = useSpring(0, { stiffness: 180, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 20 });

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (interactive || tilt) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      if (tilt) {
        rotateY.set((px - 0.5) * tilt * 2);
        rotateX.set(-(py - 0.5) * tilt * 2);
      }
    }
    onPointerMove?.(e);
  };

  const handleLeave = (e: PointerEvent<HTMLDivElement>) => {
    rotateX.set(0);
    rotateY.set(0);
    onPointerLeave?.(e);
  };

  const cssVars: Record<string, string> = {};
  if (tint) {
    cssVars["--tint-a"] = tint[0];
    cssVars["--tint-b"] = tint[1];
  }
  if (rimAngle != null) cssVars["--rim-angle"] = `${rimAngle}deg`;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "glass glass-rim",
        interactive && "glass-sheen glass-interactive",
        strong && "glass-strong",
        className,
      )}
      style={
        {
          ...cssVars,
          ...(tilt ? { rotateX, rotateY, transformPerspective: 1000 } : null),
          ...style,
        } as MotionStyle
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
