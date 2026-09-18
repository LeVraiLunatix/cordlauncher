import type { Transition, Variants } from "motion/react";

/**
 * Vocabulaire de mouvement commun. Tout ressort de l'app vient d'ici pour
 * que l'ensemble « respire » au même rythme.
 */

export const springSoft: Transition = { type: "spring", stiffness: 210, damping: 28, mass: 0.9 };
export const springSnappy: Transition = { type: "spring", stiffness: 420, damping: 30 };
export const springBouncy: Transition = { type: "spring", stiffness: 320, damping: 18 };

export const easeGlass = [0.22, 1, 0.36, 1] as const;

/**
 * Conteneur de vue : il n'anime RIEN lui-même (une opacité ici casserait le
 * flou des cartes, cf. styles.css), il cadence seulement ses enfants.
 */
export const viewVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

/** Élément d'une vue : fondu + glissement vers le haut. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: springSoft },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.16, ease: easeGlass } },
};
