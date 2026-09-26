/* Accueil : la Carte Cord, la suite (état remonté par chaque app), le fil commun. */

messages({
  fr: {
    'hello.morning': 'Bonjour, {name}', 'hello.evening': 'Bonsoir, {name}', 'hello.night': 'Encore debout, {name} ?',
    'hello.since': 'Membre depuis {date}', 'hello.verified': 'Email vérifié', 'hello.unverified': 'Email à confirmer',
    'verify.title': 'Confirme ton adresse email', 'verify.desc': 'Indispensable pour te connecter aux apps de la suite avec ton compte Cord.',
    'verify.send': 'Envoyer le code', 'verify.sent': 'Code envoyé à {email}. Il est valable 15 minutes.',
    'verify.code': 'Code reçu par email', 'verify.submit': 'Valider', 'verify.done': 'Adresse confirmée. Ton compte Cord est prêt !',
    'verify.resend': 'Renvoyer', 'verify.hint': 'Tape les 6 chiffres reçus, ou clique sur le lien de l’email.',
    'onboard.title': 'Bien démarrer', 'onboard.desc': '{done} sur {total}',
    'onboard.hide': 'Masquer', 'onboard.complete': 'Ton compte est prêt. Beau travail !',
    'onboard.email': 'Confirmer ton adresse email', 'onboard.email.desc': 'Pour utiliser Cord dans les apps.',
    'onboard.key': 'Associer Passcord ou une passkey', 'onboard.key.desc': 'Connexion sans mot de passe, validée par Face ID.',
    'onboard.mfa': 'Activer la double authentification', 'onboard.mfa.desc': 'Un code à usage unique en plus du mot de passe.',
    'onboard.avatar': 'Ajouter une photo', 'onboard.avatar.desc': 'Pour te reconnaître d’un coup d’œil dans les apps.',
    'onboard.app': 'Connecter une app', 'onboard.app.desc': 'Drivecord t’attend avec « Continuer avec Cord ».',
    'onboard.go': 'Y aller',
    'card.brand': 'Compte Cord', 'card.since': 'Membre depuis', 'card.id': 'Identifiant', 'card.apps': 'Apps reliées',
    'today.title': 'Aujourd’hui', 'today.next': 'Prochaine étape', 'today.ready': 'Tout est en ordre',
    'today.readyDesc': 'Ton compte est protégé et relié à ta suite.', 'today.unread': 'non lue(s)', 'today.sessions': 'session(s) ouverte(s)',
    'suite.title': 'Ta suite', 'suite.desc': 'Chaque app reliée à ton compte Cord te montre où tu en es, et s’ouvre déjà connectée.',
    'suite.open': 'Ouvrir', 'suite.start': 'Commencer avec Cord', 'suite.connected': 'Reliée', 'suite.notYet': 'Pas encore utilisée',
    'suite.idle': 'Reliée à ton compte. Ouvre-la pour que son résumé apparaisse ici.',
    'suite.betaJoin': 'Rejoindre la bêta', 'suite.betaIn': 'Tu es testeur', 'suite.betaDesc': 'Bêta fermée, sur invitation.',
    'suite.soon': 'Bientôt dans la suite', 'suite.updated': 'Mis à jour {when}',
    'suite.launcher': 'CordLauncher', 'suite.launcherDesc': 'Installe et met à jour la suite sur Windows.',
    'feed.title': 'Fil de la suite', 'feed.desc': 'Ce que tes apps t’envoient et ce qui se passe sur ton compte.', 'feed.all': 'Tout voir',
    'feed.empty': 'Rien pour l’instant', 'feed.emptyDesc': 'Les nouvelles de tes apps et de ton compte arriveront ici.',
  },
  en: {
    'hello.morning': 'Hello, {name}', 'hello.evening': 'Good evening, {name}', 'hello.night': 'Still up, {name}?',
    'hello.since': 'Member since {date}', 'hello.verified': 'Email verified', 'hello.unverified': 'Email to confirm',
    'verify.title': 'Confirm your email address', 'verify.desc': 'Required to sign in to the suite’s apps with your Cord account.',
    'verify.send': 'Send the code', 'verify.sent': 'Code sent to {email}. It’s valid for 15 minutes.',
    'verify.code': 'Code from the email', 'verify.submit': 'Confirm', 'verify.done': 'Address confirmed. Your Cord account is ready!',
    'verify.resend': 'Resend', 'verify.hint': 'Type the 6 digits you received, or click the link in the email.',
    'onboard.title': 'Get started', 'onboard.desc': '{done} of {total}',
    'onboard.hide': 'Hide', 'onboard.complete': 'Your account is ready. Nice work!',
    'onboard.email': 'Confirm your email address', 'onboard.email.desc': 'To use Cord in the apps.',
    'onboard.key': 'Pair Passcord or a passkey', 'onboard.key.desc': 'Passwordless sign-in, approved with Face ID.',
    'onboard.mfa': 'Turn on two-factor authentication', 'onboard.mfa.desc': 'A one-time code on top of your password.',
    'onboard.avatar': 'Add a photo', 'onboard.avatar.desc': 'So apps can show who you are at a glance.',
    'onboard.app': 'Connect an app', 'onboard.app.desc': 'Drivecord is waiting with “Continue with Cord”.',
    'onboard.go': 'Go',
    'card.brand': 'Cord Account', 'card.since': 'Member since', 'card.id': 'Identifier', 'card.apps': 'Linked apps',
    'today.title': 'Today', 'today.next': 'Next step', 'today.ready': 'All set',
    'today.readyDesc': 'Your account is protected and linked to your suite.', 'today.unread': 'unread', 'today.sessions': 'open session(s)',
    'suite.title': 'Your suite', 'suite.desc': 'Every app linked to your Cord account shows where you’re at, and opens already signed in.',
    'suite.open': 'Open', 'suite.start': 'Start with Cord', 'suite.connected': 'Linked', 'suite.notYet': 'Not used yet',
    'suite.idle': 'Linked to your account. Open it and its summary will show up here.',
    'suite.betaJoin': 'Join the beta', 'suite.betaIn': 'You’re a tester', 'suite.betaDesc': 'Closed beta, invite only.',
    'suite.soon': 'Coming to the suite', 'suite.updated': 'Updated {when}',
    'suite.launcher': 'CordLauncher', 'suite.launcherDesc': 'Installs and updates the suite on Windows.',
    'feed.title': 'Suite feed', 'feed.desc': 'What your apps send you and what happens on your account.', 'feed.all': 'See all',
    'feed.empty': 'Nothing yet', 'feed.emptyDesc': 'News from your apps and your account will land here.',
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
    { id: 'app', done: a.apps.length > 0, href: 'https://drivecord.app/login?via=cord', external: true },
  ];
}

/** Identifiant lisible et stable, dérivé de l'id interne (CORD·4F2A·91C3). */
function cordId(id) {
  const h = hashString(id).toString(16).toUpperCase().padStart(8, '0').slice(-8);
  return `CORD·${h.slice(0, 4)}·${h.slice(4)}`;
}

function verifyCard(a) {
  if (a.user.emailVerified) return '';
  return html`<section class="verify-strip glass" role="status">
    <span class="icon-badge tone-warn">${icon('mail')}</span>
    <div class="grow"><p class="title">${t('verify.title')}</p><p class="desc">${t('verify.hint')}</p></div>
    <form id="verify-code" class="verify-form" novalidate>
      <input class="input input-otp" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="••••••" aria-label="${t('verify.code')}" required>
      <button class="btn btn-primary" type="submit">${t('verify.submit')}</button>
      <button class="btn btn-ghost btn-sm" type="button" data-action="send-verification">${t('verify.resend')}</button>
    </form>
  </section>`;
}

function cordCard(a, score, linked) {
  const since = new Intl.DateTimeFormat(intlLocale(), { month: 'short', year: 'numeric' }).format(new Date(a.user.createdAt));
  return html`<section class="cord-card" data-tilt>
    <span class="cc-holo" aria-hidden="true"></span><span class="cc-shine" aria-hidden="true"></span>
    <div class="cc-top">
      <img src="/assets/icon-180.png" alt="" width="30" height="30">
      <span class="cc-brand">${t('card.brand')}</span>
      <a class="cc-level tone-${score.tone}" href="#securite">${icon('shield-check')}${score.label}</a>
    </div>
    <div class="cc-id">
      <div class="avatar-ring avatar-xl">${avatar(a.user)}</div>
      <div class="cc-who">
        <h1 tabindex="-1" data-page-title>${greeting(a.user.name)}</h1>
        <p><span class="break">${a.user.email}</span>${a.user.emailVerified ? html`<span class="cc-check" title="${t('hello.verified')}">${icon('badge-check')}</span>` : ''}</p>
      </div>
    </div>
    <dl class="cc-bottom">
      <div><dt>${t('card.since')}</dt><dd>${since}</dd></div>
      <div><dt>${t('card.id')}</dt><dd class="mono">${cordId(a.user.id)}</dd></div>
      <div><dt>${t('card.apps')}</dt><dd>${linked}</dd></div>
      <span class="cc-chip" aria-hidden="true"></span>
    </dl>
  </section>`;
}

function todayPanel(a, score, hub) {
  const steps = onboardingSteps(a);
  const next = steps.find((s) => !s.done);
  const done = steps.filter((s) => s.done).length;
  const unread = hub?.unread ?? a.unread ?? 0;
  return html`<section class="today glass">
    <div class="today-head"><p class="eyebrow">${t('today.title')} · ${fmtDate(Date.now())}</p></div>
    <a class="today-score" href="#securite">${scoreRing(score.value, { size: 84, stroke: 8, caption: t('score.label') })}<span><strong>${score.label}</strong><small>${t('onboard.desc', { done, total: steps.length })}</small></span></a>
    ${next
      ? html`<div class="today-next"><p class="eyebrow">${t('today.next')}</p><p class="title">${t(`onboard.${next.id}`)}</p><p class="desc">${t(`onboard.${next.id}.desc`)}</p>
          ${next.href
            ? html`<a class="btn btn-primary btn-sm" href="${next.href}" ${next.external ? raw('target="_blank" rel="noopener"') : ''}>${t('onboard.go')}${icon('arrow-right')}</a>`
            : html`<button class="btn btn-primary btn-sm" data-action="${next.action}">${t('onboard.go')}${icon('arrow-right')}</button>`}</div>`
      : html`<div class="today-next done"><p class="title">${icon('circle-check')}${t('today.ready')}</p><p class="desc">${t('today.readyDesc')}</p></div>`}
    <div class="today-counters">
      <button type="button" class="counter" data-action="inbox"><strong>${unread}</strong><span>${icon('bell')}${t('today.unread')}</span></button>
      <a class="counter" href="#appareils"><strong>${a.sessions.length}</strong><span>${icon('monitor-smartphone')}${t('today.sessions')}</span></a>
    </div>
  </section>`;
}

function appTile(app) {
  const s = app.appStatus;
  const beta = app.beta;
  const soon = app.status === 'soon';
  const wide = app.connected && s;
  let body;
  let actions;
  if (beta && !app.connected) {
    body = html`<p class="tile-headline">${beta.access ? t('suite.betaIn') : t('suite.betaDesc')}</p>`;
    actions = html`<a class="btn btn-sm ${beta.access ? 'btn-primary' : 'btn-glass'}" href="#apps">${beta.access ? t('suite.open') : t('suite.betaJoin')}${icon('arrow-right')}</a>`;
  } else if (app.connected && s) {
    body = html`<p class="tile-headline">${s.headline}</p>${s.detail ? html`<p class="tile-detail">${s.detail}</p>` : ''}
      ${s.metrics?.length ? html`<div class="tile-metrics">${s.metrics.map((m) => html`<span><strong>${m.value}</strong>${m.label}</span>`)}</div>` : ''}
      <p class="tile-updated">${t('suite.updated', { when: fmtRelative(s.updatedAt) })}</p>`;
    actions = app.launch ? html`<a class="btn btn-sm btn-primary" href="${s.url ?? app.launch}" target="_blank" rel="noopener">${t('suite.open')}${icon('arrow-up-right')}</a>` : '';
  } else if (app.connected) {
    body = html`<p class="tile-detail">${t('suite.idle')}</p>`;
    actions = app.launch ? html`<a class="btn btn-sm btn-primary" href="${app.launch}" target="_blank" rel="noopener">${t('suite.open')}${icon('arrow-up-right')}</a>` : '';
  } else {
    body = html`<p class="tile-detail">${app.description}</p>`;
    actions = app.launch ? html`<a class="btn btn-sm btn-glass" href="${app.launch}" target="_blank" rel="noopener">${t('suite.start')}${icon('arrow-up-right')}</a>` : '';
  }
  return html`<article class="tile ${wide ? 'wide' : ''} ${soon ? 'soon' : ''} ${app.connected ? 'is-linked' : ''}" data-accent="${app.accent.join(',')}">
    <span class="tile-glow" aria-hidden="true"></span>
    <header><img src="${app.logo}" alt="" width="44" height="44" loading="lazy"><div class="grow"><h3>${app.name}</h3><p>${app.tagline}</p></div>
      ${app.connected ? html`<span class="badge tone-ok"><span class="dot"></span>${t('suite.connected')}</span>` : beta ? html`<span class="badge tone-warn">Bêta</span>` : ''}</header>
    <div class="tile-body">${body}</div>
    ${actions ? html`<footer>${actions}</footer>` : ''}
  </article>`;
}

function suiteSection(hub) {
  if (!hub) return html`<section class="bento">${[1, 2, 3].map(() => html`<div class="skeleton tile-sk"></div>`)}</section>`;
  const active = hub.apps.filter((a) => a.status !== 'soon');
  const soon = hub.apps.filter((a) => a.status === 'soon');
  // Les apps reliées d'abord, celles avec un résumé en tête.
  active.sort((x, y) => Number(Boolean(y.connected)) - Number(Boolean(x.connected)) || Number(Boolean(y.appStatus)) - Number(Boolean(x.appStatus)));
  const launcher = hub.launcher;
  return html`<section class="suite">
    <div class="section-head"><div><h2>${t('suite.title')}</h2><p>${t('suite.desc')}</p></div></div>
    <div class="bento">
      ${active.map((app) => appTile(app))}
      ${launcher ? html`<article class="tile is-linked" data-accent="#6e58f0,#b842ec">
        <span class="tile-glow" aria-hidden="true"></span>
        <header><img src="/assets/icon-180.png" alt="" width="44" height="44"><div class="grow"><h3>${t('suite.launcher')}</h3><p>${t('suite.launcherDesc')}</p></div><span class="badge tone-ok"><span class="dot"></span>${t('suite.connected')}</span></header>
        <div class="tile-body"><p class="tile-headline">${launcher.headline}</p>${launcher.detail ? html`<p class="tile-detail">${launcher.detail}</p>` : ''}
          ${launcher.metrics?.length ? html`<div class="tile-metrics">${launcher.metrics.map((m) => html`<span><strong>${m.value}</strong>${m.label}</span>`)}</div>` : ''}
          <p class="tile-updated">${t('suite.updated', { when: fmtRelative(launcher.updatedAt) })}</p></div>
      </article>` : ''}
    </div>
    ${soon.length ? html`<div class="soon-row"><span class="eyebrow">${t('suite.soon')}</span>${soon.map((app) => html`<span class="soon-chip" data-accent="${app.accent.join(',')}" title="${app.description}"><img src="${app.logo}" alt="" width="22" height="22" loading="lazy">${app.name}</span>`)}</div>` : ''}
  </section>`;
}

function feedSection(a) {
  const notes = (inboxState.items ?? []).slice(0, 8).map((n) => ({ at: n.createdAt, note: n }));
  const events = a.activity.slice(0, 8).map((e) => ({ at: e.at, event: e }));
  const items = [...notes, ...events].sort((x, y) => y.at - x.at).slice(0, 8);
  return html`<section class="feed glass">
    <div class="card-head"><div class="grow"><h2 class="card-title">${t('feed.title')}</h2><p class="card-desc">${t('feed.desc')}</p></div><a class="link-btn" href="#activite">${t('feed.all')}${icon('chevron-right')}</a></div>
    ${items.length
      ? html`<ol class="feed-list">${items.map((it) => it.note
          ? html`<li class="${it.note.readAt ? '' : 'unread'}"><img class="feed-logo" src="${it.note.logo ?? '/assets/icon-180.png'}" alt="" width="34" height="34">
              <div class="grow"><p class="what"><strong>${it.note.name}</strong> · ${it.note.title}</p>${it.note.body ? html`<p class="more">${it.note.body}</p>` : ''}</div>
              <time>${fmtRelative(it.at)}</time>${it.note.url ? html`<a class="btn btn-ghost btn-icon btn-sm" href="${it.note.url}" target="_blank" rel="noopener" aria-label="${t('suite.open')}">${icon('arrow-up-right')}</a>` : ''}</li>`
          : (() => { const [ic, tone] = EVENT_STYLE[it.event.kind] ?? ['activity', 'tone-muted']; return html`<li><span class="icon-badge sm ${tone}">${icon(ic)}</span>
              <div class="grow"><p class="what">${t(`ev.${it.event.kind}`)}</p>${it.event.device ? html`<p class="more">${it.event.device.label}</p>` : ''}</div><time>${fmtRelative(it.at)}</time></li>`; })())}</ol>`
      : emptyState({ iconName: 'orbit', title: t('feed.empty'), desc: t('feed.emptyDesc') })}
  </section>`;
}

VIEWS.apercu = {
  render(a) {
    const score = securityScore(a);
    const hub = state.hub;
    const linked = hub ? hub.apps.filter((x) => x.connected).length : a.apps.length;
    return html`<div class="view hub">
      ${verifyCard(a)}
      <div class="hub-hero">${cordCard(a, score, linked)}${todayPanel(a, score, hub)}</div>
      ${suiteSection(hub)}
      ${feedSection(a)}
    </div>`;
  },
  mount(root) {
    if (!inboxState.items && !inboxState.loading) loadInbox().then(() => { if (state.route === 'apercu') renderShell(); });
    const form = $('#verify-code', root);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('[name="code"]', form);
      try {
        await busy(event.submitter ?? $('[type="submit"]', form), () => api('/api/email/verify-code', { code: input.value }));
        celebrate();
        toast(t('verify.done'));
        await refresh();
      } catch (e) {
        input.setAttribute('aria-invalid', 'true');
        input.select();
        toastError(e);
      }
    });
  },
};

