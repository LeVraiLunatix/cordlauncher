import { ArrowUpRight, Check, CircleCheck, Globe, LockKeyhole, Smartphone, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAmbient } from "../../lib/ambient";
import type { CatalogApp } from "../../lib/catalog/types";
import { formatBytes, formatDate } from "../../lib/format";
import { uninstallApp, useAppAction, useInstalled } from "../../lib/installer";
import { canInstallOnIphone, openIphoneInstall } from "../../lib/iphone";
import { openExternal } from "../../lib/platform";
import { GlassButton, GlassModal } from "../glass";
import { AppActionButton, JobProgress } from "./AppAction";
import { AppIcon } from "./AppIcon";
import { StatusBadge } from "./StatusBadge";

type AppDetailProps = {
  app: CatalogApp | null;
  onClose: () => void;
};

/**
 * Fiche d'une app, en modale. À l'ouverture, le logo s'envole de la carte
 * jusqu'à l'en-tête (même `layoutId`) et tout le fond de l'app glisse vers
 * les couleurs de l'app.
 */
export function AppDetail({ app, onClose }: AppDetailProps) {
  const { setTint } = useAmbient();
  // Garde la dernière app affichée pendant l'animation de sortie.
  const last = useRef<CatalogApp | null>(app);
  if (app) last.current = app;
  const shown = app ?? last.current;

  useEffect(() => {
    setTint(app ? app.iconGradient : null);
  }, [app, setTint]);

  return (
    <GlassModal open={!!app} onClose={onClose} tint={shown?.iconGradient} labelledBy="app-detail-title" width={880}>
      {shown && <DetailBody app={shown} />}
    </GlassModal>
  );
}

