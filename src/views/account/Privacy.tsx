import { AlertCircle, AppWindow, Check, Database, Download, FileJson, Fingerprint, History, Lock, MonitorSmartphone, ShieldCheck, Trash2, UserRound, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { GlassButton } from "../../components/glass";
import { clearCord, cordRequest, exportCord } from "../../lib/account";
import { openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { useAccount } from "./context";
import { Field, IconBadge, Panel } from "./kit";

export function Privacy() {
  const { d, openModal } = useAccount();
  const [exporting, setExporting] = useState(false);

  const items: [LucideIcon, string, string, string | number | null][] = [
    [UserRound, "Profil", `Nom, email${d.user.avatarUrl ? ", photo" : ""}, date d’inscription, préférences.`, null],
    [Lock, "Sécurité", `Mot de passe haché (scrypt)${d.security.mfa ? ", secret 2FA chiffré (AES-256-GCM), codes de secours hachés" : ""}. Jamais lisibles, même par nous.`, null],
    [Fingerprint, "Clés de connexion", "Clés publiques de tes passkeys et iPhone Passcord. Les clés privées restent sur tes appareils.", d.passkeys.length + d.passcord.length],
    [MonitorSmartphone, "Sessions", "Appareil (navigateur, système), IP et dates. Jetons stockés hachés, expirent après 7 jours.", d.sessions.length],
    [AppWindow, "Apps connectées", "Quelles apps tu as autorisées, quand, et avec quelles permissions.", d.apps.length],
    [History, "Journal d’activité", "Connexions et changements du compte, effacés automatiquement après 180 jours.", d.activity.length >= 40 ? "40+" : d.activity.length],
  ];
  const never = [
    "Ton mot de passe en clair — ni en base, ni dans les journaux.",
    "La clé privée de Passcord ou de tes passkeys.",
    "Le contenu de tes apps : fichiers Drivecord, coffre Passcord, podcasts Tunecord…",
    "De pisteur, de pub ou de cookie tiers.",
  ];

  const doExport = async () => {
    setExporting(true);
    try {
      const path = await exportCord();
      toast({ tone: "ok", title: "Export enregistré", description: path });
    } catch (e) {
      toast({ tone: "error", title: "Export impossible", description: (e as Error).message });
    } finally {
      setExporting(false);
    }
  };

  const deleteAccount = () => openModal({
    title: "Supprimer définitivement ton compte ?",
    desc: "Cette action ne peut pas être annulée.",
    icon: Trash2, tone: "danger", danger: true, submit: "Supprimer mon compte",
    body: <>
      <ul className="grid gap-2 text-[13.5px] text-fg-muted">
        {["Tu seras déconnecté de toutes les apps de la suite.", "Tes iPhone Passcord et passkeys ne fonctionneront plus.", "Les données propres à chaque app (fichiers Drivecord…) restent gérées par ces apps."].map(t => (
          <li key={t} className="flex gap-2.5"><AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />{t}</li>
        ))}
      </ul>
      <Field label="Pour confirmer, saisis ton adresse email"><input className="cord-input" name="email" type="email" required autoComplete="off" placeholder={d.user.email} /></Field>
    </>,
    onSubmit: async (f) => {
      if (String(f.get("email")).trim().toLowerCase() !== d.user.email.toLowerCase()) throw new Error("L’adresse ne correspond pas.");
      await cordRequest("/api/me", {}, "DELETE");
      clearCord();
      toast({ tone: "info", title: "Compte supprimé", description: "Merci d’avoir essayé Cord." });
    },
  });

  return (
    <>
      <Panel icon={Database} title="Ce que nous savons de toi">
        <div className="grid gap-3 md:grid-cols-2">
          {items.map(([icon, title, desc, count]) => (
            <div key={title} className="flex gap-3.5 rounded-[16px] bg-[var(--control)] p-4 ring-1 ring-inset ring-[var(--line)]">
              <IconBadge icon={icon} tone="muted" size="sm" />
              <div className="min-w-0 flex-1"><p className="text-[14px] font-semibold">{title}</p><p className="mt-0.5 text-[12.5px] leading-snug text-fg-muted">{desc}</p></div>
              {count !== null && <span className="font-display text-xl font-semibold text-fg-muted">{count}</span>}
            </div>
          ))}
        </div>
      </Panel>
      <Panel icon={ShieldCheck} tone="ok" title="Ce qu’on ne stocke jamais">
        <ul className="grid gap-2.5">{never.map(t => <li key={t} className="flex gap-3 text-[14px] text-fg-muted"><Check className="mt-0.5 size-4 shrink-0 text-ok" />{t}</li>)}</ul>
      </Panel>
      <Panel icon={FileJson} tone="info" title="Exporter mes données"
        desc="Un fichier JSON lisible avec tout ce qui précède, enregistré dans ton dossier Téléchargements. Les secrets n’y figurent pas : on ne les connaît pas en clair."
        actions={<GlassButton icon={<Download className="size-4" />} loading={exporting} onClick={() => void doExport()}>Télécharger (JSON)</GlassButton>} />
      <Panel icon={Trash2} tone="danger" title="Supprimer mon compte" className="ring-1 ring-danger/25"
        desc="Efface définitivement ton Compte Cord : profil, appareils, sessions, apps connectées et historique."
        actions={<GlassButton variant="danger" onClick={deleteAccount}>Supprimer mon compte…</GlassButton>}>
        <button type="button" className="text-[12px] text-fg-subtle underline" onClick={() => void openExternal("https://compte.cordsuite.app/#confidentialite")}>Voir aussi sur compte.cordsuite.app</button>
      </Panel>
    </>
  );
}
