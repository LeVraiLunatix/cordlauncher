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
    'betaApp.title': 'Bêta fermée de Passcord', 'betaApp.desc': 'Tu as reçu une clé d’accès ? Entre-la pour rejoindre les premiers testeurs.',
    'betaApp.key': 'Clé d’accès', 'betaApp.join': 'Rejoindre la bêta', 'betaApp.joined': 'Bienvenue dans la bêta de {name} !', 'betaApp.already': 'Tu fais déjà partie de la bêta.',
    'betaApp.member': 'Testeur', 'betaApp.memberDesc': 'Télécharge l’app puis installe-la avec AltStore, ou depuis CordLauncher (Installer sur iPhone).',
    'betaApp.build': '{build} · publié {when}', 'betaApp.loading': 'Recherche du dernier build…', 'betaApp.none': 'Aucun build publié pour le moment.',
    'betaApp.soon': 'Le téléchargement direct arrive bientôt : en attendant, demande l’IPA à l’administrateur.',
    'betaApp.download': 'Télécharger', 'betaApp.unverified': 'Confirme d’abord ton adresse email pour utiliser une clé.',
    'asset.Passcord.ipa': 'App, extension Safari et clavier — recommandé', 'asset.Passcord-sans-clavier.ipa': 'App et extension Safari, sans clavier',
    'asset.Passcord-autofill.ipa': 'Avec le remplissage automatique — compte Apple Developer payant requis',
    'reason.beta_key_invalid': 'Clé inconnue. Vérifie-la caractère par caractère (ex. PASS-7KQM-2XVD-9HRT).', 'reason.beta_key_used': 'Cette clé a déjà été utilisée.',
    'reason.beta_key_expired': 'Cette clé a expiré.', 'reason.beta_key_revoked': 'Cette clé a été désactivée.', 'reason.beta_required': 'Cette bêta demande une clé d’accès.',
  },
  en: {
    'apps.title': 'Apps', 'apps.desc': 'Apps you signed in to with your Cord account, and what they can see.',
    'apps.connected': 'Connected apps', 'apps.empty': 'No connected apps', 'apps.emptyDesc': 'On Drivecord and the other suite apps, pick “Continue with Cord”: they’ll show up here.',
    'apps.tryDrivecord': 'Try Drivecord', 'apps.granted': 'Authorized {when}', 'apps.used': 'Last sign-in {when}',
    'apps.revoke': 'Revoke access', 'apps.revokeTitle': 'Revoke {app}’s access?',
    'apps.revokeDesc': '{app} will no longer read your Cord profile and will ask for permission on your next sign-in. Your data inside {app} isn’t deleted.',
    'apps.revoked': '{app}’s access revoked.', 'apps.suite': 'The Cord suite', 'apps.suiteDesc': 'Every app that uses your Cord account.',
    'scope.openid': 'Cord ID', 'scope.profile': 'Name and photo', 'scope.email': 'Email address',
    'betaApp.title': 'Passcord closed beta', 'betaApp.desc': 'Got an access key? Enter it to join the first testers.',
    'betaApp.key': 'Access key', 'betaApp.join': 'Join the beta', 'betaApp.joined': 'Welcome to the {name} beta!', 'betaApp.already': 'You’re already in the beta.',
    'betaApp.member': 'Tester', 'betaApp.memberDesc': 'Download the app, then install it with AltStore or from CordLauncher (Install on iPhone).',
    'betaApp.build': '{build} · published {when}', 'betaApp.loading': 'Looking for the latest build…', 'betaApp.none': 'No build published yet.',
    'betaApp.soon': 'Direct download is coming soon: meanwhile, ask the admin for the IPA.',
    'betaApp.download': 'Download', 'betaApp.unverified': 'Confirm your email address first to redeem a key.',
    'asset.Passcord.ipa': 'App, Safari extension and keyboard — recommended', 'asset.Passcord-sans-clavier.ipa': 'App and Safari extension, no keyboard',
    'asset.Passcord-autofill.ipa': 'With system AutoFill — paid Apple Developer account required',
    'reason.beta_key_invalid': 'Unknown key. Check it character by character (e.g. PASS-7KQM-2XVD-9HRT).', 'reason.beta_key_used': 'This key has already been used.',
    'reason.beta_key_expired': 'This key has expired.', 'reason.beta_key_revoked': 'This key has been disabled.', 'reason.beta_required': 'This beta requires an access key.',
  },
});

const SCOPE_ICONS = { openid: 'id-card', profile: 'user-round', email: 'at-sign' };
const betaState = { info: null, loading: false };
const fmtSize = (bytes) => `${(bytes / 1_000_000).toLocaleString(intlLocale(), { maximumFractionDigits: 1 })} Mo`;

