/* Administration (propriétaire uniquement, CORD_ADMINS) : statistiques, clients OAuth et bêta fermée de Passcord. */

messages({
  fr: {
    'admin.title': 'Administration', 'admin.desc': 'Vue d’ensemble du Compte Cord. Aucune donnée personnelle n’est affichée ici.',
    'admin.tab.overview': 'Vue d’ensemble', 'admin.tab.beta': 'Bêta Passcord',
    'admin.users': 'Comptes', 'admin.verified': 'Emails vérifiés', 'admin.sessions': 'Sessions actives', 'admin.logins': 'Connexions (24 h)',
    'admin.signups': 'Inscriptions — 30 derniers jours', 'admin.signups7': '{n} cette semaine', 'admin.adoption': 'Adoption de la sécurité',
    'admin.mfa': 'Double authentification', 'admin.passkeys': 'Passkeys', 'admin.passcord': 'Passcord', 'admin.failures': '{n} échec(s) de connexion en 24 h',
    'admin.clients': 'Clients OAuth', 'admin.clientsDesc': 'Déclarés dans la variable CORD_CLIENTS (les secrets ne sont jamais affichés).',
    'admin.client': 'Application', 'admin.redirects': 'Adresses de retour', 'admin.clientUsers': 'Comptes', 'admin.lastUse': 'Dernier usage',
    'admin.mail': 'Emails', 'admin.mailOn': 'Resend configuré', 'admin.mailOff': 'Envoi d’emails non configuré',
    'admin.loading': 'Chargement des statistiques…',
    'beta.desc': 'Génère des clés d’accès à la bêta fermée de Passcord. Une clé s’utilise sur compte.cordsuite.app ou dans CordLauncher et débloque le téléchargement de l’app.',
    'beta.activeKeys': 'Clés actives', 'beta.testers': 'Testeurs', 'beta.build': 'Dernier build', 'beta.noBuild': 'Aucun',
    'beta.downloadsOff': 'Téléchargement direct non configuré', 'beta.downloadsOffDesc': 'Ajoute la variable PASSCORD_RELEASES_TOKEN (jeton GitHub en lecture seule sur le dépôt Passcord) pour que les testeurs téléchargent l’IPA depuis le Compte Cord.',
    'beta.generate': 'Générer des clés', 'beta.generateDesc': 'Chaque clé n’est affichée qu’une fois : copie-la avant de fermer.',
    'beta.count': 'Nombre de clés', 'beta.uses': 'Utilisations par clé', 'beta.validity': 'Validité', 'beta.label': 'Note (facultatif)', 'beta.labelPh': 'Ex. Serveur Discord, amis…',
    'beta.never': 'Sans limite', 'beta.days': '{n} jours', 'beta.create': 'Générer',
    'beta.created.one': 'Clé créée', 'beta.created.other': '{n} clés créées', 'beta.createdDesc': 'Elles ne seront plus jamais affichées en entier : copie-les maintenant.',
    'beta.copyAll': 'Tout copier', 'beta.copiedAll': 'Clés copiées.', 'beta.saveTxt': 'Enregistrer (.txt)', 'beta.done': 'C’est noté',
    'beta.keys': 'Clés d’accès', 'beta.keysEmpty': 'Aucune clé pour l’instant', 'beta.keysEmptyDesc': 'Génère une première clé pour inviter un testeur.',
    'beta.key': 'Clé', 'beta.usage': 'Utilisations', 'beta.expires': 'Expire', 'beta.state': 'État', 'beta.createdAt': 'Créée',
    'beta.status.active': 'Active', 'beta.status.used': 'Utilisée', 'beta.status.expired': 'Expirée', 'beta.status.revoked': 'Désactivée',
    'beta.revoke': 'Désactiver', 'beta.revokeTitle': 'Désactiver cette clé ?', 'beta.revokeDesc': 'Elle ne pourra plus être utilisée. Les testeurs qui l’ont déjà utilisée gardent leur accès.', 'beta.revoked': 'Clé désactivée.',
    'beta.testersTitle': 'Testeurs', 'beta.testersEmpty': 'Aucun testeur', 'beta.testersEmptyDesc': 'Ils apparaîtront ici dès qu’ils auront utilisé une clé.',
    'beta.via': 'via {key}', 'beta.remove': 'Retirer', 'beta.removeTitle': 'Retirer {name} de la bêta ?', 'beta.removeDesc': 'Son compte Cord reste intact, mais il ne pourra plus télécharger Passcord sans une nouvelle clé.', 'beta.removed': 'Testeur retiré.',
    'beta.txtHeader': 'Clés d’accès à la bêta fermée de Passcord — à utiliser sur https://compte.cordsuite.app/#apps',
    'beta.direct': 'Installation directe', 'beta.directOn': 'Active', 'beta.directOff': 'À configurer',
    'beta.directOnDesc': 'Les testeurs téléchargent le dernier build de {repo}, et CordLauncher l’installe sans fichier à récupérer.',
    'beta.directOffDesc': 'Pour que les testeurs installent Passcord en un clic, le Compte Cord doit pouvoir lire tes releases privées sur GitHub.',
    'beta.directEnv': 'Jeton fourni par la variable PASSCORD_RELEASES_TOKEN du serveur.', 'beta.directAdmin': 'Jeton GitHub enregistré chiffré dans le Compte Cord — il n’est jamais réaffiché.',
    'beta.step1': 'Crée un jeton sur GitHub : dans « Repository access », choisis « Only select repositories » → passcord. La permission « Contents : lecture » est déjà cochée.',
    'beta.step1Btn': 'Créer le jeton', 'beta.step2': 'Colle-le ici : le Compte Cord vérifie qu’il ouvre bien le dépôt, puis le garde chiffré.',
    'beta.activate': 'Activer', 'beta.change': 'Changer le jeton', 'beta.disable': 'Désactiver', 'beta.activated': 'Installation directe activée.',
    'beta.disableTitle': 'Désactiver l’installation directe ?', 'beta.disableDesc': 'Le jeton GitHub est effacé du Compte Cord. Les testeurs devront de nouveau choisir un fichier .ipa.', 'beta.disabled': 'Installation directe désactivée.',
  },
  en: {
    'admin.title': 'Admin', 'admin.desc': 'Cord Account at a glance. No personal data is shown here.',
    'admin.tab.overview': 'Overview', 'admin.tab.beta': 'Passcord beta',
    'admin.users': 'Accounts', 'admin.verified': 'Verified emails', 'admin.sessions': 'Active sessions', 'admin.logins': 'Sign-ins (24 h)',
    'admin.signups': 'Sign-ups — last 30 days', 'admin.signups7': '{n} this week', 'admin.adoption': 'Security adoption',
    'admin.mfa': 'Two-factor', 'admin.passkeys': 'Passkeys', 'admin.passcord': 'Passcord', 'admin.failures': '{n} failed sign-in(s) in 24 h',
    'admin.clients': 'OAuth clients', 'admin.clientsDesc': 'Declared in the CORD_CLIENTS variable (secrets are never shown).',
    'admin.client': 'Application', 'admin.redirects': 'Redirect URIs', 'admin.clientUsers': 'Accounts', 'admin.lastUse': 'Last used',
    'admin.mail': 'Emails', 'admin.mailOn': 'Resend configured', 'admin.mailOff': 'Email delivery not configured',
    'admin.loading': 'Loading statistics…',
    'beta.desc': 'Generate access keys for the Passcord closed beta. A key is redeemed on compte.cordsuite.app or in CordLauncher and unlocks the app download.',
    'beta.activeKeys': 'Active keys', 'beta.testers': 'Testers', 'beta.build': 'Latest build', 'beta.noBuild': 'None',
    'beta.downloadsOff': 'Direct download not configured', 'beta.downloadsOffDesc': 'Add the PASSCORD_RELEASES_TOKEN variable (read-only GitHub token on the Passcord repo) so testers can download the IPA from their Cord account.',
    'beta.generate': 'Generate keys', 'beta.generateDesc': 'Each key is shown only once: copy it before closing.',
    'beta.count': 'Number of keys', 'beta.uses': 'Uses per key', 'beta.validity': 'Valid for', 'beta.label': 'Note (optional)', 'beta.labelPh': 'E.g. Discord server, friends…',
    'beta.never': 'No limit', 'beta.days': '{n} days', 'beta.create': 'Generate',
    'beta.created.one': 'Key created', 'beta.created.other': '{n} keys created', 'beta.createdDesc': 'They will never be shown in full again: copy them now.',
    'beta.copyAll': 'Copy all', 'beta.copiedAll': 'Keys copied.', 'beta.saveTxt': 'Save (.txt)', 'beta.done': 'Got it',
    'beta.keys': 'Access keys', 'beta.keysEmpty': 'No keys yet', 'beta.keysEmptyDesc': 'Generate a first key to invite a tester.',
    'beta.key': 'Key', 'beta.usage': 'Uses', 'beta.expires': 'Expires', 'beta.state': 'Status', 'beta.createdAt': 'Created',
    'beta.status.active': 'Active', 'beta.status.used': 'Used', 'beta.status.expired': 'Expired', 'beta.status.revoked': 'Disabled',
    'beta.revoke': 'Disable', 'beta.revokeTitle': 'Disable this key?', 'beta.revokeDesc': 'It can no longer be redeemed. Testers who already used it keep their access.', 'beta.revoked': 'Key disabled.',
    'beta.testersTitle': 'Testers', 'beta.testersEmpty': 'No testers', 'beta.testersEmptyDesc': 'They’ll show up here once they redeem a key.',
    'beta.via': 'via {key}', 'beta.remove': 'Remove', 'beta.removeTitle': 'Remove {name} from the beta?', 'beta.removeDesc': 'Their Cord account stays intact, but they can no longer download Passcord without a new key.', 'beta.removed': 'Tester removed.',
    'beta.txtHeader': 'Passcord closed beta access keys — redeem them at https://compte.cordsuite.app/#apps',
    'beta.direct': 'Direct install', 'beta.directOn': 'On', 'beta.directOff': 'Needs setup',
    'beta.directOnDesc': 'Testers download the latest build of {repo}, and CordLauncher installs it with no file to fetch.',
    'beta.directOffDesc': 'For testers to install Passcord in one click, the Cord Account must be able to read your private GitHub releases.',
    'beta.directEnv': 'Token provided by the server’s PASSCORD_RELEASES_TOKEN variable.', 'beta.directAdmin': 'GitHub token stored encrypted in the Cord Account — never shown again.',
    'beta.step1': 'Create a token on GitHub: under “Repository access”, pick “Only select repositories” → passcord. “Contents: read” is already checked.',
    'beta.step1Btn': 'Create the token', 'beta.step2': 'Paste it here: the Cord Account checks it opens the repository, then stores it encrypted.',
    'beta.activate': 'Turn on', 'beta.change': 'Change token', 'beta.disable': 'Turn off', 'beta.activated': 'Direct install is on.',
    'beta.disableTitle': 'Turn off direct install?', 'beta.disableDesc': 'The GitHub token is erased from the Cord Account. Testers will have to pick an .ipa file again.', 'beta.disabled': 'Direct install is off.',
  },
});

