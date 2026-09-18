import { Copy, Minus, Square, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { closeWindow, minimizeWindow, toggleMaximizeWindow, watchMaximized } from "../../lib/platform";

/**
 * Boutons de fenêtre (la barre Windows est désactivée : `decorations:false`).
 * Ordre et largeur façon Windows 11 — les réflexes de l'utilisateur restent
 * valables — mais habillés de verre : pastille au survol, rouge pour fermer.
 */
export function WindowControls() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    let cancelled = false;
    void watchMaximized(setMaximized).then((fn) => {
      if (cancelled) fn();
      else unlisten = fn;
    });
    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, []);

  return (
    <div className="flex items-center gap-1 pr-2">
      <ControlButton label="Réduire" onClick={() => void minimizeWindow()}>
        <Minus className="size-4" strokeWidth={1.6} />
      </ControlButton>
      <ControlButton label={maximized ? "Restaurer" : "Agrandir"} onClick={() => void toggleMaximizeWindow()}>
        {maximized ? (
          <Copy className="size-[13px] -scale-x-100" strokeWidth={1.6} />
        ) : (
          <Square className="size-[12px]" strokeWidth={1.7} />
        )}
      </ControlButton>
      <ControlButton label="Fermer" danger onClick={() => void closeWindow()}>
        <X className="size-4" strokeWidth={1.6} />
      </ControlButton>
    </div>
  );
}

function ControlButton({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "grid h-8 w-[42px] place-items-center rounded-[10px] text-fg-muted transition-colors duration-200",
        danger ? "hover:bg-[#e5484d] hover:text-white" : "hover:bg-[var(--control-hover)] hover:text-fg",
      )}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
    >
      {children}
    </motion.button>
  );
}
