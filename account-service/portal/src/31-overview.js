/* Aperçu : accueil, score de sécurité, premiers pas, chiffres clés. */

messages({
  fr: {
    'hello.morning': 'Bonjour, {name}', 'hello.evening': 'Bonsoir, {name}', 'hello.night': 'Encore debout, {name} ?',
    'hello.since': 'Membre depuis {date}', 'hello.verified': 'Email vérifié', 'hello.unverified': 'Email à confirmer',
    'verify.title': 'Confirme ton adresse email', 'verify.desc': 'Indispensable pour te connecter aux apps de la suite avec ton compte Cord.',
    'verify.send': 'Envoyer le lien', 'verify.sent': 'Lien envoyé à {email}. Il est valable 15 minutes.',
    'onboard.title': 'Bien démarrer', 'onboard.desc': '{done} sur {total} — encore quelques gestes pour un compte au top.',
    'onboard.hide': 'Masquer', 'onboard.complete': 'Ton compte est prêt. Beau travail !',
    'onboard.email': 'Confirmer ton adresse email', 'onboard.email.desc': 'Pour utiliser Cord dans les apps.',
    'onboard.key': 'Associer Passcord ou une passkey', 'onboard.key.desc': 'Connexion sans mot de passe, validée par Face ID.',
    'onboard.mfa': 'Activer la double authentification', 'onboard.mfa.desc': 'Un code à usage unique en plus du mot de passe.',
    'onboard.avatar': 'Ajouter une photo', 'onboard.avatar.desc': 'Pour te reconnaître d’un coup d’œil dans les apps.',
    'onboard.app': 'Connecter une app', 'onboard.app.desc': 'Drivecord t’attend avec « Continuer avec Cord ».',
    'onboard.go': 'Y aller',
    'stat.apps': 'Apps connectées', 'stat.sessions': 'Sessions actives', 'stat.keys': 'Clés sans mot de passe', 'stat.last': 'Dernière connexion',
    'overview.suite': 'Ta suite Cord', 'overview.activity': 'Activité récente', 'overview.allActivity': 'Tout voir',
    'overview.connected': 'Connectée', 'overview.discover': 'Découvrir',
  },
  en: {
    'hello.morning': 'Hello, {name}', 'hello.evening': 'Good evening, {name}', 'hello.night': 'Still up, {name}?',
    'hello.since': 'Member since {date}', 'hello.verified': 'Email verified', 'hello.unverified': 'Email to confirm',
    'verify.title': 'Confirm your email address', 'verify.desc': 'Required to sign in to the suite’s apps with your Cord account.',
    'verify.send': 'Send the link', 'verify.sent': 'Link sent to {email}. It’s valid for 15 minutes.',
    'onboard.title': 'Get started', 'onboard.desc': '{done} of {total} — a few more steps for a top-notch account.',
    'onboard.hide': 'Hide', 'onboard.complete': 'Your account is ready. Nice work!',
    'onboard.email': 'Confirm your email address', 'onboard.email.desc': 'To use Cord in the apps.',
    'onboard.key': 'Pair Passcord or a passkey', 'onboard.key.desc': 'Passwordless sign-in, approved with Face ID.',
    'onboard.mfa': 'Turn on two-factor authentication', 'onboard.mfa.desc': 'A one-time code on top of your password.',
    'onboard.avatar': 'Add a photo', 'onboard.avatar.desc': 'So apps can show who you are at a glance.',
    'onboard.app': 'Connect an app', 'onboard.app.desc': 'Drivecord is waiting with “Continue with Cord”.',
    'onboard.go': 'Go',
    'stat.apps': 'Connected apps', 'stat.sessions': 'Active sessions', 'stat.keys': 'Passwordless keys', 'stat.last': 'Last sign-in',
    'overview.suite': 'Your Cord suite', 'overview.activity': 'Recent activity', 'overview.allActivity': 'See all',
    'overview.connected': 'Connected', 'overview.discover': 'Discover',
  },
});

function greeting(name) {
  const hour = new Date().getHours();
  const first = String(name).split(/\s+/)[0];
  return t(hour >= 5 && hour < 18 ? 'hello.morning' : hour >= 18 || hour < 1 ? 'hello.evening' : 'hello.night', { name: first });
}

function onboardingSteps(a) {
  return [
    { id: 'email', done: a.user.emailVerified, action: 'send-verification' },
    { id: 'key', done: a.passkeys.length + a.passcord.length > 0, href: '#appareils' },
    { id: 'mfa', done: a.security.mfa, action: 'totp-setup' },
    { id: 'avatar', done: Boolean(a.user.avatarUrl), href: '#profil' },
    { id: 'app', done: a.apps.length > 0, href: 'https://drivecord.app', external: true },
  ];
}
const onboardingHidden = () => {
  try { return localStorage.getItem('cord:onboarding-hidden') === '1'; } catch { return false; }
};

function verifyBanner(a) {
  if (a.user.emailVerified) return '';
  return html`<div class="banner tone-warn" role="status">${icon('mail')}
    <div class="body"><p class="title">${t('verify.title')}</p><p class="desc">${t('verify.desc')}</p></div>
    <button class="btn btn-sm btn-glass" data-action="send-verification">${icon('send')}${t('verify.send')}</button></div>`;
}

