/* Vitrine publique (non connecté) : présentation du Compte Cord et de la suite. */

messages({
  fr: {
    'landing.pill': 'L’identité de la suite Cord',
    'landing.title.a': 'Un compte.',
    'landing.title.b': 'Toute la suite.',
    'landing.lead': 'Ton Compte Cord t’ouvre Drivecord, Tunecord, Passcord et toutes les apps qui arrivent. Une seule identité, protégée par ton iPhone, tes passkeys et la double authentification.',
    'landing.point.sso': '<strong>Connexion unique</strong> à toutes les apps de la suite',
    'landing.point.passwordless': '<strong>Sans mot de passe</strong> avec Passcord ou une passkey',
    'landing.point.privacy': '<strong>Tes données, tes règles</strong> : export et suppression en un clic',
    'landing.rail': '{n} apps, un seul compte',
    'landing.features.eyebrow': 'Pourquoi un Compte Cord',
    'landing.features.title': 'Une clé, toutes les portes.',
    'landing.features.desc': 'Pensé comme les comptes des grandes plateformes — sans la pub ni la revente de données.',
    'landing.f1.title': 'Connexion unique (OIDC)', 'landing.f1.desc': 'Un bouton « Continuer avec Cord » dans chaque app. Tu choisis ce que tu partages, et tu peux révoquer l’accès à tout moment.',
    'landing.f2.title': 'Passcord & passkeys', 'landing.f2.desc': 'Ton iPhone signe tes connexions avec Face ID ; tes passkeys marchent sur Mac, Windows et Android. La clé privée ne quitte jamais l’appareil.',
    'landing.f3.title': 'Sécurité visible', 'landing.f3.desc': 'Double authentification, sessions par appareil, historique de connexions et alertes email en cas de nouvel appareil.',
    'landing.suite.eyebrow': 'La suite', 'landing.suite.title': 'Des apps indépendantes, une seule identité.',
    'landing.suite.desc': 'Chaque app vit sur son propre domaine. Ton Compte Cord est le fil qui les relie.',
    'landing.how.eyebrow': 'En trois gestes', 'landing.how.title': 'Prêt en une minute.',
    'landing.how.1.title': 'Crée ton compte', 'landing.how.1.desc': 'Un nom, un email, un mot de passe solide. Confirme ton adresse d’un clic.',
    'landing.how.2.title': 'Associe Passcord', 'landing.how.2.desc': 'Scanne un QR code avec ton iPhone : il devient ta clé. Ou ajoute une passkey.',
    'landing.how.3.title': 'Connecte tes apps', 'landing.how.3.desc': 'Sur Drivecord et les autres, choisis « Continuer avec Cord ». C’est tout.',
    'landing.promise.title': 'Ce qu’on ne fera jamais', 'landing.promise.desc': 'Pas de pub, pas de pisteurs, pas de revente. Ton mot de passe est haché avec scrypt, tes secrets 2FA sont chiffrés, et tu peux tout exporter ou tout effacer.',
    'landing.promise.cta': 'Créer mon compte',
    'landing.footer.suite': 'La suite Cord', 'landing.footer.status': 'État des services', 'landing.footer.oidc': 'Configuration OIDC',
    'nav.signin': 'Se connecter', 'nav.theme': 'Changer de thème', 'nav.lang': 'Language: English',
  },
  en: {
    'landing.pill': 'The identity of the Cord suite',
    'landing.title.a': 'One account.',
    'landing.title.b': 'The whole suite.',
    'landing.lead': 'Your Cord account opens Drivecord, Tunecord, Passcord and every app on the way. One identity, protected by your iPhone, your passkeys and two-factor authentication.',
    'landing.point.sso': '<strong>Single sign-on</strong> to every app in the suite',
    'landing.point.passwordless': '<strong>Passwordless</strong> with Passcord or a passkey',
    'landing.point.privacy': '<strong>Your data, your rules</strong>: export and delete in one click',
    'landing.rail': '{n} apps, one account',
    'landing.features.eyebrow': 'Why a Cord account',
    'landing.features.title': 'One key, every door.',
    'landing.features.desc': 'Built like the accounts of big platforms — without the ads or the data brokering.',
    'landing.f1.title': 'Single sign-on (OIDC)', 'landing.f1.desc': 'A “Continue with Cord” button in every app. You choose what you share, and you can revoke access anytime.',
    'landing.f2.title': 'Passcord & passkeys', 'landing.f2.desc': 'Your iPhone signs your logins with Face ID; passkeys work on Mac, Windows and Android. The private key never leaves the device.',
    'landing.f3.title': 'Visible security', 'landing.f3.desc': 'Two-factor authentication, per-device sessions, sign-in history and email alerts for new devices.',
    'landing.suite.eyebrow': 'The suite', 'landing.suite.title': 'Independent apps, one identity.',
    'landing.suite.desc': 'Each app lives on its own domain. Your Cord account is the thread that ties them together.',
    'landing.how.eyebrow': 'Three steps', 'landing.how.title': 'Ready in a minute.',
    'landing.how.1.title': 'Create your account', 'landing.how.1.desc': 'A name, an email, a strong password. Confirm your address in one click.',
    'landing.how.2.title': 'Pair Passcord', 'landing.how.2.desc': 'Scan a QR code with your iPhone: it becomes your key. Or add a passkey.',
    'landing.how.3.title': 'Connect your apps', 'landing.how.3.desc': 'On Drivecord and the others, pick “Continue with Cord”. That’s it.',
    'landing.promise.title': 'What we’ll never do', 'landing.promise.desc': 'No ads, no trackers, no data sales. Your password is hashed with scrypt, your 2FA secrets are encrypted, and you can export or erase everything.',
    'landing.promise.cta': 'Create my account',
    'landing.footer.suite': 'The Cord suite', 'landing.footer.status': 'Service status', 'landing.footer.oidc': 'OIDC configuration',
    'nav.signin': 'Sign in', 'nav.theme': 'Switch theme', 'nav.lang': 'Langue : français',
  },
});