function betaCard(a) {
  const member = (a.user.beta ?? []).includes('passcord');
  const info = betaState.info;
  const logo = html`<img class="device-logo" src="/assets/logos/passcord.png" alt="" width="42" height="42">`;
  if (!member) {
    return html`<section class="card glass">
      <div class="card-head">${logo}<div class="grow"><h2 class="card-title">${t('betaApp.title')}</h2><p class="card-desc">${t(a.user.emailVerified ? 'betaApp.desc' : 'betaApp.unverified')}</p></div></div>
      <form id="beta-redeem" class="card-body beta-redeem" novalidate>
        <div class="field"><label for="beta-code">${t('betaApp.key')}</label>
          <input class="input" id="beta-code" name="code" placeholder="PASS-XXXX-XXXX-XXXX" autocomplete="off" spellcheck="false" autocapitalize="characters" maxlength="40" required ${a.user.emailVerified ? '' : raw('disabled')}></div>
        <button class="btn btn-primary" type="submit" ${a.user.emailVerified ? '' : raw('disabled')}>${icon('key-round')}${t('betaApp.join')}</button>
      </form>
    </section>`;
  }
  return html`<section class="card glass">
    <div class="card-head">${logo}<div class="grow"><h2 class="card-title">${t('betaApp.title')} <span class="badge tone-ok">${icon('badge-check')}${t('betaApp.member')}</span></h2>
      <p class="card-desc">${t('betaApp.memberDesc')}</p></div></div>
    <div class="card-body">${
      !info ? html`<p class="subtle">${t('betaApp.loading')}</p>`
      : !info.downloads ? html`<p class="subtle">${t('betaApp.soon')}</p>`
      : !info.release ? html`<p class="subtle">${t('betaApp.none')}</p>`
      : html`<p class="tiny subtle mono">${t('betaApp.build', { build: info.release.build, when: fmtRelative(info.release.publishedAt) })}</p>
        <ul class="list">${[...info.release.assets].sort((x, y) => (x.name === 'Passcord.ipa' ? -1 : y.name === 'Passcord.ipa' ? 1 : 0)).map((asset) => html`<li class="list-item">
          <span class="icon-badge sm ${asset.name === 'Passcord.ipa' ? 'grad' : ''}">${icon('smartphone')}</span>
          <div class="body"><div class="title mono">${asset.name}</div><div class="meta"><span>${MESSAGES[locale][`asset.${asset.name}`] ? t(`asset.${asset.name}`) : ''}</span><span>${fmtSize(asset.size)}</span></div></div>
          <div class="actions"><button class="btn ${asset.name === 'Passcord.ipa' ? 'btn-primary' : 'btn-glass'} btn-sm" data-action="beta-download" data-asset="${asset.name}">${icon('download')}${t('betaApp.download')}</button></div>
        </li>`)}</ul>`
    }</div>
  </section>`;
}

async function loadBetaInfo() {
  betaState.loading = true;
  try {
    betaState.info = await api('/api/beta/passcord');
    if (state.route === 'apps') renderShell();
  } catch (e) {
    toastError(e);
  } finally {
    betaState.loading = false;
  }
}

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
      ${betaCard(a)}
      <div class="section-title"><h2>${t('apps.suite')}</h2></div>
      <div class="suite-grid">${state.suite.map((app) => suiteTile(app))}</div>
    </div>`;
  },
  mount(root) {
    if ((state.account?.user.beta ?? []).includes('passcord') && !betaState.info && !betaState.loading) loadBetaInfo();
    const form = $('#beta-redeem', root);
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('#beta-code', form);
      if (!input.value.trim()) return input.focus();
      try {
        const result = await busy(event.submitter ?? $('[type="submit"]', form), () => api('/api/beta/redeem', { code: input.value }));
        toast(result.already ? t('betaApp.already') : t('betaApp.joined', { name: result.name }));
        if (!result.already) celebrate();
        betaState.info = null;
        await refresh();
      } catch (e) {
        input.setAttribute('aria-invalid', 'true');
        toastError(e);
      }
    });
  },
};

Object.assign(ACTIONS, {
  async 'beta-download'(button) {
    const { url } = await busy(button, () => api('/api/beta/passcord/download', { asset: button.dataset.asset }));
    // Lien signé et temporaire vers le fichier : le navigateur le télécharge directement.
    location.href = url;
  },
  async 'app-revoke'(button) {
    const name = button.dataset.name;
    const ok = await confirmDialog({ title: t('apps.revokeTitle', { app: name }), desc: t('apps.revokeDesc', { app: name }), confirm: t('apps.revoke'), iconName: 'ban' });
    if (!ok) return;
    await api('/api/connected-apps', { clientId: button.dataset.id }, 'DELETE');
    toast(t('apps.revoked', { app: name }), { type: 'info' });
    refresh();
  },
});