// Carte Cord : légère inclinaison 3D et reflet qui suivent le pointeur.
document.addEventListener('pointermove', (event) => {
  const card = event.target.closest?.('[data-tilt]');
  if (!card || event.pointerType === 'touch' || reducedMotion()) return;
  const r = card.getBoundingClientRect();
  const x = (event.clientX - r.left) / r.width;
  const y = (event.clientY - r.top) / r.height;
  card.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
  card.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
  card.style.setProperty('--px', `${(x * 100).toFixed(1)}%`);
  card.style.setProperty('--py', `${(y * 100).toFixed(1)}%`);
}, { passive: true });
document.addEventListener('pointerout', (event) => {
  const card = event.target.closest?.('[data-tilt]');
  if (!card || card.contains(event.relatedTarget)) return;
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
});

Object.assign(ACTIONS, {
  async 'send-verification'(button) {
    await busy(button, async () => {
      const result = await api('/api/email/send', {});
      toast(t('verify.sent', { email: state.account?.user.email ?? '' }), {
        duration: 8000,
        ...(result.devUrl ? { action: { href: result.devUrl, label: t('auth.devLink') } } : {}),
      });
      if (result.devCode) console.info('[dev] code email :', result.devCode);
    });
    if (state.route === 'apercu') $('#verify-code [name="code"]')?.focus();
  },
  'hide-onboarding'() {
    try { localStorage.setItem('cord:onboarding-hidden', '1'); } catch { /* stockage indisponible */ }
    renderShell();
  },
});
