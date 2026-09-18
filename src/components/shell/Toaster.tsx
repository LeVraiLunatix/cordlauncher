import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { SUITE_TINT } from "../../lib/ambient";
import { cn } from "../../lib/cn";
import { dismissToast, useToasts, type ToastTone } from "../../lib/toast";
import { GlassCard } from "../glass";

const ICONS: Record<ToastTone, typeof Info> = {
  ok: CircleCheck,
  info: Info,
  error: CircleAlert,
};

/** Notifications en bas à droite : arrivent d'en bas, repartent vers la droite. */
export function Toaster() {
  const toasts = useToasts();
  return createPortal(
    <div className="pointer-events-none fixed right-5 bottom-5 z-[60] flex w-[340px] flex-col-reverse gap-2.5">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <GlassCard
              key={t.id}
              layout="position"
              strong
              tint={t.tint ?? SUITE_TINT}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-[20px] p-3.5 pr-3 [--tint-mix:22%]"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 340, damping: 26 } }}
              exit={{ opacity: 0, x: 60, transition: { duration: 0.22 } }}
            >
              <Icon
                className={cn(
                  "relative z-[3] mt-0.5 size-[18px] shrink-0",
                  t.tone === "ok" && "text-ok",
                  t.tone === "info" && "text-info",
                  t.tone === "error" && "text-danger",
                )}
              />
              <div className="relative z-[3] min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[12px] text-fg-muted">{t.description}</p>}
              </div>
              <button
                type="button"
                aria-label="Fermer la notification"
                onClick={() => dismissToast(t.id)}
                className="relative z-[3] grid size-6 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-[var(--control-hover)] hover:text-fg"
              >
                <X className="size-3.5" />
              </button>
            </GlassCard>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
