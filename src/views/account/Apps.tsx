import { AppWindow, AtSign, BadgeCheck, Ban, ExternalLink, IdCard, KeyRound, Smartphone, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { GlassButton, GlassCard } from "../../components/glass";
import { cordAsset, cordRequest, useCordAccount } from "../../lib/account";
import { hasBeta, openBetaSheet } from "../../lib/beta";
import type { CatalogApp } from "../../lib/catalog/types";
import { cn } from "../../lib/cn";
import { openIphoneInstall } from "../../lib/iphone";
import { itemVariants } from "../../lib/motion";
import { openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useAccount } from "./context";
import { dateShort, Empty, ListRow, Panel, Pill, relative } from "./kit";

const SCOPES: Record<string, { label: string; icon: typeof IdCard }> = {
  openid: { label: "Identifiant Cord", icon: IdCard },
  profile: { label: "Nom et photo", icon: UserRound },
  email: { label: "Adresse email", icon: AtSign },
};
const STATUS = { live: ["ok", "En ligne"], beta: ["warn", "En développement"], soon: ["muted", "Bientôt"] } as const;

export function Apps() {
  const { d, reload, openModal } = useAccount();
  const { suite } = useCordAccount();

  const revoke = (id: string, name: string) => openModal({
    title: `Révoquer l’accès de ${name} ?`,
    desc: `${name} ne pourra plus lire ton profil Cord et te redemandera l’autorisation à la prochaine connexion. Tes données dans ${name} ne sont pas supprimées.`,
    icon: Ban, tone: "danger", danger: true, submit: "Révoquer l’accès",
    onSubmit: async () => {
      await cordRequest("/api/connected-apps", { clientId: id }, "DELETE");
      toast({ tone: "info", title: `Accès de ${name} révoqué` });
      await reload();
    },
  });

  return (
    <>
      <Panel icon={AppWindow} title="Apps connectées" desc="Les apps auxquelles tu t’es connecté avec ton compte Cord, et ce qu’elles peuvent voir.">
        {d.apps.length
          ? <div className="grid gap-1">{d.apps.map(app => (
              <ListRow key={app.id}
                lead={app.logo ? <img src={cordAsset(app.logo) ?? undefined} alt="" className="size-11 rounded-[12px]" /> : <span className="tint-fill grid size-11 place-items-center rounded-[12px] font-display text-lg font-semibold text-white">{app.name[0]}</span>}
                title={<>{app.name}{app.firstParty && <Pill tone="tint"><BadgeCheck className="size-3" />Cord</Pill>}</>}
                meta={<>
                  <span>Autorisée le {dateShort(app.grantedAt)}</span><span>Dernière connexion {relative(app.lastUsedAt)}</span>
                  <span className="mt-1.5 flex w-full flex-wrap gap-1.5">{app.scope.split(" ").map(s => SCOPES[s] && (
                    <span key={s} className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[var(--control)] px-2.5 text-[11.5px] text-fg-muted ring-1 ring-inset ring-[var(--line)]">{(() => { const I = SCOPES[s].icon; return <I className="size-3" />; })()}{SCOPES[s].label}</span>
                  ))}</span>
                </>}
                actions={<>
                  {app.url && <GlassButton size="sm" variant="ghost" trailingIcon={<ExternalLink className="size-3" />} onClick={() => void openExternal(app.url!)}>Ouvrir</GlassButton>}
                  <GlassButton size="sm" variant="danger" onClick={() => revoke(app.id, app.name)}>Révoquer</GlassButton>
                </>} />
            ))}</div>
          : <Empty icon={AppWindow} title="Aucune app connectée" desc="Sur Drivecord et les autres apps de la suite, choisis « Continuer avec Cord » : elles apparaîtront ici."
              action={<GlassButton size="sm" variant="primary" trailingIcon={<ExternalLink className="size-3" />} onClick={() => void openExternal("https://drivecord.app")}>Essayer Drivecord</GlassButton>} />}
      </Panel>

      <Panel
        title={<span className="flex items-center gap-2">Bêta fermée de Passcord{hasBeta(d.user, "passcord") && <Pill tone="ok"><BadgeCheck className="size-3" />{d.user.admin ? "Admin" : "Testeur"}</Pill>}</span>}
        desc={hasBeta(d.user, "passcord")
          ? "Tu as accès au dernier build : installe-le sur ton iPhone depuis ce PC, sans fichier à récupérer."
          : "Tu as reçu une clé d’accès ? Utilise-la pour rejoindre les premiers testeurs."}
        actions={hasBeta(d.user, "passcord")
          // La fenêtre iPhone n'a besoin que de l'identifiant de l'app.
          ? <GlassButton size="sm" variant="primary" icon={<Smartphone className="size-3.5" />} onClick={() => openIphoneInstall({ id: "passcord" } as CatalogApp)}>Installer sur iPhone</GlassButton>
          : <GlassButton size="sm" variant="primary" icon={<KeyRound className="size-3.5" />} onClick={() => openBetaSheet("passcord")}>J’ai une clé</GlassButton>}
      />

      <p className="px-1 pt-2 text-[11px] font-semibold tracking-[0.14em] text-fg-subtle uppercase">La suite Cord</p>
      <motion.div variants={itemVariants} className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {suite.map(app => {
          const [tone, label] = STATUS[app.status];
          const live = app.status === "live" && app.url;
          return (
            <GlassCard key={app.slug} interactive={Boolean(live)} tint={app.accent} className={cn("rounded-[22px] p-4", live && "cursor-pointer")}
              onClick={live ? () => void openExternal(app.url!) : undefined}>
              <div className="relative z-[3] grid gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={cordAsset(app.logo) ?? undefined} alt="" className={cn("size-11 shrink-0 rounded-[12px]", app.status === "soon" && "opacity-75 saturate-50")} />
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold">{app.name}</p>
                    <p className="truncate text-[12.5px] text-fg-subtle">{app.tagline}</p>
                  </div>
                </div>
                <p className="text-[13px] leading-snug text-fg-muted">{app.description}</p>
                {/* Sous la description : à côté du logo, « En développement » débordait des tuiles étroites. */}
                <div><Pill tone={tone}>{label}</Pill></div>
              </div>
            </GlassCard>
          );
        })}
      </motion.div>
    </>
  );
}
