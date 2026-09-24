/* Écran de consentement OAuth / OIDC (/authorize). */

messages({
  fr: {
    'consent.title': '<strong>{app}</strong> souhaite accéder à ton compte Cord',
    'consent.sub': 'Vérifie ce qui sera partagé avant de continuer.',
    'consent.as': 'Connecté en tant que', 'consent.switch': 'Changer',
    'consent.will': '{app} pourra voir :',
    'scope.openid.desc': 'Pour te reconnaître d’une connexion à l’autre', 'scope.profile.desc': 'Pour personnaliser ton espace', 'scope.email.desc': 'Pour te contacter à propos de ton compte',
    'consent.assure': '{app} ne verra jamais ton mot de passe ni tes clés Passcord. Tu peux révoquer cet accès à tout moment depuis ton Compte Cord.',
    'consent.allow': 'Autoriser', 'consent.deny': 'Annuler', 'consent.redirect': 'Tu seras redirigé vers {host}',
    'consent.continuing': 'Connexion à {app}…', 'consent.invalid': 'Lien de connexion invalide',
    'consent.invalidDesc': 'Cette demande ne vient pas d’une app reconnue par le Compte Cord, ou son adresse de retour n’est pas autorisée. Retourne dans l’app et réessaie.',
    'consent.verify': 'Confirme ton email pour continuer', 'consent.verifyDesc': '{app} a besoin d’une adresse vérifiée. Clique sur le lien reçu, puis reviens sur cette page.',
    'consent.verifyCheck': 'J’ai confirmé mon adresse', 'consent.home': 'Aller à mon compte',
  },
  en: {
    'consent.title': '<strong>{app}</strong> wants to access your Cord account',
    'consent.sub': 'Check what will be shared before continuing.',
    'consent.as': 'Signed in as', 'consent.switch': 'Switch',
    'consent.will': '{app} will be able to see:',
    'scope.openid.desc': 'To recognize you across sign-ins', 'scope.profile.desc': 'To personalize your space', 'scope.email.desc': 'To contact you about your account',
    'consent.assure': '{app} will never see your password or your Passcord keys. You can revoke this access anytime from your Cord account.',
    'consent.allow': 'Allow', 'consent.deny': 'Cancel', 'consent.redirect': 'You’ll be redirected to {host}',
    'consent.continuing': 'Signing in to {app}…', 'consent.invalid': 'Invalid sign-in link',
    'consent.invalidDesc': 'This request doesn’t come from an app Cord Account recognizes, or its return address isn’t allowed. Go back to the app and try again.',
    'consent.verify': 'Confirm your email to continue', 'consent.verifyDesc': '{app} needs a verified address. Click the link you received, then come back to this page.',
    'consent.verifyCheck': 'I confirmed my address', 'consent.home': 'Go to my account',
  },
});

const consentParams = () => Object.fromEntries(new URLSearchParams(location.search));

async function showConsent() {
  const params = consentParams();
  const app = $('#app');
  app.removeAttribute('aria-busy');
  let context;
  try {
    context = await api(`/api/authorize/context?client_id=${encodeURIComponent(params.client_id ?? '')}&redirect_uri=${encodeURIComponent(params.redirect_uri ?? '')}`);
  } catch {
    context = null;
  }
  const frame = (inner) => render(app, html`<main class="consent-page" id="main"><section class="consent glass" aria-live="polite">${inner}</section></main>`);
  if (!context || !context.redirectValid) {
    document.title = t('consent.invalid');
    frame(html`<div class="auth-illu"><div class="icon-badge tone-danger">${icon('circle-x')}</div></div>
      <h1>${t('consent.invalid')}</h1><p class="sub">${t('consent.invalidDesc')}</p>
      <a class="btn btn-glass btn-block" href="/">${t('consent.home')}</a>`);
    return;
  }
  const client = context.client;
  document.title = `${client.name} · Compte Cord`;
  const visual = html`<div class="link-visual" aria-hidden="true">
    <span class="logo"><img src="/assets/icon-180.png" alt=""></span>
    <span class="wire"><span class="lock">${icon('lock')}</span></span>
    <span class="logo">${appLogo(client)}</span></div>`;

  if (!context.user) {
    frame(html`${visual}<div id="consent-auth" class="auth-card"></div>`);
    mountAuth($('#consent-auth'), { context: { appName: client.name }, onSuccess: () => showConsent() });
    return;
  }
  const user = context.user;
  if (!user.emailVerified) {
    frame(html`${visual}<div><h1>${t('consent.verify')}</h1><p class="sub">${t('consent.verifyDesc', { app: client.name })}</p></div>
      <div class="account-chip">${avatar(user, 'sm')}<div class="who"><strong>${user.name}</strong><span>${user.email}</span></div></div>
      <div class="stack-sm"><button class="btn btn-glass btn-block" data-action="send-verification">${icon('send')}${t('verify.send')}</button>
      <button class="btn btn-primary btn-block" data-action="consent-reload">${t('consent.verifyCheck')}</button></div>`);
    return;
  }

  const allow = async (button) => {
    const result = await (button ? busy(button, () => api('/api/authorize', params)) : api('/api/authorize', params));
    if (result?.redirect) location.assign(result.redirect);
  };
  if (context.consented && params.prompt !== 'consent') {
    frame(html`${visual}<div class="consent-loading"><span class="pulse-dot"></span><p class="muted">${t('consent.continuing', { app: client.name })}</p></div>`);
    try { await allow(); } catch (e) { toastError(e); }
    return;
  }
  const scopes = String(params.scope ?? 'openid').split(' ').filter((s) => ['openid', 'profile', 'email'].includes(s));
  const host = (() => { try { return new URL(params.redirect_uri).host; } catch { return ''; } })();
  frame(html`${visual}
    <div><h1>${raw(t('consent.title', { app: escapeValue(client.name) }))}</h1><p class="sub">${t('consent.sub')}</p></div>
    <div class="account-chip">${avatar(user, 'sm')}<div class="who"><strong>${user.name}</strong><span>${user.email}</span></div>
      <button class="btn btn-ghost btn-sm" data-action="consent-switch">${t('consent.switch')}</button></div>
    <div><p class="eyebrow">${t('consent.will', { app: client.name })}</p>
      <ul class="grants">${scopes.map((s) => html`<li><span class="icon-badge">${icon(SCOPE_ICONS[s])}</span><div>${t(`scope.${s}`)}<small>${t(`scope.${s}.desc`)}</small></div></li>`)}</ul></div>
    <p class="assure">${icon('shield-check')}<span>${t('consent.assure', { app: client.name })}</span></p>
    <div class="actions">
      <button class="btn btn-ghost btn-lg" data-action="consent-deny">${t('consent.deny')}</button>
      <button class="btn btn-primary btn-lg" data-action="consent-allow">${t('consent.allow')}${icon('arrow-right')}</button>
    </div>
    <p class="foot">${raw(t('consent.redirect', { host: `<code>${escapeValue(host)}</code>` }))}</p>`);
  ACTIONS['consent-allow'] = (button) => allow(button);
}

Object.assign(ACTIONS, {
  async 'consent-deny'(button) {
    const params = consentParams();
    const result = await busy(button, () => api('/api/authorize/deny', params));
    if (result?.redirect) location.assign(result.redirect);
  },
  async 'consent-switch'() {
    await api('/api/logout', {}).catch(() => {});
    showConsent();
  },
  'consent-reload'() {
    showConsent();
  },
});