let authHandle = null;

function publicTopbar() {
  return html`<header class="topbar">
    <a class="brand" href="/" aria-label="Compte Cord"><img src="/assets/icon-180.png" alt="" width="34" height="34"><span class="name">Compte Cord<small>cordsuite.app</small></span></a>
    <div class="actions">
      <button class="btn btn-ghost btn-sm" data-action="toggle-locale" aria-label="${t('nav.lang')}">${icon('languages')}<span>${locale === 'fr' ? 'EN' : 'FR'}</span></button>
      <button class="btn btn-ghost btn-icon btn-sm" data-action="toggle-theme" aria-label="${t('nav.theme')}">${icon(effectiveTheme() === 'dark' ? 'sun' : 'moon')}</button>
      <a class="btn btn-glass btn-sm hide-sm" href="#connexion" data-action="focus-auth">${icon('log-in')}${t('nav.signin')}</a>
    </div>
  </header>`;
}

function suiteTile(app, { link = true } = {}) {
  const live = app.status === 'live' && app.url && link;
  const inner = html`<div class="top">${appLogo(app)}${statusBadge(app.status)}</div>
    <div><div class="name">${app.name}</div><div class="tag">${app.tagline}</div></div>
    <p class="desc">${app.description}</p>
    ${live ? html`<span class="go">${icon('arrow-right')}</span>` : ''}`;
  return live
    ? html`<a class="app-tile glass" href="${app.url}" target="_blank" rel="noopener" data-accent="${app.accent.join(',')}">${inner}</a>`
    : html`<div class="app-tile glass ${app.status === 'soon' ? 'is-soon' : ''}" data-accent="${app.accent.join(',')}">${inner}</div>`;
}

