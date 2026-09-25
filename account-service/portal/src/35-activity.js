/* Activité : journal des connexions et des changements du compte. */

messages({
  fr: {
    'activity.title': 'Activité', 'activity.desc': 'Chaque connexion et chaque changement important de ton compte, conservés 180 jours.',
    'activity.filter.all': 'Tout', 'activity.filter.logins': 'Connexions', 'activity.filter.security': 'Sécurité', 'activity.filter.apps': 'Apps',
    'activity.more': 'Charger plus', 'activity.empty': 'Rien à signaler pour l’instant.', 'activity.empty.desc': 'Tes connexions et tes changements apparaîtront ici.',
    'activity.retention': 'Journal conservé 180 jours, visible uniquement par toi. Les adresses IP sont tronquées à l’affichage.',
    'ev.register': 'Compte créé', 'ev.login': 'Connexion', 'ev.login_failed': 'Tentative de connexion refusée',
    'ev.email_verified': 'Adresse email confirmée', 'ev.email_changed': 'Adresse email modifiée',
    'ev.password_changed': 'Mot de passe modifié', 'ev.password_reset': 'Mot de passe réinitialisé', 'ev.password_reset_requested': 'Réinitialisation demandée',
    'ev.mfa_enabled': 'Double authentification activée', 'ev.mfa_disabled': 'Double authentification désactivée',
    'ev.recovery_used': 'Code de secours utilisé', 'ev.recovery_regenerated': 'Codes de secours régénérés',
    'ev.passkey_added': 'Passkey ajoutée', 'ev.passkey_removed': 'Passkey supprimée',
    'ev.passcord_paired': 'iPhone associé à Passcord', 'ev.passcord_revoked': 'iPhone Passcord révoqué',
    'ev.app_authorized': 'App autorisée', 'ev.app_revoked': 'Accès d’une app révoqué',
    'ev.session_revoked': 'Session fermée à distance', 'ev.sessions_revoked': 'Autres sessions fermées',
    'ev.profile_updated': 'Profil mis à jour',
    'ev.beta_joined': 'Bêta rejointe', 'ev.beta_download': 'Build de bêta téléchargé', 'ev.beta_keys_created': 'Clés de bêta générées', 'ev.beta_downloads_configured': 'Installation directe de la bêta activée',
    'via.password': 'mot de passe', 'via.passkey': 'passkey', 'via.passcord': 'Passcord', 'via.reset': 'lien de réinitialisation', 'via.mfa': 'code 2FA incorrect',
    'via.name': 'nom', 'via.avatar': 'photo',
  },
  en: {
    'activity.title': 'Activity', 'activity.desc': 'Every sign-in and every important change to your account, kept for 180 days.',
    'activity.filter.all': 'All', 'activity.filter.logins': 'Sign-ins', 'activity.filter.security': 'Security', 'activity.filter.apps': 'Apps',
    'activity.more': 'Load more', 'activity.empty': 'Nothing to report yet.', 'activity.empty.desc': 'Your sign-ins and changes will show up here.',
    'activity.retention': 'Log kept for 180 days, visible only to you. IP addresses are truncated on display.',
    'ev.register': 'Account created', 'ev.login': 'Signed in', 'ev.login_failed': 'Sign-in attempt refused',
    'ev.email_verified': 'Email address confirmed', 'ev.email_changed': 'Email address changed',
    'ev.password_changed': 'Password changed', 'ev.password_reset': 'Password reset', 'ev.password_reset_requested': 'Password reset requested',
    'ev.mfa_enabled': 'Two-factor authentication on', 'ev.mfa_disabled': 'Two-factor authentication off',
    'ev.recovery_used': 'Recovery code used', 'ev.recovery_regenerated': 'Recovery codes regenerated',
    'ev.passkey_added': 'Passkey added', 'ev.passkey_removed': 'Passkey removed',
    'ev.passcord_paired': 'iPhone paired with Passcord', 'ev.passcord_revoked': 'Passcord iPhone revoked',
    'ev.app_authorized': 'App authorized', 'ev.app_revoked': 'App access revoked',
    'ev.session_revoked': 'Session signed out remotely', 'ev.sessions_revoked': 'Other sessions signed out',
    'ev.profile_updated': 'Profile updated',
    'ev.beta_joined': 'Joined a beta', 'ev.beta_download': 'Beta build downloaded', 'ev.beta_keys_created': 'Beta keys generated', 'ev.beta_downloads_configured': 'Beta direct install turned on',
    'via.password': 'password', 'via.passkey': 'passkey', 'via.passcord': 'Passcord', 'via.reset': 'reset link', 'via.mfa': 'wrong 2FA code',
    'via.name': 'name', 'via.avatar': 'photo',
  },
});

