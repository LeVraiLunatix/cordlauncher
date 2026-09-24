/* Administration (propriétaire uniquement, CORD_ADMINS) : statistiques et clients OAuth. */

messages({
  fr: {
    'admin.title': 'Administration', 'admin.desc': 'Vue d’ensemble du Compte Cord. Aucune donnée personnelle n’est affichée ici.',
    'admin.users': 'Comptes', 'admin.verified': 'Emails vérifiés', 'admin.sessions': 'Sessions actives', 'admin.logins': 'Connexions (24 h)',
    'admin.signups': 'Inscriptions — 30 derniers jours', 'admin.signups7': '{n} cette semaine', 'admin.adoption': 'Adoption de la sécurité',
    'admin.mfa': 'Double authentification', 'admin.passkeys': 'Passkeys', 'admin.passcord': 'Passcord', 'admin.failures': '{n} échec(s) de connexion en 24 h',
    'admin.clients': 'Clients OAuth', 'admin.clientsDesc': 'Déclarés dans la variable CORD_CLIENTS (les secrets ne sont jamais affichés).',
    'admin.client': 'Application', 'admin.redirects': 'Adresses de retour', 'admin.clientUsers': 'Comptes', 'admin.lastUse': 'Dernier usage',
    'admin.mail': 'Emails', 'admin.mailOn': 'Resend configuré', 'admin.mailOff': 'Envoi d’emails non configuré',
    'admin.loading': 'Chargement des statistiques…',
  },
  en: {
    'admin.title': 'Admin', 'admin.desc': 'Cord Account at a glance. No personal data is shown here.',
    'admin.users': 'Accounts', 'admin.verified': 'Verified emails', 'admin.sessions': 'Active sessions', 'admin.logins': 'Sign-ins (24 h)',
    'admin.signups': 'Sign-ups — last 30 days', 'admin.signups7': '{n} this week', 'admin.adoption': 'Security adoption',
    'admin.mfa': 'Two-factor', 'admin.passkeys': 'Passkeys', 'admin.passcord': 'Passcord', 'admin.failures': '{n} failed sign-in(s) in 24 h',
    'admin.clients': 'OAuth clients', 'admin.clientsDesc': 'Declared in the CORD_CLIENTS variable (secrets are never shown).',
    'admin.client': 'Application', 'admin.redirects': 'Redirect URIs', 'admin.clientUsers': 'Accounts', 'admin.lastUse': 'Last used',
    'admin.mail': 'Emails', 'admin.mailOn': 'Resend configured', 'admin.mailOff': 'Email delivery not configured',
    'admin.loading': 'Loading statistics…',
  },
});

const adminState = { data: null, loading: false };

VIEWS.admin = {
  render() {
    const d = adminState.data;
    if (!d) {
      return html`<div class="view">${pageHead({ eyebrow: t('nav.section.owner'), title: t('admin.title'), desc: t('admin.desc') })}
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
      ${pageHead({ eyebrow: t('nav.section.owner'), title: t('admin.title'), desc: t('admin.desc'),
        actions: html`<span class="badge ${d.mail ? 'tone-ok' : 'tone-warn'}">${icon('mail')}${t(d.mail ? 'admin.mailOn' : 'admin.mailOff')}</span>
          <button class="btn btn-glass btn-sm" data-action="admin-reload">${icon('refresh-cw')}${t('common.retry')}</button>` })}
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
    if (!adminState.data && !adminState.loading) loadAdmin();
  },
};

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

Object.assign(ACTIONS, {
  'admin-reload'() {
    adminState.data = null;
    renderShell();
  },
});
