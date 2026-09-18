import { useEffect, useState } from "react";
import { initApple, loginApple, logoutApple, refreshApple, respondApple, useApple } from "../../lib/apple";
import { IS_TAURI, openExternal } from "../../lib/platform";
import { toast } from "../../lib/toast";
import { GlassButton, GlassModal, GlassToggle } from "../glass";

export function AppleAccount() {
  const apple = useApple();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  useEffect(() => { void refreshApple().catch(error => toast({ tone: "error", title: "Compte Apple indisponible", description: String(error) })); }, []);
  return <section className="space-y-4">
    <h3 className="font-display text-lg font-semibold">Compte Apple</h3>
    <p className="text-sm text-fg-muted">Signe et installe les apps sur ton iPhone depuis ce PC. Branche-le, déverrouille-le et accepte « Se fier à cet ordinateur ».</p>
    {apple.status.connected || apple.status.remembered ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--control)] p-4"><span className="text-sm">{apple.status.email}<small className="block text-fg-muted">{apple.status.connected ? "Connecté" : "Reconnexion à la prochaine installation"}</small></span><GlassButton variant="glass" disabled={apple.busy} onClick={() => void logoutApple()}>Déconnecter et oublier</GlassButton></div> :
      <form className="space-y-3" onSubmit={e => { e.preventDefault(); const secret = password; setPassword(""); void loginApple(email, secret, remember); }}>
        <label className="block text-sm">Adresse du compte Apple<input className="cord-input mt-1" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} disabled={apple.busy || !IS_TAURI} /></label>
        <label className="block text-sm">Mot de passe Apple<input className="cord-input mt-1" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={apple.busy || !IS_TAURI} /></label>
        <div className="flex items-center justify-between gap-3 text-sm"><span>Mémoriser dans le coffre Windows</span><GlassToggle label="Mémoriser le compte Apple" checked={remember} onChange={setRemember} disabled={apple.busy || !IS_TAURI} /></div>
        <GlassButton type="submit" variant="primary" disabled={apple.busy || !IS_TAURI}>{apple.busy ? "Connexion en cours…" : "Connecter mon compte Apple"}</GlassButton>
      </form>}
    {apple.error && <p role="alert" className="text-sm text-danger">{apple.error}</p>}
    {!IS_TAURI && <p className="text-xs text-fg-muted">La connexion Apple et la détection USB sont disponibles dans l’application Windows.</p>}
    <p className="text-xs leading-relaxed text-fg-muted">Avec un compte gratuit, les profils expirent après 7 jours : relance l’installation pour renouveler la signature. Aucun renouvellement automatique n’est activé. La connexion utilise Apple et le service Anisette du moteur isideload.</p>
    <button type="button" className="text-xs underline" onClick={() => void openExternal("https://developer.apple.com/support/compare-memberships/")}>Voir les limites du compte Apple</button>
  </section>;
}

export function AppleVerification() {
  const { twoFactor } = useApple();
  const [code, setCode] = useState("");
  useEffect(() => { void initApple().catch(error => toast({ tone: "error", title: "Vérification Apple indisponible", description: String(error) })); }, []);
  useEffect(() => setCode(""), [twoFactor]);
  return <GlassModal open={!!twoFactor} onClose={() => void respondApple("Abort")} width={460} labelledBy="apple-2fa-title">
    <form className="relative z-[3] space-y-4 p-8" onSubmit={e => { e.preventDefault(); void respondApple({ SubmitCode: code }); }}>
      <h2 id="apple-2fa-title" className="font-display text-xl font-semibold">Vérification Apple</h2>
      <p className="text-sm text-fg-muted">Entre le code reçu sur ton appareil Apple ou par SMS.</p>
      {twoFactor?.lastError && <p role="alert" className="text-sm text-danger">{twoFactor.lastError}</p>}
      <input className="cord-input text-center tracking-widest" aria-label="Code Apple à six chiffres" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} />
      <GlassButton type="submit" variant="primary" disabled={code.length !== 6}>Valider</GlassButton>
      <div className="flex flex-wrap gap-2"><GlassButton variant="glass" onClick={() => void respondApple("SendToDevices")}>Sur mes appareils</GlassButton>{twoFactor?.numbers.map(n => <GlassButton key={n.id} variant="glass" onClick={() => void respondApple({ SendSms: n.id })}>SMS {n.numberWithDialCode}</GlassButton>)}</div>
    </form>
  </GlassModal>;
}