function DetailBody({ app }: { app: CatalogApp }) {
  const action = useAppAction(app);
  const installed = useInstalled(app.id);
  const [confirmUninstall, setConfirmUninstall] = useState(false);
  const [a, b] = app.iconGradient;

  return (
    <>
      <header className="relative z-[3] flex items-start gap-6 px-9 pt-9 pb-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-24 size-[420px] rounded-full opacity-50 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${a}, transparent)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-10 size-[300px] rounded-full opacity-35 blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${b}, transparent)` }}
        />
        <AppIcon app={app} size={100} layoutId={`icon-${app.id}`} className="relative" />
        <div className="relative min-w-0 flex-1 pt-1 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge app={app} />
            {app.version && (
              <span className="font-mono text-[11.5px] text-fg-subtle">
                v{app.version}
                {app.releaseDate && ` · ${formatDate(app.releaseDate)}`}
              </span>
            )}
          </div>
          <h2 id="app-detail-title" className="mt-3 font-display text-[36px] leading-none font-semibold tracking-[-0.03em]">
            {app.name}
          </h2>
          {app.tagline && <p className="mt-2 text-tint text-[15.5px] font-semibold">{app.tagline}</p>}

          <div className="mt-5 flex min-h-10 flex-wrap items-center gap-2.5">
            {action.kind === "busy" ? (
              <div className="w-full max-w-[400px]">
                <JobProgress app={app} job={action.job} />
              </div>
            ) : (
              <>
                <AppActionButton app={app} size="md" />
                {canInstallOnIphone(app.ios) && (
                  <GlassButton
                    variant="glass"
                    size="md"
                    icon={<Smartphone className="size-4 transition-transform duration-300 group-hover:-rotate-12" />}
                    onClick={() => openIphoneInstall(app)}
                  >
                    Sur iPhone
                  </GlassButton>
                )}
                {app.website && app.status !== "closed-beta" && (
                  <GlassButton
                    variant="glass"
                    size="md"
                    icon={<Globe className="size-4" />}
                    onClick={() => void openExternal(app.website!)}
                  >
                    Site web
                  </GlassButton>
                )}
                {installed && (
                  <GlassButton
                    variant="danger"
                    size="md"
                    icon={<Trash2 className="size-4" />}
                    onClick={() => setConfirmUninstall(true)}
                  >
                    Désinstaller
                  </GlassButton>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-[3] mx-9 h-px bg-[var(--line)]" />

      <div className="scroll-glass relative z-[3] min-h-0 flex-1 space-y-9 overflow-y-auto px-9 pt-7 pb-9">
        {app.screenshots && app.screenshots.length > 0 && <Screenshots app={app} />}

        <Section title="À propos">
          <p className="max-w-[68ch] text-[14px] leading-[1.7] text-fg-muted" data-selectable>
            {app.longDescription ?? app.description}
          </p>
        </Section>

        {app.ios && <IphoneSection app={app} />}

        {app.highlights && app.highlights.length > 0 && (
          <Section title={app.status === "available" ? "Points forts" : "Au programme"}>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {app.highlights.map((h, i) => (
                <motion.li
                  key={h}
                  className="flex gap-3 rounded-2xl bg-[var(--control)] p-3.5 text-[13px] leading-relaxed text-fg-muted ring-1 ring-[var(--line)] ring-inset"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, type: "spring", stiffness: 260, damping: 26 }}
                >
                  <span className="tint-fill mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {h}
                </motion.li>
              ))}
            </ul>
          </Section>
        )}

        {app.changelog && app.changelog.length > 0 && (
          <Section title="Nouveautés">
            <ol className="relative space-y-6 border-l border-[var(--line)] pl-6">
              {app.changelog.map((entry, i) => (
                <li key={entry.version} className="relative">
                  <span
                    aria-hidden
                    className={
                      i === 0
                        ? "tint-fill absolute top-1 -left-[31px] size-3.5 rounded-full ring-4 ring-[var(--glass-fill-strong)]"
                        : "absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-[var(--fg-subtle)] ring-4 ring-[var(--glass-fill-strong)]"
                    }
                  />
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-display text-[15px] font-semibold">Version {entry.version}</span>
                    {i === 0 && <span className="text-tint text-[11.5px] font-semibold">Dernière</span>}
                    {entry.date && <span className="font-mono text-[11.5px] text-fg-subtle">{formatDate(entry.date)}</span>}
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {entry.notes.map((n) => (
                      <li key={n} className="flex gap-2.5 text-[13px] leading-relaxed text-fg-muted" data-selectable>
                        <CircleCheck className="mt-[3px] size-3.5 shrink-0 text-fg-subtle" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Section>
        )}

        <Section title="Informations">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--line)] ring-1 ring-[var(--line)] sm:grid-cols-3">
            <Info label="Éditeur" value="Cordsuite" />
            <Info label="Version" value={app.version ? `v${app.version}` : "—"} mono />
            <Info label="Taille" value={app.downloadSize ? formatBytes(app.downloadSize) : "—"} mono />
            <Info
              label="Compatibilité"
              value={
                app.requirements ??
                (app.ios?.minOS ? `iPhone, iOS ${app.ios.minOS.replace(/\.0$/, "")} ou plus` : "—")
              }
            />
            <Info
              label="Installation"
              value={
                app.installer
                  ? app.installer.scope === "user"
                    ? "Profil utilisateur, sans droits admin"
                    : "Tous les utilisateurs (admin requis)"
                  : app.eta
                    ? `Sortie visée : ${app.eta}`
                    : "—"
              }
            />
            <Info
              label="Site web"
              value={
                app.website ? (
                  <button
                    type="button"
                    className="group/link inline-flex items-center gap-1 text-left text-fg underline-offset-4 hover:underline"
                    onClick={() => void openExternal(app.website!)}
                  >
                    {new URL(app.website).host}
                    <ArrowUpRight className="size-3.5 text-fg-subtle transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </button>
                ) : (
                  "—"
                )
              }
            />
          </dl>
          {installed?.location && (
            <p className="mt-3 font-mono text-[11.5px] text-fg-subtle" data-selectable>
              Installée dans {installed.location}
            </p>
          )}
        </Section>
      </div>

      <UninstallConfirm
        app={app}
        open={confirmUninstall}
        onCancel={() => setConfirmUninstall(false)}
        onConfirm={() => {
          setConfirmUninstall(false);
          void uninstallApp(app);
        }}
      />
    </>
  );
}

function IphoneSection({ app }: { app: CatalogApp }) {
  const ios = app.ios!;
  const installable = canInstallOnIphone(ios);
  const meta = [
    ios.version && `v${ios.version}`,
    ios.ipaSize && formatBytes(ios.ipaSize),
    ios.minOS && `iOS ${ios.minOS.replace(/.0$/, "")} ou plus`,
    installable && "via AltStore",
  ].filter(Boolean);
  return (
    <Section title="Sur iPhone">
      <div className="flex items-center gap-4 rounded-2xl bg-[var(--control)] p-4 ring-1 ring-[var(--line)] ring-inset">
        <span className="tint-fill grid size-11 shrink-0 place-items-center rounded-[14px] text-white">
          <Smartphone className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">
            {installable ? `${app.name} pour iPhone` : `${app.name} pour iPhone — bêta fermée`}
          </p>
          {meta.length > 0 && <p className="mt-0.5 font-mono text-[11.5px] text-fg-subtle">{meta.join("  ·  ")}</p>}
        </div>
        {installable ? (
          <GlassButton
            variant="primary"
            tint={app.iconGradient}
            icon={<Smartphone className="size-4" />}
            onClick={() => openIphoneInstall(app)}
          >
            Installer sur iPhone
          </GlassButton>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-fg-subtle">
            <LockKeyhole className="size-3.5" /> Sur invitation
          </span>
        )}
      </div>
    </Section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3.5 text-[11.5px] font-semibold tracking-[0.12em] text-fg-subtle uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Info({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="bg-[var(--glass-fill-strong)] px-4 py-3.5">
      <dt className="text-[11.5px] text-fg-subtle">{label}</dt>
      <dd className={mono ? "mt-1 font-mono text-[13px] text-fg" : "mt-1 text-[13px] text-fg"}>{value}</dd>
    </div>
  );
}

function Screenshots({ app }: { app: CatalogApp }) {
  return (
    <div className="-mx-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-9 pb-2 scroll-glass">
      {app.screenshots!.map((s, i) => (
        <motion.figure
          key={s.src}
          className="glass glass-rim relative w-[440px] shrink-0 snap-start overflow-hidden rounded-[20px] p-1.5"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 240, damping: 26 }}
          whileHover={{ y: -3 }}
        >
          <img src={s.src} alt={s.caption ?? ""} className="aspect-[16/10] w-full rounded-[15px] object-cover" draggable={false} />
          {s.caption && <figcaption className="px-2 pt-2 pb-1 text-[12px] text-fg-muted">{s.caption}</figcaption>}
        </motion.figure>
      ))}
    </div>
  );
}

function UninstallConfirm({
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
