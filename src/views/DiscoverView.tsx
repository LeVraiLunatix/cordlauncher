import { SearchX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AppCard, AppCardSkeleton } from "../components/apps/AppCard";
import { FeaturedHero } from "../components/apps/FeaturedHero";
import { GlassButton, GlassCard } from "../components/glass";
import type { CatalogState } from "../lib/catalog/load";
import type { CatalogApp } from "../lib/catalog/types";
import { itemVariants, viewVariants } from "../lib/motion";

type DiscoverViewProps = {
  catalog: CatalogState;
  query: string;
  onClearQuery: () => void;
  onOpen: (id: string) => void;
  onRetry: () => void;
};

const GRID = "grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(248px,1fr))]";

function matches(app: CatalogApp, q: string): boolean {
  const hay = `${app.name} ${app.tagline ?? ""} ${app.description}`.toLocaleLowerCase("fr");
  return hay.includes(q.toLocaleLowerCase("fr").trim());
}

export function DiscoverView({ catalog, query, onClearQuery, onOpen, onRetry }: DiscoverViewProps) {
  const apps = catalog.status === "ready" ? catalog.catalog.apps : [];
  const searching = query.trim().length > 0;
  const results = searching ? apps.filter((a) => matches(a, query)) : apps;
  const featured =
    catalog.status === "ready" ? apps.find((a) => a.id === catalog.catalog.featured) : undefined;

  const active = results.filter((a) => a.status !== "coming-soon");
  const soon = results.filter((a) => a.status === "coming-soon");
  const counts = {
    available: apps.filter((a) => a.status === "available").length,
    beta: apps.filter((a) => a.status === "closed-beta").length,
    soon: apps.filter((a) => a.status === "coming-soon").length,
  };

  return (
    <motion.div
      variants={viewVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="mx-auto flex w-full max-w-[1140px] flex-col gap-7 px-8 pt-4 pb-14"
    >
      <header className="flex items-end justify-between gap-6">
        {/* Pas de fondu sur <header> : il contient des vitres (les compteurs). */}
        <motion.div variants={itemVariants}>
          <p className="text-[11.5px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">
            {searching ? "Recherche" : "Découvrir"}
          </p>
          <h1 className="mt-1.5 font-display text-[32px] leading-tight font-semibold tracking-[-0.03em]">
            {searching ? (
              <>
                Résultats pour <span className="text-tint">« {query.trim()} »</span>
              </>
            ) : (
              <>
                La suite Cord, <span className="text-tint">sur ton PC</span>
              </>
            )}
          </h1>
          {!searching && (
            <p className="mt-1.5 text-[14px] text-fg-muted">
              Installe et mets à jour les apps de la suite en un clic, sans droits administrateur.
            </p>
          )}
        </motion.div>
        {catalog.status === "ready" && !searching && (
          <div className="flex shrink-0 gap-2">
            <Stat value={counts.available} label="disponible" plural="disponibles" tone="text-ok" />
            <Stat value={counts.beta} label="en bêta" plural="en bêta" tone="text-info" />
            <Stat value={counts.soon} label="à venir" plural="à venir" tone="text-fg" />
          </div>
        )}
      </header>

      {catalog.status === "error" && (
        <GlassCard variants={itemVariants} className="flex items-center justify-between gap-6 rounded-[24px] p-6">
          <div className="relative z-[3]">
            <p className="font-display text-[17px] font-semibold">Catalogue indisponible</p>
            <p className="mt-1 text-[13px] text-fg-muted">{catalog.error} Vérifie ta connexion puis réessaie.</p>
          </div>
          <GlassButton variant="primary" onClick={onRetry}>
            Réessayer
          </GlassButton>
        </GlassCard>
      )}

      {!searching && featured && <FeaturedHero app={featured} onOpen={onOpen} />}

      {catalog.status === "loading" && (
        <section className={GRID}>
          {Array.from({ length: 6 }, (_, i) => (
            <AppCardSkeleton key={i} />
          ))}
        </section>
      )}

      {active.length > 0 && (
        <section>
          <SectionTitle title="Apps de la suite" count={active.length} />
          <div className={GRID}>
            <AnimatePresence mode="popLayout">
              {active.map((app) => (
                <AppCard key={app.id} app={app} onOpen={onOpen} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {soon.length > 0 && (
        <section>
          <SectionTitle title="Bientôt dans la suite" count={soon.length} />
          <div className={GRID}>
            <AnimatePresence mode="popLayout">
              {soon.map((app) => (
                <AppCard key={app.id} app={app} onOpen={onOpen} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {searching && results.length === 0 && catalog.status === "ready" && (
        <GlassCard
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center rounded-[28px] px-8 py-14 text-center"
        >
          <div className="relative z-[3] grid size-14 place-items-center rounded-2xl bg-[var(--control)] text-fg-muted">
            <SearchX className="size-6" />
          </div>
          <p className="relative z-[3] mt-4 font-display text-[18px] font-semibold">Aucune app ne correspond</p>
          <p className="relative z-[3] mt-1 text-[13px] text-fg-muted">
            Essaie un autre mot : « stockage », « mots de passe », « podcast »…
          </p>
          <GlassButton variant="glass" className="relative z-[3] mt-5" onClick={onClearQuery}>
            Effacer la recherche
          </GlassButton>
        </GlassCard>
      )}
    </motion.div>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <motion.h2
      variants={itemVariants}
      className="mb-3.5 flex items-center gap-2.5 px-1 font-display text-[15px] font-semibold tracking-[-0.01em]"
    >
      {title}
      <span className="rounded-full bg-[var(--control)] px-2 py-0.5 font-mono text-[11px] font-medium text-fg-subtle ring-1 ring-[var(--line)] ring-inset">
        {count}
      </span>
    </motion.h2>
  );
}

function Stat({ value, label, plural, tone }: { value: number; label: string; plural: string; tone: string }) {
  return (
    <motion.div variants={itemVariants} className="glass glass-rim rounded-[18px] px-4 py-2.5 text-right [--glass-blur:18px]">
      <div className={`relative z-[3] font-display text-[22px] leading-none font-semibold ${tone}`}>{value}</div>
      <div className="relative z-[3] mt-1 text-[11.5px] text-fg-subtle">{value > 1 ? plural : label}</div>
    </motion.div>
  );
}
