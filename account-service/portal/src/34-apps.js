/* Apps : applications connectées (OAuth) et catalogue de la suite. */

messages({
  fr: {
    'apps.title': 'Apps', 'apps.desc': 'Les apps auxquelles tu t’es connecté avec ton compte Cord, et ce qu’elles peuvent voir.',
    'apps.connected': 'Apps connectées', 'apps.empty': 'Aucune app connectée', 'apps.emptyDesc': 'Sur Drivecord et les autres apps de la suite, choisis « Continuer avec Cord » : elles apparaîtront ici.',
    'apps.tryDrivecord': 'Essayer Drivecord', 'apps.granted': 'Autorisée {when}', 'apps.used': 'Dernière connexion {when}',
    'apps.revoke': 'Révoquer l’accès', 'apps.revokeTitle': 'Révoquer l’accès de {app} ?',
    'apps.revokeDesc': '{app} ne pourra plus lire ton profil Cord et te redemandera l’autorisation à la prochaine connexion. Tes données dans {app} ne sont pas supprimées.',
    'apps.revoked': 'Accès de {app} révoqué.', 'apps.suite': 'La suite Cord', 'apps.suiteDesc': 'Toutes les apps qui utilisent ton Compte Cord.',
    'scope.openid': 'Identifiant Cord', 'scope.profile': 'Nom et photo', 'scope.email': 'Adresse email',
  },
  en: {
    'apps.title': 'Apps', 'apps.desc': 'Apps you signed in to with your Cord account, and what they can see.',
    'apps.connected': 'Connected apps', 'apps.empty': 'No connected apps', 'apps.emptyDesc': 'On Drivecord and the other suite apps, pick “Continue with Cord”: they’ll show up here.',
    'apps.tryDrivecord': 'Try Drivecord', 'apps.granted': 'Authorized {when}', 'apps.used': 'Last sign-in {when}',
    'apps.revoke': 'Revoke access', 'apps.revokeTitle': 'Revoke {app}’s access?',
    'apps.revokeDesc': '{app} will no longer read your Cord profile and will ask for permission on your next sign-in. Your data inside {app} isn’t deleted.',
    'apps.revoked': '{app}’s access revoked.', 'apps.suite': 'The Cord suite', 'apps.suiteDesc': 'Every app that uses your Cord account.',
    'scope.openid': 'Cord ID', 'scope.profile': 'Name and photo', 'scope.email': 'Email address',
  },
});

const SCOPE_ICONS = { openid: 'id-card', profile: 'user-round', email: 'at-sign' };

VIEWS.apps = {
  render(a) {
    return html`<div class="view">
      ${pageHead({ eyebrow: t('nav.section.account'), title: t('apps.title'), desc: t('apps.desc') })}
      <section class="card glass">
        <div class="card-head"><span class="icon-badge grad">${icon('app-window')}</span><div class="grow"><h2 class="card-title">${t('apps.connected')}</h2></div></div>
        <div class="card-body">
          ${a.apps.length
            ? html`<ul class="list">${a.apps.map((app) => html`<li class="list-item app-row">
                ${appLogo(app)}
                <div class="body">
                  <div class="title">${app.name}${app.firstParty ? html`<span class="badge badge-accent">${icon('badge-check')}Cord</span>` : ''}</div>
                  <div class="meta"><span>${t('apps.granted', { when: fmtDateShort(app.grantedAt) })}</span><span>${t('apps.used', { when: fmtRelative(app.lastUsedAt) })}</span></div>
                  <div class="scopes">${app.scope.split(' ').map((s) => html`<span class="chip">${icon(SCOPE_ICONS[s] ?? 'info')}${t(`scope.${s}`)}</span>`)}</div>
                </div>
                <div class="actions">
                  ${app.url ? html`<a class="btn btn-ghost btn-sm" href="${app.url}" target="_blank" rel="noopener">${t('common.open')}${icon('external-link')}</a>` : ''}
                  <button class="btn btn-danger btn-sm" data-action="app-revoke" data-id="${app.id}" data-name="${app.name}">${t('apps.revoke')}</button>
                </div>
              </li>`)}</ul>`
            : emptyState({ iconName: 'app-window', title: t('apps.empty'), desc: t('apps.emptyDesc'), action: html`<a class="btn btn-primary btn-sm" href="https://drivecord.app" target="_blank" rel="noopener">${t('apps.tryDrivecord')}${icon('external-link')}</a>` })}
        </div>
      </section>
      <div class="section-title"><h2>${t('apps.suite')}</h2></div>
      <div class="suite-grid">${state.suite.map((app) => suiteTile(app))}</div>
    </div>`;
  },
};

Object.assign(ACTIONS, {
  async 'app-revoke'(button) {
    const name = button.dataset.name;
    const ok = await confirmDialog({ title: t('apps.revokeTitle', { app: name }), desc: t('apps.revokeDesc', { app: name }), confirm: t('apps.revoke'), iconName: 'ban' });
    if (!ok) return;
    await api('/api/connected-apps', { clientId: button.dataset.id }, 'DELETE');
    toast(t('apps.revoked', { app: name }), { type: 'info' });
    refresh();
  },
});
