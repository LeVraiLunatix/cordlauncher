import { Trash2 } from "lucide-react";
import type { CatalogApp } from "../../lib/catalog/types";
import { GlassButton, GlassModal } from "../glass";
import { AppIcon } from "./AppIcon";

/** Confirmation avant de désinstaller (fiche et bibliothèque). */
export function UninstallConfirm({
  app,
  open,
  onCancel,
  onConfirm,
}: {
  app: CatalogApp;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <GlassModal open={open} onClose={onCancel} tint={app.iconGradient} width={420} hideClose labelledBy="uninstall-title">
      <div className="relative z-[3] flex flex-col items-center px-8 pt-8 pb-7 text-center">
        <AppIcon app={app} size={64} />
        <h2 id="uninstall-title" className="mt-5 font-display text-[20px] font-semibold tracking-tight">
          Désinstaller {app.name} ?
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
          L'app sera retirée de ce PC. Tu pourras la réinstaller à tout moment depuis CordLauncher.
        </p>
        <div className="mt-6 flex w-full gap-2.5">
          <GlassButton variant="glass" size="md" className="flex-1" onClick={onCancel}>
            Annuler
          </GlassButton>
          <GlassButton
            variant="primary"
            size="md"
            className="flex-1"
            tint={["#f0506e", "#d6336c"]}
            icon={<Trash2 className="size-4" />}
            onClick={onConfirm}
          >
            Désinstaller
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}