VIEWS.apercu = {
  render(a) {
    const score = securityScore(a);
    const steps = onboardingSteps(a);
    const done = steps.filter((s) => s.done).length;
    const showOnboarding = done < steps.length && !onboardingHidden();
    const connected = new Set(a.apps.map((x) => x.id));
    const lastLogin = a.activity.find((e) => e.kind === 'login' || e.kind === 'register');
    return html`<div class="view">
      ${verifyBanner(a)}
      <section class="hello glass">
        <span class="glow"></span>
        <div class="avatar-ring avatar-xl">${avatar(a.user)}</div>
        <div class="who">
          <p class="eyebrow">${fmtDate(Date.now())}</p>
          <h1 tabindex="-1" data-page-title>${greeting(a.user.name)}</h1>
          <div class="meta">
            <span class="break">${a.user.email}</span>
            ${a.user.emailVerified ? html`<span class="badge tone-ok">${icon('badge-check')}${t('hello.verified')}</span>` : html`<span class="badge tone-warn">${t('hello.unverified')}</span>`}
          </div>
          <p class="small subtle since">${t('hello.since', { date: fmtDate(a.user.createdAt) })}</p>
        </div>
        <a class="score" href="#securite">
          ${scoreRing(score.value, { caption: t('score.label') })}
          <span class="caption tone-${score.tone}">${score.label}</span>
        </a>
      </section>

      ${showOnboarding ? html`<section class="card glass">
        <div class="onboard-head">
          <span class="icon-badge grad">${icon('wand-sparkles')}</span>
          <div class="grow"><h2 class="card-title">${t('onboard.title')}</h2><p class="card-desc">${t('onboard.desc', { done, total: steps.length })}</p>
            <div class="progress"><span data-width="${(done / steps.length) * 100}"></span></div></div>
          <button class="btn btn-ghost btn-sm" data-action="hide-onboarding">${t('onboard.hide')}</button>
        </div>
        <ul class="checklist">
          ${steps.map((s) => html`<li class="${s.done ? 'done' : ''}">
            <span class="tick">${icon('check')}</span>
            <span class="label">${t(`onboard.${s.id}`)}<small>${t(`onboard.${s.id}.desc`)}</small></span>
            ${s.done ? '' : s.href
              ? html`<a class="btn btn-sm btn-glass" href="${s.href}" ${s.external ? raw('target="_blank" rel="noopener"') : ''}>${t('onboard.go')}${icon('arrow-right')}</a>`
              : html`<button class="btn btn-sm btn-glass" data-action="${s.action}">${t('onboard.go')}${icon('arrow-right')}</button>`}
          </li>`)}
        </ul>
      </section>` : ''}

      <section class="grid-4">
        <a class="stat glass" href="#apps"><div class="top"><span class="icon-badge sm">${icon('layout-grid')}</span>${icon('arrow-right', 'go')}</div><div class="value">${a.apps.length}</div><div class="label">${t('stat.apps')}</div></a>
        <a class="stat glass" href="#appareils"><div class="top"><span class="icon-badge sm tone-info">${icon('monitor-smartphone')}</span>${icon('arrow-right', 'go')}</div><div class="value">${a.sessions.length}</div><div class="label">${t('stat.sessions')}</div></a>
        <a class="stat glass" href="#securite"><div class="top"><span class="icon-badge sm tone-ok">${icon('fingerprint-pattern')}</span>${icon('arrow-right', 'go')}</div><div class="value">${a.passkeys.length + a.passcord.length}</div><div class="label">${t('stat.keys')}</div></a>
        <a class="stat glass" href="#activite"><div class="top"><span class="icon-badge sm tone-warn">${icon('clock')}</span>${icon('arrow-right', 'go')}</div><div class="value small-value">${lastLogin ? fmtRelative(lastLogin.at) : '—'}</div><div class="label">${t('stat.last')}</div></a>
      </section>

      <section class="grid-2">
        <div class="card glass">
          <div class="card-head"><div class="grow"><h2 class="card-title">${t('overview.suite')}</h2></div><a class="link-btn" href="#apps">${t('overview.allActivity')}${icon('chevron-right')}</a></div>
          <ul class="list card-body">
            ${state.suite.filter((s) => s.status !== 'soon').concat(a.apps.filter((x) => !state.suite.some((s) => s.slug === x.id)).map((x) => ({ ...x, slug: x.id, status: 'live' }))).slice(0, 4).map((s) => html`<li class="list-item app-row">
              ${appLogo(s)}
              <div class="body"><div class="title">${s.name}</div><div class="meta"><span>${s.tagline ?? ''}</span></div></div>
              ${connected.has(s.slug) ? html`<span class="badge tone-ok">${icon('check')}${t('overview.connected')}</span>` : s.url ? html`<a class="btn btn-sm btn-ghost" href="${s.url}" target="_blank" rel="noopener">${t('overview.discover')}${icon('external-link')}</a>` : statusBadge(s.status)}
            </li>`)}
          </ul>
        </div>
        <div class="card glass">
          <div class="card-head"><div class="grow"><h2 class="card-title">${t('overview.activity')}</h2></div><a class="link-btn" href="#activite">${t('overview.allActivity')}${icon('chevron-right')}</a></div>
          <div class="card-body">${timeline(a.activity.slice(0, 5), { grouped: false })}</div>
        </div>
      </section>
    </div>`;
  },
};

Object.assign(ACTIONS, {
  async 'send-verification'(button) {
    await busy(button, async () => {
      const result = await api('/api/email/send', {});
      toast(t('verify.sent', { email: state.account.user.email }), {
        duration: 8000,
        ...(result.devUrl ? { action: { href: result.devUrl, label: t('auth.devLink') } } : {}),
      });
    });
  },
  'hide-onboarding'() {
    try { localStorage.setItem('cord:onboarding-hidden', '1'); } catch { /* stockage indisponible */ }
    renderShell();
  },
});