const adminState = { data: null, loading: false, tab: 'overview', beta: null, betaLoading: false };
const BETA_TONES = { active: 'tone-ok', used: 'tone-muted', expired: 'tone-warn', revoked: 'tone-danger' };
const maskedKey = (hint) => `PASS-••••-••••-${hint}`;
const TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new?name=Compte+Cord+-+builds+Passcord&description=Lecture+des+releases+priv%C3%A9es+de+Passcord&expires_in=none&contents=read';

function directCard(b) {
  const ready = b.downloads && !adminState.editToken;
  return html`<section class="card glass">
    <div class="card-head"><span class="icon-badge ${b.downloads ? 'tone-ok' : 'tone-warn'}">${icon('download')}</span>
      <div class="grow"><h2 class="card-title">${t('beta.direct')} <span class="badge ${b.downloads ? 'tone-ok' : 'tone-warn'}">${t(b.downloads ? 'beta.directOn' : 'beta.directOff')}</span></h2>
        <p class="card-desc">${b.downloads ? t('beta.directOnDesc', { repo: b.repo ?? 'Passcord' }) : t('beta.directOffDesc')}</p></div>
      ${ready && b.downloadsSource === 'admin' ? html`<div class="row-wrap"><button class="btn btn-ghost btn-sm" data-action="beta-token-edit">${t('beta.change')}</button><button class="btn btn-ghost btn-sm" data-action="beta-token-off">${t('beta.disable')}</button></div>` : ''}
    </div>
    <div class="card-body">${ready
      ? html`<p class="subtle tiny">${t(b.downloadsSource === 'env' ? 'beta.directEnv' : 'beta.directAdmin')}</p>`
      : html`<ol class="token-steps">
          <li><span class="step-n">1</span><p>${t('beta.step1')}</p><a class="btn btn-glass btn-sm" href="${TOKEN_URL}" target="_blank" rel="noopener">${icon('key-round')}${t('beta.step1Btn')}${icon('external-link')}</a></li>
          <li><span class="step-n">2</span><div class="grow stack-sm"><p>${t('beta.step2')}</p>
            <form id="beta-token" class="row-wrap" novalidate>
              <input class="input mono grow" name="token" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" aria-label="GitHub" required>
              <button class="btn btn-primary" type="submit">${icon('check')}${t('beta.activate')}</button>
            </form></div></li>
        </ol>`}</div>
  </section>`;
}