function showLanding({ mode = 'login', resetToken } = {}) {
  state.account = null;
  const app = $('#app');
  app.removeAttribute('aria-busy');
  document.title = 'Compte Cord';
  const apps = state.suite;
  render(app, html`${publicTopbar()}
    <main class="landing" id="main">
      <section class="hero">
        <div class="hero-copy">
          <span class="pill"><span class="spark">${icon('sparkles')}</span>${t('landing.pill')}</span>
          <h1>${t('landing.title.a')}<br><span class="grad-text">${t('landing.title.b')}</span></h1>
          <p class="lead">${t('landing.lead')}</p>
          <ul class="hero-points">
            <li><span class="icon-badge">${icon('key-round')}</span><span>${raw(t('landing.point.sso'))}</span></li>
            <li><span class="icon-badge tone-info">${icon('scan-face')}</span><span>${raw(t('landing.point.passwordless'))}</span></li>
            <li><span class="icon-badge tone-ok">${icon('shield-check')}</span><span>${raw(t('landing.point.privacy'))}</span></li>
          </ul>
          <div class="logo-rail" aria-label="${t('landing.rail', { n: apps.length })}">
            ${apps.map((a) => html`<img src="${a.logo}" alt="${a.name}" title="${a.name}" class="${a.status === 'soon' ? 'soon' : ''}" width="38" height="38" loading="lazy">`)}
            <span class="caption">${t('landing.rail', { n: apps.length })}</span>
          </div>
        </div>
        <div class="auth-card glass" id="connexion"></div>
      </section>

      <section class="l-section">
        <header><p class="eyebrow">${t('landing.features.eyebrow')}</p><h2>${t('landing.features.title')}</h2><p>${t('landing.features.desc')}</p></header>
        <div class="features">
          <article class="feature glass"><span class="icon-badge grad">${icon('link-2')}</span><h3>${t('landing.f1.title')}</h3><p>${t('landing.f1.desc')}</p></article>
          <article class="feature glass"><span class="icon-badge grad">${icon('fingerprint-pattern')}</span><h3>${t('landing.f2.title')}</h3><p>${t('landing.f2.desc')}</p></article>
          <article class="feature glass"><span class="icon-badge grad">${icon('shield-check')}</span><h3>${t('landing.f3.title')}</h3><p>${t('landing.f3.desc')}</p></article>
        </div>
      </section>

      <section class="l-section">
        <header><p class="eyebrow">${t('landing.suite.eyebrow')}</p><h2>${t('landing.suite.title')}</h2><p>${t('landing.suite.desc')}</p></header>
        <div class="suite-grid">${apps.map((a) => suiteTile(a))}</div>
      </section>

      <section class="l-section">
        <header><p class="eyebrow">${t('landing.how.eyebrow')}</p><h2>${t('landing.how.title')}</h2></header>
        <ol class="how">
          ${[1, 2, 3].map((n) => html`<li class="glass"><span class="how-n">0${n}</span><h3>${t(`landing.how.${n}.title`)}</h3><p>${t(`landing.how.${n}.desc`)}</p></li>`)}
        </ol>
      </section>

      <section class="promise glass">
        <span class="icon-badge grad">${icon('lock-keyhole')}</span>
        <div><h2>${t('landing.promise.title')}</h2><p>${t('landing.promise.desc')}</p></div>
        <button class="btn btn-primary btn-lg" data-action="start-register">${t('landing.promise.cta')}${icon('arrow-right')}</button>
      </section>

      <footer class="site-foot">
        <span>© ${new Date().getFullYear()} Cord</span>
        <a href="https://cordsuite.app" target="_blank" rel="noopener">${t('landing.footer.suite')}</a>
        <a href="https://cordsuite.app/status" target="_blank" rel="noopener">${t('landing.footer.status')}</a>
        <span class="spacer"></span>
        <a href="/.well-known/openid-configuration">${t('landing.footer.oidc')}</a>
      </footer>
    </main>`);
  authHandle?.destroy();
  authHandle = mountAuth($('#connexion'), { mode, resetToken, onSuccess: afterLogin });
}

async function afterLogin(result, meta = {}) {
  history.replaceState(null, '', '/#apercu');
  await loadAccount();
  state.route = 'apercu';
  renderShell();
  scrollTo({ top: 0 });
  const name = state.account.user.name;
  if (meta.registered) {
    celebrate();
    toast(meta.verified ? t('verify.done') : t('auth.verifySent', { email: state.account.user.email }), {
      type: 'success',
      duration: 8000,
      ...(meta.devUrl ? { action: { href: meta.devUrl, label: t('auth.devLink') } } : {}),
    });
  } else toast(t('auth.welcomeBack', { name }), { type: 'success', duration: 3000 });
}

Object.assign(ACTIONS, {
  'toggle-theme'() {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    if (state.account) {
      state.account.user.theme = next;
      api('/api/me', { theme: next }, 'PATCH').catch(() => {});
      renderShell();
    } else {
      $$('[data-action="toggle-theme"]').forEach((b) => render(b, icon(next === 'dark' ? 'sun' : 'moon')));
    }
  },
  'toggle-locale'() {
    setLocale(locale === 'fr' ? 'en' : 'fr');
    if (state.account) {
      state.account.user.locale = locale;
      api('/api/me', { locale }, 'PATCH').catch(() => {});
      renderShell();
    } else showLanding();
  },
  'focus-auth'() {
    const card = $('#connexion');
    card?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => $('input', card)?.focus({ preventScroll: true }), 350);
  },
  'start-register'() {
    authHandle?.go('register');
    ACTIONS['focus-auth']();
  },
});