const EVENT_STYLE = {
  register: ['sparkles', ''], login: ['log-in', 'tone-info'], login_failed: ['ban', 'tone-danger'],
  email_verified: ['mail-check', 'tone-ok'], email_changed: ['at-sign', 'tone-warn'],
  password_changed: ['key-round', 'tone-warn'], password_reset: ['rotate-ccw', 'tone-warn'], password_reset_requested: ['mail', 'tone-muted'],
  mfa_enabled: ['shield-check', 'tone-ok'], mfa_disabled: ['shield-alert', 'tone-danger'],
  recovery_used: ['key', 'tone-warn'], recovery_regenerated: ['refresh-cw', 'tone-muted'],
  passkey_added: ['fingerprint-pattern', 'tone-ok'], passkey_removed: ['trash-2', 'tone-muted'],
  passcord_paired: ['smartphone', 'tone-ok'], passcord_revoked: ['trash-2', 'tone-muted'],
  app_authorized: ['app-window', ''], app_revoked: ['ban', 'tone-muted'],
  session_revoked: ['log-out', 'tone-muted'], sessions_revoked: ['log-out', 'tone-muted'], profile_updated: ['pencil', 'tone-muted'],
  beta_joined: ['key-round', 'tone-ok'], beta_download: ['download', 'tone-info'], beta_keys_created: ['key', 'tone-muted'], beta_downloads_configured: ['download', 'tone-ok'],
};
const EVENT_GROUPS = {
  logins: ['register', 'login', 'login_failed', 'session_revoked', 'sessions_revoked'],
  security: ['password_changed', 'password_reset', 'password_reset_requested', 'mfa_enabled', 'mfa_disabled', 'recovery_used', 'recovery_regenerated', 'passkey_added', 'passkey_removed', 'passcord_paired', 'passcord_revoked', 'email_changed', 'email_verified'],
  apps: ['app_authorized', 'app_revoked', 'beta_joined', 'beta_download', 'beta_keys_created', 'beta_downloads_configured'],
};

function eventDetail(e) {
  if (!e.detail) return '';
  if (['login', 'register', 'login_failed', 'profile_updated'].includes(e.kind)) return MESSAGES[locale][`via.${e.detail}`] ? t(`via.${e.detail}`) : '';
  if (e.kind === 'sessions_revoked') return `× ${e.detail}`;
  return e.detail;
}

function dayLabel(ms) {
  const d = new Date(ms);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400_000);
  if (d.toDateString() === today.toDateString()) return t('common.today');
  if (d.toDateString() === yesterday.toDateString()) return t('common.yesterday');
  return fmtDate(ms);
}

function timeline(events, { grouped = true } = {}) {
  if (!events.length) return emptyState({ iconName: 'history', title: t('activity.empty'), desc: t('activity.empty.desc') });
  let lastDay = '';
  return html`<ol class="timeline">${events.map((e, i) => {
    const [iconName, tone] = EVENT_STYLE[e.kind] ?? ['activity', 'tone-muted'];
    const day = dayLabel(e.at);
    const header = grouped && day !== lastDay ? html`<li class="day" aria-hidden="false">${day}</li>` : '';
    lastDay = day;
    const detail = eventDetail(e);
    const next = events[i + 1];
    const last = !next || (grouped && dayLabel(next.at) !== day);
    return html`${header}<li class="event ${last ? 'last' : ''}">
      <span class="icon-badge ${tone}">${icon(iconName)}</span>
      <div class="body">
        <p class="what">${t(`ev.${e.kind}`)}${detail ? html` <em>· ${detail}</em>` : ''}</p>
        <p class="meta">${e.device ? html`<span>${e.device.label}</span>` : ''}${e.ip ? html`<span class="mono">${e.ip}</span>` : ''}</p>
      </div>
      <time datetime="${new Date(e.at).toISOString()}" title="${fmtDateTime(e.at)}">${grouped ? fmtTime(e.at) : fmtRelative(e.at)}</time>
    </li>`;
  })}</ol>`;
}

const activityState = { filter: 'all', events: null, more: false };

VIEWS.activite = {
  render(a) {
    const events = activityState.events ?? a.activity;
    const shown = activityState.filter === 'all' ? events : events.filter((e) => EVENT_GROUPS[activityState.filter].includes(e.kind));
    return html`<div class="view">
      ${pageHead({ eyebrow: t('nav.section.data'), title: t('activity.title'), desc: t('activity.desc') })}
      <div class="filters" role="group" aria-label="${t('activity.title')}">
        ${['all', 'logins', 'security', 'apps'].map((f) => html`<button class="chip" data-action="activity-filter" data-filter="${f}" aria-pressed="${String(activityState.filter === f)}">${t(`activity.filter.${f}`)}</button>`)}
      </div>
      <section class="card glass">
        ${timeline(shown)}
        ${(activityState.events ? activityState.more : a.activity.length >= 40) ? html`<div class="card-foot"><button class="btn btn-glass btn-sm" data-action="activity-more">${icon('chevron-down')}${t('activity.more')}</button></div>` : ''}
      </section>
      <p class="tiny subtle row">${icon('info')}<span>${t('activity.retention')}</span></p>
    </div>`;
  },
};

Object.assign(ACTIONS, {
  'activity-filter'(button) {
    activityState.filter = button.dataset.filter;
    renderShell();
  },
  async 'activity-more'(button) {
    await busy(button, async () => {
      const current = activityState.events ?? state.account.activity;
      const before = current.at(-1)?.at ?? Date.now();
      const page = await api(`/api/activity?before=${before}`);
      activityState.events = [...current, ...page.events];
      activityState.more = page.more;
    });
    renderShell();
  },
});