VIEWS.admin = {
  render() {
    const tabs = html`<div class="segmented admin-tabs" role="radiogroup" aria-label="${t('admin.title')}">
      ${[['overview', 'chart-column'], ['beta', 'key-round']].map(([value, ic]) => html`<label><input type="radio" name="admin-tab" value="${value}" data-change="admin-tab" ${adminState.tab === value ? raw('checked') : ''}><span>${icon(ic)}${t(`admin.tab.${value}`)}</span></label>`)}
    </div>`;
    const head = (actions) => pageHead({ eyebrow: t('nav.section.owner'), title: t('admin.title'), desc: adminState.tab === 'beta' ? t('beta.desc') : t('admin.desc'), actions });
    const reload = html`<button class="btn btn-glass btn-sm" data-action="admin-reload">${icon('refresh-cw')}${t('common.retry')}</button>`;
    if (adminState.tab === 'beta') return html`<div class="view">${head(reload)}${tabs}${renderBeta()}</div>`;

    const d = adminState.data;
    if (!d) {
      return html`<div class="view">${head('')}${tabs}
        <div class="grid-4">${[1, 2, 3, 4].map(() => html`<div class="skeleton sk-block"></div>`)}</div><div class="skeleton sk-block"></div></div>`;
    }
    const { totals } = d;
    const days = [];
    const byDay = new Map(d.signups.map((s) => [s.day, s.count]));
    const today = Math.floor(Date.now() / 86400_000);
    for (let i = 29; i >= 0; i--) days.push({ day: (today - i) * 86400_000, count: byDay.get((today - i) * 86400_000) ?? 0 });
    const max = Math.max(1, ...days.map((x) => x.count));
    const pct = (n) => (totals.users ? Math.round((n / totals.users) * 100) : 0);
    return html`<div class="view">
      ${head(html`<span class="badge ${d.mail ? 'tone-ok' : 'tone-warn'}">${icon('mail')}${t(d.mail ? 'admin.mailOn' : 'admin.mailOff')}</span>${reload}`)}
      ${tabs}
      <section class="grid-4">
        ${[['users', 'users', ''], ['verified', 'mail-check', 'tone-ok'], ['sessions', 'monitor-smartphone', 'tone-info'], ['logins24', 'log-in', 'tone-warn']].map(([k, ic, tone]) => html`
          <div class="stat glass"><div class="top"><span class="icon-badge sm ${tone}">${icon(ic)}</span></div><div class="value">${totals[k]}</div>
          <div class="label">${t(`admin.${k === 'logins24' ? 'logins' : k}`)}</div></div>`)}
      </section>
      <section class="grid-2">
        <div class="card glass">
          <div class="card-head"><div class="grow"><h2 class="card-title">${t('admin.signups')}</h2><p class="card-desc">${t('admin.signups7', { n: totals.signups7 })}</p></div></div>
          <div class="bars card-body" role="img" aria-label="${t('admin.signups')}">
            ${days.map((x, i) => html`<span class="${x.count ? '' : 'zero'}" data-height="${(x.count / max) * 100}" data-delay="${i * 12}" title="${fmtDateShort(x.day)} · ${x.count}"></span>`)}
          </div>
          <div class="bars-axis"><span>${fmtDateShort(days[0].day)}</span><span>${fmtDateShort(days.at(-1).day)}</span></div>
        </div>
        <div class="card glass">
          <div class="card-head"><div class="grow"><h2 class="card-title">${t('admin.adoption')}</h2><p class="card-desc">${t('admin.failures', { n: totals.failures24 })}</p></div></div>
          <div class="card-body stack">
            ${[['mfa', totals.mfa], ['passkeys', totals.passkey_users], ['passcord', totals.passcord_users]].map(([k, n]) => html`<div class="meter">
              <div class="row"><span>${t(`admin.${k}`)}</span><span class="mono subtle">${n} · ${pct(n)} %</span></div>
              <div class="progress"><span data-width="${pct(n)}"></span></div></div>`)}
          </div>
        </div>
      </section>
      <section class="card glass">
        <div class="card-head"><span class="icon-badge">${icon('server')}</span><div class="grow"><h2 class="card-title">${t('admin.clients')}</h2><p class="card-desc">${t('admin.clientsDesc')}</p></div></div>
        <div class="table-wrap card-body"><table class="table">
          <thead><tr><th>${t('admin.client')}</th><th>${t('admin.redirects')}</th><th>${t('admin.clientUsers')}</th><th>${t('admin.lastUse')}</th></tr></thead>
          <tbody>${d.clients.map((c) => html`<tr>
            <td><div class="row">${appLogo(c)}<div><strong>${c.name}</strong><div class="tiny subtle mono">${c.id}</div></div></div></td>
            <td>${c.redirectUris.map((u) => html`<div class="tiny mono break">${u}</div>`)}</td>
            <td class="mono">${c.users}</td><td>${c.lastUsedAt ? fmtRelative(c.lastUsedAt) : t('common.never')}</td>
          </tr>`)}</tbody>
        </table></div>
      </section>
    </div>`;
  },
  mount() {
    if (adminState.tab === 'beta') {
      if (!adminState.beta && !adminState.betaLoading) loadBeta();
    } else if (!adminState.data && !adminState.loading) loadAdmin();
    const form = $('#beta-generate');
    form?.addEventListener('submit', (event) => generateKeys(event, form));
    const tokenForm = $('#beta-token');
    tokenForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = $('[name="token"]', tokenForm);
      if (!input.value.trim()) return input.focus();
      try {
        await busy(event.submitter, () => withReauth((extra) => api('/api/admin/beta/token', { product: 'passcord', token: input.value.trim(), ...extra })));
        toast(t('beta.activated'));
        adminState.editToken = false;
        adminState.beta = null;
        renderShell();
      } catch (e) {
        input.setAttribute('aria-invalid', 'true');
        toastError(e);
      }
    });
  },
};

