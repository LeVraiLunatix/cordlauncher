const $ = id => document.getElementById(id);
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
    if (isConsent) { const client = await api(`/api/client?id=${encodeURIComponent(params.client_id ?? '')}`, null, 'GET'); $('consent-title').textContent = `Continuer vers ${client.name}`; $('consent').hidden = false; }
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
