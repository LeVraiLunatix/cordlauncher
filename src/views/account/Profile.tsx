import { AtSign, BadgeCheck, Camera, Copy, IdCard, Send, Trash2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { GlassButton } from "../../components/glass";
import { cordRequest } from "../../lib/account";
import { toast } from "../../lib/toast";
import { useAccount } from "./context";
import { Avatar, dateLong, Field, Panel, PasswordInput } from "./kit";

/** Recadre en carré 256 px et compresse (WebP, sinon JPEG) sous ~120 Ko. */
async function prepareAvatar(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Image illisible. Essaie un PNG ou un JPEG.");
  const canvas = Object.assign(document.createElement("canvas"), { width: 256, height: 256 });
  const ctx = canvas.getContext("2d")!;
  const side = Math.min(bitmap.width, bitmap.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256);
  for (const [type, quality] of [["image/webp", 0.86], ["image/jpeg", 0.86], ["image/jpeg", 0.7], ["image/jpeg", 0.5]] as const) {
    const url = canvas.toDataURL(type, quality);
    if (url.startsWith(`data:${type}`) && url.length < 170_000) return url;
  }
  throw new Error("Image trop lourde, même compressée.");
}

export function Profile() {
  const { d, reload, openModal } = useAccount();
  const u = d.user;
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, action: () => Promise<void>) => {
    setBusy(key);
    try { await action(); } catch (e) { toast({ tone: "error", title: "Action impossible", description: (e as Error).message }); } finally { setBusy(null); }
  };
  const upload = (file: File | undefined) => file && run("avatar", async () => {
    await cordRequest("/api/me", { avatar: await prepareAvatar(file) }, "PATCH");
    toast({ tone: "ok", title: "Photo mise à jour" });
    await reload();
  });
  const saveName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name")).trim();
    void run("name", async () => { await cordRequest("/api/me", { name }, "PATCH"); toast({ tone: "ok", title: "Nom enregistré" }); await reload(); });
  };
  const changeEmail = () => openModal({
    title: "Changer d’adresse email",
    desc: "On envoie un lien de confirmation à la nouvelle adresse. L’ancienne reste active tant que tu n’as pas cliqué.",
    icon: AtSign, submit: "Envoyer le lien",
    body: <>
      <Field label="Nouvelle adresse"><input className="cord-input" type="email" name="email" required maxLength={254} autoComplete="email" autoFocus /></Field>
      <Field label="Mot de passe actuel"><PasswordInput name="password" /></Field>
    </>,
    onSubmit: async (f) => {
      const email = String(f.get("email")).trim();
      const r = await cordRequest<{ devUrl?: string }>("/api/email/change", { email, password: f.get("password") });
      toast({ tone: "ok", title: "Lien envoyé", description: r.devUrl ?? `Clique sur le lien reçu à ${email} pour finaliser le changement.` });
    },
  });

  return (
    <>
      <Panel>
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative">
            <Avatar user={u} size={112} ring />
            <GlassButton size="icon" variant="primary" aria-label="Changer la photo" loading={busy === "avatar"} className="absolute right-0 bottom-0 shadow-[0_0_0_4px_var(--bg)]" onClick={() => fileRef.current?.click()}><Camera className="size-4" /></GlassButton>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
          <div className="min-w-[200px] flex-1">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">{u.name}</h2>
            <p className="text-fg-muted">{u.email}</p>
            {u.avatarUrl && <GlassButton size="sm" variant="ghost" className="mt-2" icon={<Trash2 className="size-3.5" />} loading={busy === "remove"}
              onClick={() => void run("remove", async () => { await cordRequest("/api/me", { avatar: null }, "PATCH"); toast({ tone: "info", title: "Photo retirée" }); await reload(); })}>Retirer la photo</GlassButton>}
            <p className="mt-2 text-[12px] text-fg-subtle">Recadrée en carré, 256 × 256. Sans photo, un avatar est généré à partir de ton identifiant.</p>
          </div>
        </div>
      </Panel>

      <Panel icon={IdCard} title="Identité" desc="Ce que les apps de la suite voient de toi quand tu te connectes avec Cord.">
        <div className="grid gap-5">
          <form onSubmit={saveName}>
            <Field label="Nom affiché">
              <div className="flex gap-2"><input className="cord-input" name="name" defaultValue={u.name} key={u.name} required maxLength={60} autoComplete="nickname" /><GlassButton type="submit" loading={busy === "name"}>Enregistrer</GlassButton></div>
            </Field>
          </form>
          <Field label="Adresse email" hint={u.emailVerified ? <span className="inline-flex items-center gap-1 text-ok"><BadgeCheck className="size-3.5" />Email vérifié</span> : "Pas encore confirmée : utilise la bannière en haut de page."}>
            <div className="flex gap-2"><input className="cord-input" value={u.email} readOnly aria-label="Adresse email" /><GlassButton icon={<Send className="size-3.5" />} onClick={changeEmail}>Modifier</GlassButton></div>
          </Field>
          <Field label="Identifiant Cord" hint="Ton identifiant permanent : c’est lui que voient les apps connectées, jamais ton mot de passe.">
            <div className="flex items-center gap-2 rounded-[12px] bg-[var(--control)] px-3 py-2 ring-1 ring-inset ring-[var(--line)]">
              <code className="flex-1 truncate font-mono text-[12.5px]">{u.id}</code>
              <GlassButton size="icon-sm" variant="ghost" aria-label="Copier l’identifiant" onClick={() => void navigator.clipboard.writeText(u.id).then(() => toast({ tone: "ok", title: "Identifiant copié" }))}><Copy className="size-3.5" /></GlassButton>
            </div>
          </Field>
          <p className="text-[13.5px] text-fg-muted">Membre depuis le <strong className="text-fg">{dateLong(u.createdAt)}</strong></p>
        </div>
      </Panel>
    </>
  );
}