function renderBeta() {
  const b = adminState.beta;
  if (!b) return html`<div class="grid-3">${[1, 2, 3].map(() => html`<div class="skeleton sk-block"></div>`)}</div><div class="skeleton sk-block"></div>`;
  const active = b.keys.filter((k) => k.status === 'active').length;
  return html`
    <section class="grid-3">
      <div class="stat glass"><div class="top"><span class="icon-badge sm tone-ok">${icon('key-round')}</span></div><div class="value">${active}</div><div class="label">${t('beta.activeKeys')}</div></div>
      <div class="stat glass"><div class="top"><span class="icon-badge sm tone-info">${icon('users')}</span></div><div class="value">${b.testers.length}</div><div class="label">${t('beta.testers')}</div></div>
      <div class="stat glass"><div class="top"><span class="icon-badge sm">${icon('smartphone')}</span></div><div class="value beta-build">${b.release?.build ?? t('beta.noBuild')}</div>
        <div class="label">${t('beta.build')}${b.release?.publishedAt ? html` · ${fmtRelative(b.release.publishedAt)}` : ''}</div></div>
    </section>
    ${directCard(b)}
    <section class="card glass">
      <div class="card-head"><span class="icon-badge grad">${icon('sparkles')}</span><div class="grow"><h2 class="card-title">${t('beta.generate')}</h2><p class="card-desc">${t('beta.generateDesc')}</p></div></div>
      <form id="beta-generate" class="card-body beta-form" novalidate>
        <div class="field"><label for="beta-count">${t('beta.count')}</label><input class="input" id="beta-count" name="count" type="number" min="1" max="50" value="1" required></div>
        <div class="field"><label for="beta-uses">${t('beta.uses')}</label><input class="input" id="beta-uses" name="maxUses" type="number" min="1" max="1000" value="1" required></div>
        <div class="field"><label for="beta-validity">${t('beta.validity')}</label><select class="input" id="beta-validity" name="expiresInDays">
          ${[7, 30, 90, 0].map((n) => html`<option value="${n}" ${n === 30 ? raw('selected') : ''}>${n ? t('beta.days', { n }) : t('beta.never')}</option>`)}
        </select></div>
        <div class="field beta-label"><label for="beta-label">${t('beta.label')}</label><input class="input" id="beta-label" name="label" maxlength="60" placeholder="${t('beta.labelPh')}"></div>
        <div class="beta-submit"><button class="btn btn-primary" type="submit">${icon('key-round')}${t('beta.create')}</button></div>
      </form>
    </section>
    <section class="card glass">
      <div class="card-head"><span class="icon-badge">${icon('key')}</span><div class="grow"><h2 class="card-title">${t('beta.keys')}</h2></div></div>
      <div class="card-body">${b.keys.length
        ? html`<div class="table-wrap"><table class="table">
            <thead><tr><th>${t('beta.key')}</th><th>${t('beta.usage')}</th><th>${t('beta.expires')}</th><th>${t('beta.state')}</th><th></th></tr></thead>
            <tbody>${b.keys.map((k) => html`<tr>
              <td><div class="mono">${maskedKey(k.hint)}</div><div class="tiny subtle">${k.label ?? ''}${k.label ? ' · ' : ''}${t('beta.createdAt')} ${fmtRelative(k.createdAt)}</div></td>
              <td class="mono">${k.uses} / ${k.maxUses}</td>
              <td>${k.expiresAt ? fmtDateShort(k.expiresAt) : t('beta.never')}</td>
              <td><span class="badge ${BETA_TONES[k.status]}">${t(`beta.status.${k.status}`)}</span></td>
              <td class="actions-cell">${k.status === 'active' ? html`<button class="btn btn-danger btn-sm" data-action="beta-revoke" data-id="${k.id}">${t('beta.revoke')}</button>` : ''}</td>
            </tr>`)}</tbody>
          </table></div>`
        : emptyState({ iconName: 'key-round', title: t('beta.keysEmpty'), desc: t('beta.keysEmptyDesc') })}</div>
    </section>
    <section class="card glass">
      <div class="card-head"><span class="icon-badge">${icon('users')}</span><div class="grow"><h2 class="card-title">${t('beta.testersTitle')}</h2></div></div>
      <div class="card-body">${b.testers.length
        ? html`<ul class="list">${b.testers.map((u) => html`<li class="list-item">
            ${avatar({ id: u.userId, name: u.name, email: u.email }, 'sm')}
            <div class="body"><div class="title">${u.name}</div><div class="meta"><span>${u.email}</span><span>${fmtRelative(u.grantedAt)}</span>${u.keyHint ? html`<span class="mono">${t('beta.via', { key: u.keyLabel ?? `…${u.keyHint}` })}</span>` : ''}</div></div>
            <div class="actions"><button class="btn btn-ghost btn-sm" data-action="beta-remove" data-id="${u.userId}" data-name="${u.name}">${t('beta.remove')}</button></div>
          </li>`)}</ul>`
        : emptyState({ iconName: 'users', title: t('beta.testersEmpty'), desc: t('beta.testersEmptyDesc') })}</div>
    </section>`;
}

