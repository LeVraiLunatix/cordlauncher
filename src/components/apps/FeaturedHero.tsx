import { ChevronRight, Smartphone, Sparkles } from "lucide-react";
import { motion, useTransform } from "motion/react";
import { useAmbient } from "../../lib/ambient";
import type { CatalogApp } from "../../lib/catalog/types";
import { formatBytes, formatDate } from "../../lib/format";
import { useAppAction } from "../../lib/installer";
import { canInstallOnIphone, openIphoneInstall } from "../../lib/iphone";
import { itemVariants } from "../../lib/motion";
import { Badge, GlassButton, GlassCard } from "../glass";
import { AppActionButton, JobProgress } from "./AppAction";
import { AppIcon } from "./AppIcon";

/**
 * Bandeau « À la une ». À droite, une petite scène : deux vitres flottantes
 * et le logo, chacun sur son propre plan de parallaxe — celle de devant
 * passe PAR-DESSUS le logo et le floute, c'est ce qui vend l'épaisseur du
 * verre.
 */
export function FeaturedHero({ app, onOpen }: { app: CatalogApp; onOpen: (id: string) => void }) {
  const action = useAppAction(app);
  const [a, b] = app.iconGradient;

  const meta = [
    app.version && `v${app.version}`,
    app.downloadSize && formatBytes(app.downloadSize),
    app.releaseDate && `publiée le ${formatDate(app.releaseDate)}`,
    app.installer?.scope === "user" && "sans droits admin",
  ].filter(Boolean);

  return (
    <GlassCard
      variants={itemVariants}
      interactive
      tint={app.iconGradient}
      rimAngle={130}
      className="group relative grid min-h-[272px] grid-cols-[minmax(0,1fr)_320px] overflow-hidden rounded-[32px] [--sheen-size:720px] [--tint-mix:22%]"
    >
      {/* Lumière intérieure : ce que les vitres du décor viennent flouter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 right-6 size-[440px] rounded-full opacity-75 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${b}, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-52 -bottom-40 size-[360px] rounded-full opacity-60 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${a}, transparent)` }}
      />

      <div className="relative z-[3] flex min-w-0 flex-col p-8 pr-2">
        <div className="flex items-center gap-2">
          <Badge tone="tint" icon={<Sparkles className="size-3" />}>
            À la une
          </Badge>
        </div>
        <h2 className="mt-4 font-display text-[46px] leading-none font-semibold tracking-[-0.035em]">{app.name}</h2>
        {app.tagline && <p className="mt-2 text-tint text-[17px] font-semibold">{app.tagline}</p>}
        <p className="mt-3 max-w-[480px] clamp-2 text-[13.5px] leading-relaxed text-fg-muted">{app.description}</p>

        <div className="mt-auto flex min-h-[48px] items-center gap-3 pt-6">
          {action.kind === "busy" ? (
            <div className="w-full max-w-[380px]">
              <JobProgress app={app} job={action.job} />
            </div>
          ) : (
            <>
              <AppActionButton app={app} size="md" />
              {canInstallOnIphone(app.ios) && (
                <GlassButton
                  variant="glass"
                  size="md"
                  tint={app.iconGradient}
                  icon={<Smartphone className="size-4 transition-transform duration-300 group-hover:-rotate-12" />}
                  onClick={() => openIphoneInstall(app)}
                >
                  Sur iPhone
                </GlassButton>
              )}
              <GlassButton
                variant="ghost"
                size="md"
                onClick={() => onOpen(app.id)}
                trailingIcon={<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
              >
                Voir la fiche
              </GlassButton>
            </>
          )}
        </div>
        {meta.length > 0 && (
          <p className="mt-3 font-mono text-[11.5px] text-fg-subtle">{meta.join("  ·  ")}</p>
        )}
      </div>

      <HeroStage app={app} />
    </GlassCard>
  );
}

function HeroStage({ app }: { app: CatalogApp }) {
  const { pointerX, pointerY } = useAmbient();
  const backX = useTransform(pointerX, (v) => v * 9);
  const backY = useTransform(pointerY, (v) => v * 7);
  const iconX = useTransform(pointerX, (v) => v * 16);
  const iconY = useTransform(pointerY, (v) => v * 12);
  const frontX = useTransform(pointerX, (v) => v * 26);
  const frontY = useTransform(pointerY, (v) => v * 20);

  return (
    <div aria-hidden className="relative z-[3]">
      <motion.div
        className="glass glass-rim absolute top-9 right-[150px] size-[124px] rounded-[32px] [--rim-angle:200deg]"
        style={{ x: backX, y: backY, rotate: -14 }}
      />
      <motion.div className="absolute top-[58px] right-[84px]" style={{ x: iconX, y: iconY }}>
        <div className="animate-float">
          <AppIcon app={app} size={136} />
        </div>
      </motion.div>
      <motion.div
        className="glass glass-rim absolute top-[150px] right-[30px] size-[92px] rounded-[26px] [--glass-blur:10px] [--rim-angle:120deg]"
        style={{ x: frontX, y: frontY, rotate: 11 }}
      />
      <motion.div
        className="absolute top-[44px] right-[52px] size-2 rounded-full bg-white/80 shadow-[0_0_14px_4px_rgb(255_255_255/0.6)]"
        style={{ x: frontX, y: frontY }}
        animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
