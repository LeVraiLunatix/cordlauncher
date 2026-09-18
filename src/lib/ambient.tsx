import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import type { Gradient } from "./catalog/types";

/**
 * « Ambiance » partagée : ce qui relie le fond animé au reste de l'interface.
 *
 *  - `tint` : les deux teintes qui colorent le fond. Celles de la suite par
 *    défaut ; celles d'une app quand sa fiche est ouverte.
 *  - `pointerX/Y` : position du curseur dans la fenêtre (-1 → 1), amortie par
 *    un ressort — pilote la parallaxe des couches.
 *  - `scrollY` : défilement de la zone principale — le fond glisse moins vite
 *    que le contenu, d'où l'impression de profondeur.
 */

export const SUITE_TINT: Gradient = ["#6E58F0", "#B842EC"];

type Ambient = {
  tint: Gradient;
  setTint: (tint: Gradient | null) => void;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollY: MotionValue<number>;
};

const AmbientContext = createContext<Ambient | null>(null);

export function AmbientProvider({ children }: { children: ReactNode }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 45, damping: 18, mass: 0.8 };
  const pointerX = useSpring(rawX, spring);
  const pointerY = useSpring(rawY, spring);
  const scrollY = useMotionValue(0);
  const [tint, setTintState] = useState<Gradient>(SUITE_TINT);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [rawX, rawY]);

  const setTint = useCallback((t: Gradient | null) => setTintState(t ?? SUITE_TINT), []);

  const value = useMemo(
    () => ({ tint, setTint, pointerX, pointerY, scrollY }),
    [tint, setTint, pointerX, pointerY, scrollY],
  );
  return <AmbientContext.Provider value={value}>{children}</AmbientContext.Provider>;
}

export function useAmbient(): Ambient {
  const ctx = useContext(AmbientContext);
  if (!ctx) throw new Error("useAmbient() hors de <AmbientProvider>");
  return ctx;
}