async function loadAdmin() {
  adminState.loading = true;
  try {
    adminState.data = await api('/api/admin/overview');
    if (state.route === 'admin') renderShell();
  } catch (e) {
    toastError(e);
  } finally {
    adminState.loading = false;
  }
}
async function loadBeta() {
  adminState.betaLoading = true;
  try {
    adminState.beta = await api('/api/admin/beta?product=passcord');
    if (state.route === 'admin' && adminState.tab === 'beta') renderShell();
  } catch (e) {
    toastError(e);
  } finally {
    adminState.betaLoading = false;
  }
}

async function generateKeys(event, form) {
  event.preventDefault();
  if (!form.checkValidity()) { $(':invalid', form)?.focus(); return toast(t('error.form'), { type: 'error' }); }
  const data = new FormData(form);
  const body = { product: 'passcord', count: Number(data.get('count')), maxUses: Number(data.get('maxUses')), expiresInDays: Number(data.get('expiresInDays')), label: String(data.get('label') ?? '') };
  const { keys } = await busy(event.submitter ?? $('[type="submit"]', form), () => api('/api/admin/beta/keys', body)).catch((e) => { toastError(e); return {}; });
  if (!keys) return;
  const codes = keys.map((k) => k.code);
  adminState.beta = null;
  modal({
    title: keys.length === 1 ? t('beta.created.one') : t('beta.created.other', { n: keys.length }),
    desc: t('beta.createdDesc'),
    iconName: 'party-popper',
    tone: 'tone-ok',
    wide: keys.length > 6,
    body: html`<ul class="beta-codes">${keys.map((k, i) => html`<li data-delay="${i * 40}"><code>${k.code}</code>
      <button type="button" class="btn btn-ghost btn-icon btn-sm" data-copy="${k.code}" aria-label="${t('common.copy')}">${icon('copy')}</button></li>`)}</ul>`,
    actions: html`<button type="button" class="btn btn-ghost" data-save>${icon('download')}${t('beta.saveTxt')}</button>
      <button type="button" class="btn btn-glass" data-copy-all>${icon('copy')}${t('beta.copyAll')}</button>
      <button type="submit" class="btn btn-primary">${t('beta.done')}</button>`,
    onOpen(ctx) {
      hydrate(ctx.dialog);
      ctx.dialog.addEventListener('click', (e) => {
        const one = e.target.closest('[data-copy]');
        if (one) copyText(one.dataset.copy);
        if (e.target.closest('[data-copy-all]')) copyText(codes.join('\n'), t('beta.copiedAll'));
        if (e.target.closest('[data-save]')) downloadFile(`cles-beta-passcord-${new Date().toISOString().slice(0, 10)}.txt`, `${t('beta.txtHeader')}\n\n${codes.join('\n')}\n`, 'text/plain');
      });
    },
  }).then(() => renderShell());
  if (keys.length === 1) celebrate();
  form.reset();
}

