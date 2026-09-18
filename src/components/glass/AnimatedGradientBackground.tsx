import { motion, useTransform } from "motion/react";
import type { CSSProperties } from "react";
import { useAmbient } from "../../lib/ambient";

/**
 * Le fond de toute l'app : trois grandes taches de lumière aux couleurs de la
 * suite (ou de l'app sélectionnée) qui dérivent lentement, une aurore conique
 * qui tourne en une minute et demie, un vignettage et du grain.
 *
 * Deux plans de parallaxe à vitesses opposées suivent le curseur et le
 * défilement : c'est ce décalage qui donne de la profondeur au verre posé
 * par-dessus. Tout est en `transform` (composité par le GPU, pas de repeint).
 *
 * Les couleurs passent par `--tint-a/--tint-b`, des propriétés CSS typées
 * (@property) : quand la teinte change, elles glissent au lieu de sauter.
 */
export function AnimatedGradientBackground() {
  const { tint, pointerX, pointerY, scrollY } = useAmbient();

  const farX = useTransform(pointerX, (v) => v * -26);
  const farY = useTransform(() => pointerY.get() * -20 - Math.min(scrollY.get(), 1600) * 0.05);
  const nearX = useTransform(pointerX, (v) => v * 18);
  const nearY = useTransform(() => pointerY.get() * 14 - Math.min(scrollY.get(), 1600) * 0.11);

  const rootStyle = {
    "--tint-a": tint[0],
    "--tint-b": tint[1],
    transition: "--tint-a 1.4s var(--ease-glass), --tint-b 1.4s var(--ease-glass)",
    background: "var(--bg)",
  } as CSSProperties;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={rootStyle}>
      {/* Plan lointain : les deux teintes principales + un bleu profond. */}
      <motion.div className="absolute -inset-[20%]" style={{ x: farX, y: farY }}>
        <div
          className="bg-blob"
          style={blob("var(--tint-a)", { left: "-4%", top: "-10%" }, "drift-a 34s ease-in-out infinite alternate")}
        />
        <div
          className="bg-blob"
          style={blob("var(--tint-b)", { right: "-10%", top: "12%" }, "drift-b 41s ease-in-out infinite alternate")}
        />
        <div
          className="bg-blob"
          style={blob(
            "var(--bg-accent-cool)",
            { left: "22%", bottom: "-26%" },
            "drift-c 47s ease-in-out infinite alternate",
          )}
        />
      </motion.div>

      {/* Plan proche : une tache chaude plus petite, qui bouge à contresens. */}
      <motion.div className="absolute -inset-[20%]" style={{ x: nearX, y: nearY }}>
        <div
          className="bg-blob"
          style={{
            ...blob(
              "var(--bg-accent-warm)",
              { right: "14%", bottom: "4%" },
              "drift-a 29s ease-in-out infinite alternate-reverse",
            ),
            width: "44vmax",
            height: "44vmax",
          }}
        />
        <div
          className="bg-blob"
          style={{
            ...blob(
              "color-mix(in oklab, var(--tint-a) 60%, var(--tint-b))",
              { left: "10%", top: "34%" },
              "drift-b 37s ease-in-out infinite alternate-reverse",
            ),
            width: "30vmax",
            height: "30vmax",
          }}
        />
      </motion.div>

      {/* Aurore : un anneau conique très lent, pour que rien ne soit jamais figé. */}
      <div
        className="absolute top-1/2 left-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.22]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, color-mix(in oklab, var(--tint-a) 45%, transparent) 12%, transparent 30%, color-mix(in oklab, var(--tint-b) 40%, transparent) 55%, transparent 72%)",
          animation: "spin-slow 95s linear infinite",
          mixBlendMode: "var(--bg-blob-blend)" as CSSProperties["mixBlendMode"],
        }}
      />

      <div className="absolute inset-0" style={{ background: "var(--vignette)" }} />
      <div className="bg-grain" />
    </div>
  );
}

function blob(color: string, position: CSSProperties, animation: string): CSSProperties {
  return {
    ...position,
    "--blob": color,
    animation,
  } as CSSProperties;
}
