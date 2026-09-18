import { motion } from "motion/react";
import { useEffect } from "react";

const SPLASH_MS = 1350;

/**
 * Ouverture : le logo de la suite naît au centre (flou → net, petit → plein),
 * puis s'envole se loger dans la barre de titre (layoutId « brand-logo »)
 * pendant que les panneaux de verre arrivent en cascade.
 */
export function SplashIntro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, SPLASH_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-40 grid place-items-center"
      exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <motion.div
            aria-hidden
            className="absolute -inset-16 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgb(139 92 255 / 0.55), transparent)" }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0.7], scale: [0.3, 1.25, 1.1] }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute -inset-3 rounded-[34px] ring-1 ring-white/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.35, 1.6] }}
            transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
          />
          <motion.img
            layoutId="brand-logo"
            src="/logos/cordsuite.png"
            alt=""
            draggable={false}
            className="relative size-[104px] rounded-[26px] shadow-[0_20px_60px_-10px_rgb(110_88_240/0.8)]"
            initial={{ opacity: 0, scale: 0.55, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 170, damping: 16 }}
          />
        </div>
        <motion.h1
          className="mt-8 font-display text-[26px] font-semibold tracking-[-0.02em]"
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.28, type: "spring", stiffness: 200, damping: 24 }}
        >
          CordLauncher
        </motion.h1>
        <motion.p
          className="mt-1 text-[13.5px] text-fg-muted"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 24 }}
        >
          La suite Cord, sur ton PC
        </motion.p>
        <motion.div
          className="glass-inset mt-7 h-1 w-32 overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="tint-fill h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