Object.assign(ACTIONS, {
  'beta-token-edit'() {
    adminState.editToken = true;
    renderShell();
  },
  async 'beta-token-off'() {
    const ok = await confirmDialog({ title: t('beta.disableTitle'), desc: t('beta.disableDesc'), confirm: t('beta.disable'), iconName: 'download' });
    if (!ok) return;
    await api('/api/admin/beta/token', { product: 'passcord' }, 'DELETE');
    toast(t('beta.disabled'), { type: 'info' });
    adminState.beta = null;
    renderShell();
  },
  'admin-reload'() {
    if (adminState.tab === 'beta') adminState.beta = null;
    else adminState.data = null;
    renderShell();
  },
  'admin-tab'(input) {
    adminState.tab = input.value;
    renderShell();
  },
  async 'beta-revoke'(button) {
    const ok = await confirmDialog({ title: t('beta.revokeTitle'), desc: t('beta.revokeDesc'), confirm: t('beta.revoke'), iconName: 'ban' });
    if (!ok) return;
    await api('/api/admin/beta/keys', { id: button.dataset.id }, 'DELETE');
    toast(t('beta.revoked'), { type: 'info' });
    adminState.beta = null;
    renderShell();
  },
  async 'beta-remove'(button) {
    const name = button.dataset.name;
    const ok = await confirmDialog({ title: t('beta.removeTitle', { name }), desc: t('beta.removeDesc'), confirm: t('beta.remove'), iconName: 'user-round' });
    if (!ok) return;
    await api('/api/admin/beta/testers', { userId: button.dataset.id, product: 'passcord' }, 'DELETE');
    toast(t('beta.removed'), { type: 'info' });
    adminState.beta = null;
    renderShell();
  },
});
