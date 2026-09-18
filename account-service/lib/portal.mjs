// Portail Compte Cord, embarqué en chaînes pour être servi par la fonction
// serverless (aucun fichier statique exposé). Source : portal.html/js/css —
// régénérer avec scripts/gen-portal.cjs après une modification.
export const PORTAL_HTML = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Compte Cord</title><link rel="stylesheet" href="/portal.css"><script type="module" src="/portal.js"></script></head>
<body><main><div class="mark">C</div><p class="eyebrow">UN COMPTE, TOUTE LA SUITE</p><h1>Ton espace Cord.</h1><p class="muted">Un seul compte pour retrouver les apps Cord. Passcord peut devenir ta clé de connexion.</p>
<p id="message" role="status"></p>
<section id="auth"><form id="auth-form"><label>Email<input name="email" type="email" autocomplete="username" required></label><label id="name-label" hidden>Ton nom<input name="name" autocomplete="name" maxlength="60"></label><label>Mot de passe<input name="password" type="password" autocomplete="current-password" required maxlength="512"></label><button id="submit">Se connecter</button></form><button id="switch" class="secondary">Créer un compte Cord</button><button id="passcord" class="secondary">Se connecter avec Passcord</button><div id="challenge" hidden><p>Ouvre ce lien dans Passcord, puis vérifie et approuve la connexion sur ton iPhone.</p><a id="passcord-link">Ouvrir Passcord</a><input id="passcord-url" readonly aria-label="Lien à ouvrir dans Passcord"><button id="cancel-passcord" class="secondary">Annuler</button></div></section>
<section id="account" hidden><p class="eyebrow">CONNECTÉ</p><h2 id="user-name"></h2><p id="user-email" class="muted"></p><code id="user-id"></code><form id="profile-form"><label>Nom affiché<input name="name" required maxlength="60"></label><button>Enregistrer</button></form><h2>Passcord, ta clé Cord</h2><p class="muted">Associe ton iPhone une fois. Les connexions suivantes se valident dans Passcord avec Face ID.</p><button id="pair" class="secondary">Associer Passcord</button><input id="pair-url" readonly hidden aria-label="Lien d’association à ouvrir dans Passcord"><ul id="keys"></ul><button id="refresh" class="secondary">Actualiser les appareils</button><button id="logout" class="secondary">Se déconnecter</button></section>
<section id="verify-email" hidden><p>Confirme ton email pour utiliser ton compte Cord dans les autres apps.</p><button id="send-email">Envoyer le lien de confirmation</button></section>
<section id="consent" hidden><h2 id="consent-title">Connexion à une app</h2><p>Cette app recevra ton identifiant Cord, ton nom et ton email.</p><button id="approve">Continuer avec Cord</button></section>
<footer>Ton mot de passe et les clés privées de Passcord ne sont jamais transmis aux autres apps.</footer></main></body></html>
`;

export const PORTAL_JS = `const $ = id => document.getElementById(id);
let register = false;
let pollTimer;
let challengeGeneration = 0;
const params = Object.fromEntries(new URLSearchParams(location.search));
const isConsent = location.pathname === '/authorize';
async function api(path, data, method = 'POST') {
  const res = await fetch(path, { method, credentials: 'same-origin', ...(method === 'GET' ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data ?? {}) }) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? 'Service indisponible.');
  return body;
}
function message(value) { $('message').textContent = value; }
async function run(fn) { message(''); try { await fn(); } catch (e) { message(e.message); } }
async function refresh() {
  try {
    const result = await api('/api/me', null, 'GET');
    $('auth').hidden = true; $('account').hidden = false;
    $('verify-email').hidden = result.user.emailVerified;
    $('user-name').textContent = result.user.name; $('user-email').textContent = result.user.email; $('user-id').textContent = result.user.id;
    $('profile-form').elements.name.value = result.user.name;
    $('keys').replaceChildren(...result.keys.map(key => {
      const li = document.createElement('li'); li.textContent = key.name + ' ';
      const button = document.createElement('button'); button.textContent = 'Révoquer'; button.className = 'secondary';
      button.onclick = () => run(async () => { await api('/api/passcord/keys', { id: key.id }, 'DELETE'); await refresh(); });
      li.append(button); return li;
    }));
    if (isConsent) { const client = await api(\`/api/client?id=\${encodeURIComponent(params.client_id ?? '')}\`, null, 'GET'); $('consent-title').textContent = \`Continuer vers \${client.name}\`; $('consent').hidden = false; }
  } catch (e) { $('auth').hidden = false; $('account').hidden = true; $('consent').hidden = true; $('verify-email').hidden = true; if (!e.message.includes('Connecte') && !e.message.includes('Session')) message(e.message); }
}
$('switch').onclick = () => { register = !register; $('name-label').hidden = !register; $('auth-form').elements.name.required = register; $('auth-form').elements.password.minLength = register ? 12 : 1; $('auth-form').elements.password.autocomplete = register ? 'new-password' : 'current-password'; $('submit').textContent = register ? 'Créer mon compte' : 'Se connecter'; $('switch').textContent = register ? 'J’ai déjà un compte' : 'Créer un compte Cord'; };
$('auth-form').onsubmit = event => { event.preventDefault(); void run(async () => { $('submit').disabled = true; try { await api(register ? '/api/register' : '/api/login', Object.fromEntries(new FormData(event.target))); event.target.elements.password.value = ''; cancelPoll(); await refresh(); } finally { $('submit').disabled = false; } }); };
$('profile-form').onsubmit = event => { event.preventDefault(); void run(async () => { await api('/api/me', Object.fromEntries(new FormData(event.target)), 'PATCH'); await refresh(); message('Nom enregistré.'); }); };
$('logout').onclick = () => run(async () => { await api('/api/logout'); $('pair-url').hidden = true; await refresh(); });
$('refresh').onclick = () => run(refresh);
$('pair').onclick = () => run(async () => { const pairing = await api('/api/passcord/pair'); $('pair-url').hidden = false; $('pair-url').value = pairing.url; message('Dans les réglages de Passcord, ouvre « Compte Cord » puis colle ce lien. Il expire dans trois minutes.'); });
$('approve').onclick = () => run(async () => { const result = await api('/api/authorize', params); location.assign(result.redirect); });
function cancelPoll() { challengeGeneration++; clearTimeout(pollTimer); $('challenge').hidden = true; $('passcord').disabled = false; }
$('cancel-passcord').onclick = cancelPoll;
$('passcord').onclick = () => run(async () => {
  cancelPoll(); const generation = challengeGeneration; const request = await api('/api/passcord/login');
  $('passcord').disabled = true; $('challenge').hidden = false; $('passcord-link').href = request.url; $('passcord-url').value = request.url;
  async function poll() {
    if (generation !== challengeGeneration) return;
    try { const result = await api('/api/passcord/poll', { id: request.id, pollToken: request.pollToken }); if (!result.pending) { cancelPoll(); await refresh(); } else pollTimer = setTimeout(poll, 2500); }
    catch (e) { cancelPoll(); message(e.message); }
  }
  pollTimer = setTimeout(poll, 2500);
});
$('send-email').onclick = () => run(async () => { await api('/api/email/send'); message('Lien de confirmation envoyé. Vérifie tes emails, puis actualise cette page.'); });
if (params.verify) {
  history.replaceState(null, '', '/');
  void run(async () => { await api('/api/email/verify', { token: params.verify }); await refresh(); message('Adresse email confirmée. Tu peux revenir dans ton app.'); });
} else void refresh();
`;

export const PORTAL_CSS = `:root{color-scheme:dark;font-family:Inter,system-ui,sans-serif;color:#f3f0ff;background:#0a0811}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 20% 5%,#54329f60,transparent 55%),radial-gradient(ellipse at 100% 80%,#16627b40,transparent 50%)}main{max-width:540px;margin:0 auto;padding:56px 28px}.mark{display:grid;place-items:center;width:56px;height:56px;border-radius:18px;background:linear-gradient(140deg,#956eff,#57c8d9);font-weight:800;font-size:32px;margin-bottom:28px}.eyebrow{font-size:11px;letter-spacing:.16em;color:#aab0cc}h1{font-size:40px;letter-spacing:-.04em;margin:12px 0}h2{font-size:23px}.muted,footer{color:#a4a1b4;line-height:1.6}section{padding:24px 0;border-top:1px solid #ffffff18;margin-top:24px}form{display:grid;gap:16px}label{font-size:13px;display:grid;gap:8px}input{width:100%;border:1px solid #ffffff24;background:#ffffff09;color:inherit;padding:13px;border-radius:12px;font:inherit}button{border:0;border-radius:12px;padding:13px 18px;font:600 14px system-ui;color:white;background:#7954d6;cursor:pointer;min-height:44px}button:disabled{opacity:.5;cursor:wait}.secondary{background:#ffffff0c;border:1px solid #ffffff20;margin:10px 8px 0 0}button:hover{filter:brightness(1.15)}a{color:#baa0ff}#message{color:#ffb6c6;white-space:pre-line}code{font-size:11px;overflow-wrap:anywhere}footer{font-size:12px;margin-top:32px}ul{padding-left:18px}li{padding:8px 0}input:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid #b89cff;outline-offset:3px}[hidden]{display:none!important}
`;
