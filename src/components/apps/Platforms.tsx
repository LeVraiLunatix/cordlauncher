import { Monitor, Smartphone } from "lucide-react";
import type { MouseEvent } from "react";
import type { CatalogApp } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { canInstallOnIphone, openIphoneInstall } from "../../lib/iphone";
import { GlassButton } from "../glass";

/** Pastilles « Windows · iPhone » : sur quoi l'app tourne. */
export function PlatformChips({ app, className }: { app: CatalogApp; className?: string }) {
  const chips: { key: string; label: string; icon: typeof Monitor }[] = [];
  if (app.installer || app.downloadUrl) chips.push({ key: "win", label: "Windows", icon: Monitor });
  if (app.ios) {
    chips.push({ key: "ios", label: app.ios.status === "closed-beta" ? "iPhone · bêta" : "iPhone", icon: Smartphone });
  }
  if (chips.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {chips.map(({ key, label, icon: Icon }) => (
        <span
          key={key}
          className="inline-flex h-5 items-center gap-1 rounded-full bg-[var(--control)] px-2 text-[10.5px] font-medium text-fg-subtle ring-1 ring-[var(--line)] ring-inset"
        >
          <Icon className="size-3" />
          {label}
        </span>
      ))}
    </div>
  );
}

/** Bouton rond « iPhone » posé à côté de l'action principale d'une carte. */
export function IphoneQuickButton({ app }: { app: CatalogApp }) {
  if (!canInstallOnIphone(app.ios)) return null;
  return (
    <GlassButton
      variant="glass"
      size="icon"
      className="size-8"
      tint={app.iconGradient}
      aria-label={`Installer ${app.name} sur iPhone`}
      title="Installer sur iPhone"
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        openIphoneInstall(app);
      }}
    >
      <Smartphone className="size-4 transition-transform duration-300 group-hover:-rotate-12" />
    </GlassButton>
  );
}
