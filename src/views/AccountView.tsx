import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GlassButton, GlassCard } from "../components/glass";
import { QrCode } from "../components/apps/QrCode";
import { clearCord, cordRequest, refreshCord, setCordServer, useCordAccount, type CordChallenge } from "../lib/account";
import { IS_TAURI, openExternal } from "../lib/platform";
import { itemVariants, viewVariants } from "../lib/motion";

export function AccountView() {
  const account = useCordAccount();
  const [server, setServer] = useState(account.server);
  const [register, setRegister] = useState(false);
  const [name, setName] = useState(account.user?.name ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [needsOtp, setNeedsOtp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<CordChallenge | null>(null);
  async function run(action: () => Promise<void>) {
    setError(null); setNotice(null); setBusy(true);
    try { await action(); } catch (e) {
      // Le proxy Rust préfixe la raison du serveur : « [mfa_required] message ».
      const [, reason, message] = String(e).match(/^\[(\w+)\] ([\s\S]*)$/) ?? [];
      if (reason === "mfa_required" || reason === "mfa_invalid") setNeedsOtp(true);
      setError(message ?? String(e));
    } finally { setBusy(false); }
  }
  useEffect(() => {
    if (IS_TAURI && account.server) void refreshCord().catch(e => setError(String(e)));
  }, [account.server]);
  useEffect(() => { if (account.user) setName(account.user.name); }, [account.user]);
  useEffect(() => {
    if (!challenge) return;
    let active = true; let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      if (!active) return;
      if (Date.now() >= challenge!.expiresAt) { setChallenge(null); setError("La demande Passcord a expiré. Tu peux recommencer."); return; }
      try {
        if (challenge!.pollToken) {
          const response = await cordRequest<{ pending?: boolean }>("/api/passcord/poll", { id: challenge!.id, pollToken: challenge!.pollToken });
          if (!active) return;
          if (!response.pending) { setChallenge(null); await refreshCord(); return; }
        }
        if (active) timer = setTimeout(poll, 2500);
      } catch (e) { if (active) { setChallenge(null); setError(String(e)); } }
    }
    timer = setTimeout(poll, 2500);
    return () => { active = false; clearTimeout(timer); };
  }, [challenge]);
  return <motion.div variants={viewVariants} initial="hidden" animate="show" exit="exit" className="mx-auto flex max-w-[860px] flex-col gap-6 px-8 pt-4 pb-14">
    <motion.header variants={itemVariants}><p className="text-xs tracking-widest text-fg-subtle uppercase">Un compte, toute la suite</p><h1 className="mt-2 font-display text-[32px] font-semibold tracking-tight">Ton espace Cord.</h1><p className="mt-2 text-sm text-fg-muted">Ton identité commune. Et avec Passcord, ton iPhone devient ta clé.</p></motion.header>
    <GlassCard variants={itemVariants} className="rounded-[26px] p-6"><div className="relative z-[3] space-y-4">
      {!account.user ? <>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); const secret = password; const code = otp.trim(); setOtp(""); setChallenge(null); void run(async () => { await cordRequest(register ? "/api/register" : "/api/login", { email, password: secret, name, ...(code && !register ? { otp: code } : {}) }); setPassword(""); setNeedsOtp(false); await refreshCord(); }); }}>
          <h2 className="font-display text-xl font-semibold">{register ? "Créer ton compte Cord" : "Bienvenue chez toi"}</h2>
          {register && <label className="block text-sm">Ton nom<input className="cord-input mt-1" required maxLength={60} autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></label>}
          <label className="block text-sm">Email<input className="cord-input mt-1" type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label className="block text-sm">Mot de passe<input className="cord-input mt-1" type="password" minLength={register ? 12 : 1} required autoComplete={register ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} /></label>
          {register && <p className="text-xs text-fg-subtle">12 caractères minimum. Ce compte reste distinct de ton compte Apple.</p>}
          {!register && needsOtp && <label className="block text-sm">Code de double authentification<input className="cord-input mt-1" required inputMode="numeric" autoComplete="one-time-code" maxLength={24} value={otp} onChange={e => setOtp(e.target.value)} placeholder="123 456 ou code de secours" /></label>}
          <div className="flex flex-wrap gap-2"><GlassButton type="submit" variant="primary" disabled={busy || !IS_TAURI || !account.server}>{busy ? "Un instant…" : register ? "Créer mon compte" : "Se connecter"}</GlassButton><GlassButton variant="ghost" disabled={busy} onClick={() => { setRegister(!register); setPassword(""); }}>{register ? "J’ai déjà un compte" : "Créer un compte"}</GlassButton></div>
        </form>
        <GlassButton variant="glass" disabled={busy || !!challenge || !IS_TAURI || !account.server} onClick={() => void run(async () => setChallenge(await cordRequest<CordChallenge>("/api/passcord/login")))}>Se connecter avec Passcord</GlassButton>
      </> : <>
        <h2 className="font-display text-2xl font-semibold">{account.user.name}</h2><p className="text-sm text-fg-muted">{account.user.email}</p><code className="block break-all text-xs text-fg-subtle">{account.user.id}</code>
        {!account.user.emailVerified && <div className="space-y-2 rounded-xl bg-[var(--control)] p-3"><p className="text-sm">Confirme ton email avant de connecter Drivecord et les autres apps.</p><GlassButton variant="glass" disabled={busy} onClick={() => void run(async () => { const result = await cordRequest<{ devUrl?: string }>("/api/email/send"); setNotice(result.devUrl ? `Lien local prêt : ${result.devUrl}` : "Lien envoyé : consulte tes emails, puis actualise ton compte."); })}>Envoyer le lien de confirmation</GlassButton></div>}
        <form className="flex items-end gap-3" onSubmit={e => { e.preventDefault(); void run(async () => { await cordRequest("/api/me", { name }, "PATCH"); await refreshCord(); }); }}><label className="flex-1 text-sm">Nom affiché<input className="cord-input mt-1" required maxLength={60} value={name} onChange={e => setName(e.target.value)} /></label><GlassButton type="submit" variant="glass" disabled={busy}>Enregistrer</GlassButton></form>
        <h3 className="pt-4 font-semibold">Passcord, ta clé Cord</h3><p className="text-sm text-fg-muted">Associe Passcord, puis valide tes connexions sur ton iPhone avec Face ID.</p>
        {account.keys.map(key => <div key={key.id} className="flex items-center justify-between rounded-xl bg-[var(--control)] p-3 text-sm"><span>{key.name}</span><GlassButton variant="danger" disabled={busy} onClick={() => void run(async () => { await cordRequest("/api/passcord/keys", { id: key.id }, "DELETE"); await refreshCord(); })}>Révoquer</GlassButton></div>)}
        <div className="flex gap-2"><GlassButton variant="primary" disabled={busy} onClick={() => void run(async () => setChallenge(await cordRequest<CordChallenge>("/api/passcord/pair")))}>Associer Passcord</GlassButton><GlassButton variant="glass" disabled={busy} onClick={() => void run(refreshCord)}>Actualiser</GlassButton></div>
        <GlassButton variant="ghost" disabled={busy} onClick={() => void run(async () => { await cordRequest("/api/logout"); clearCord(); setChallenge(null); })}>Se déconnecter</GlassButton>
      </>}
      {challenge && <div className="space-y-3 rounded-2xl bg-[var(--control)] p-4"><div className="mx-auto w-48 rounded-xl bg-white p-3"><QrCode value={challenge.url} colors={["#7252bf", "#236f86"]} className="aspect-square w-full" /></div><p className="text-sm">Scanne ce code ou colle le lien dans les réglages « Compte Cord » de Passcord. Vérifie le serveur et valide sur ton iPhone.</p><input className="cord-input text-xs" readOnly value={challenge.url} aria-label="Lien Passcord" /><p className="text-xs text-fg-subtle">Valable trois minutes. {challenge.pollToken ? "En attente de ton iPhone…" : "Après l’association, actualise les appareils."}</p><GlassButton variant="glass" onClick={() => setChallenge(null)}>Fermer</GlassButton></div>}
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      {notice && <p role="status" className="break-all text-sm text-ok">{notice}</p>}
      {!IS_TAURI && <p className="text-sm text-fg-muted">La session du launcher utilise le coffre Windows. Dans cet aperçu, ouvre le portail Cord pour essayer le compte.</p>}
    </div></GlassCard>
    <GlassCard variants={itemVariants} className="rounded-[26px] p-6"><details className="relative z-[3]" open={!account.server}><summary className="cursor-pointer text-sm font-medium">Serveur Compte Cord</summary><p className="mt-3 text-xs text-fg-muted">Utilise l’adresse commune configurée pour ta suite Cord. En développement, démarre le service local sur le port 4319.</p><form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); void run(async () => { setChallenge(null); setCordServer(server); }); }}><input className="cord-input" type="url" required aria-label="Adresse du service Compte Cord" value={server} onChange={e => setServer(e.target.value)} placeholder="https://compte.example.com" /><GlassButton type="submit" variant="glass" disabled={busy}>Utiliser</GlassButton></form>{account.server && <GlassButton className="mt-3" variant="ghost" onClick={() => void openExternal(account.server)}>Ouvrir le portail Cord</GlassButton>}</details></GlassCard>
  </motion.div>;
}
