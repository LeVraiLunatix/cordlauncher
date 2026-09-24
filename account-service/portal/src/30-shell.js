/* Coque de l'espace connecté : navigation, routage par ancre, en-têtes. */

messages({
  fr: {
    'nav.overview': 'Aperçu', 'nav.profile': 'Profil', 'nav.security': 'Sécurité', 'nav.devices': 'Appareils',
    'nav.apps': 'Apps', 'nav.activity': 'Activité', 'nav.privacy': 'Confidentialité', 'nav.admin': 'Administration',
    'nav.more': 'Plus', 'nav.logout': 'Se déconnecter', 'nav.section.account': 'Compte', 'nav.section.data': 'Données',
    'nav.section.owner': 'Propriétaire', 'nav.menu': 'Menu du compte',
    'logout.done': 'Tu es déconnecté. À bientôt !',
    'score.excellent': 'Protection excellente', 'score.good': 'Bonne protection', 'score.weak': 'À renforcer', 'score.label': 'sécurité',
  },
  en: {
    'nav.overview': 'Overview', 'nav.profile': 'Profile', 'nav.security': 'Security', 'nav.devices': 'Devices',
    'nav.apps': 'Apps', 'nav.activity': 'Activity', 'nav.privacy': 'Privacy', 'nav.admin': 'Admin',
    'nav.more': 'More', 'nav.logout': 'Sign out', 'nav.section.account': 'Account', 'nav.section.data': 'Data',
    'nav.section.owner': 'Owner', 'nav.menu': 'Account menu',
    'logout.done': 'You’re signed out. See you soon!',
    'score.excellent': 'Excellent protection', 'score.good': 'Good protection', 'score.weak': 'Needs attention', 'score.label': 'security',
  },
});

const ROUTES = [
  { id: 'apercu', icon: 'layout-dashboard', label: 'nav.overview', section: 'account', tab: true },
  { id: 'securite', icon: 'shield-check', label: 'nav.security', section: 'account', tab: true },
  { id: 'appareils', icon: 'monitor-smartphone', label: 'nav.devices', section: 'account', tab: true },
  { id: 'apps', icon: 'layout-grid', label: 'nav.apps', section: 'account', tab: true },
  { id: 'profil', icon: 'user-round', label: 'nav.profile', section: 'account' },
  { id: 'activite', icon: 'history', label: 'nav.activity', section: 'data' },
  { id: 'confidentialite', icon: 'lock-keyhole', label: 'nav.privacy', section: 'data' },
  { id: 'admin', icon: 'chart-column', label: 'nav.admin', section: 'owner', admin: true },
];
const routeFromHash = () => {
  const id = location.hash.replace(/^#\/?/, '').split('?')[0];
  const route = ROUTES.find((r) => r.id === id);
  if (!route || (route.admin && !state.account?.user.admin)) return 'apercu';
  return id;
};

/** Score de sécurité 0-100 et recommandations. */
function securityScore(account = state.account) {
  const { user, security, passkeys, passcord } = account;
  const checks = [
    { id: 'email', ok: user.emailVerified, weight: 20 },
    { id: 'mfa', ok: security.mfa, weight: 25 },
    { id: 'strong', ok: passkeys.length + passcord.length > 0, weight: 25 },
    { id: 'recovery', ok: !security.mfa || security.recoveryCodesLeft >= 3, weight: 10 },
    { id: 'alerts', ok: user.alerts, weight: 10 },
    { id: 'fresh', ok: Boolean(security.passwordChangedAt && Date.now() - security.passwordChangedAt < 400 * 86400_000), weight: 10 },
  ];
  const value = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  const tone = value >= 85 ? 'ok' : value >= 55 ? 'warn' : 'danger';
  const label = t(value >= 85 ? 'score.excellent' : value >= 55 ? 'score.good' : 'score.weak');
  return { value, tone, label, checks };
}

function pageHead({ eyebrow, title, desc, actions }) {
  return html`<header class="page-head">
    <div>${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}<h1 tabindex="-1" data-page-title>${title}</h1>${desc ? html`<p>${desc}</p>` : ''}</div>
    ${actions ? html`<div class="row-wrap">${actions}</div>` : ''}
  </header>`;
}

function navLink(route, { tab = false } = {}) {
  const current = state.route === route.id;
  const a = state.account;
  let extra = '';
  if (!tab) {
    if (route.id === 'securite' && securityScore().value < 55) extra = html`<span class="dot-alert" aria-hidden="true"></span>`;
    if (route.id === 'apps' && a.apps.length) extra = html`<span class="count">${a.apps.length}</span>`;
    if (route.id === 'appareils') extra = html`<span class="count">${a.sessions.length}</span>`;
  }
  return html`<a href="#${route.id}" ${current ? raw('aria-current="page"') : ''}>${icon(route.icon)}<span>${t(route.label)}</span>${extra}</a>`;
}

let lastRendered = null;
function renderShell() {
  const account = state.account;
  if (!account) return showLanding();
  state.route = routeFromHash();
  const user = account.user;
  const view = VIEWS[state.route];
  const visible = ROUTES.filter((r) => !r.admin || user.admin);
  const sections = ['account', 'data', 'owner'];
  const app = $('#app');
  app.removeAttribute('aria-busy');
  document.title = `${t(ROUTES.find((r) => r.id === state.route).label)} · Compte Cord`;
  const moreActive = !ROUTES.find((r) => r.id === state.route)?.tab;
  render(app, html`<div class="shell">
    <aside class="sidebar" aria-label="${t('nav.menu')}">
      <a class="brand" href="#apercu"><img src="/assets/icon-180.png" alt="" width="34" height="34"><span class="name">Compte Cord<small>cordsuite.app</small></span></a>
      ${sections.map((section) => {
        const items = visible.filter((r) => r.section === section);
        return items.length ? html`<p class="nav-label">${t(`nav.section.${section}`)}</p><nav class="nav">${items.map((r) => navLink(r))}</nav>` : '';
      })}
      <div class="me">
        ${avatar(user, 'sm')}
        <div class="who"><strong>${user.name}</strong><span>${user.email}</span></div>
        <button class="btn btn-ghost btn-icon btn-sm" data-action="toggle-theme" aria-label="${t('nav.theme')}">${icon(effectiveTheme() === 'dark' ? 'sun' : 'moon')}</button>
        <button class="btn btn-ghost btn-icon btn-sm" data-action="logout" aria-label="${t('nav.logout')}">${icon('log-out')}</button>
      </div>
    </aside>
    <div class="mobile-top">
      <a class="brand" href="#apercu"><img src="/assets/icon-180.png" alt="" width="30" height="30"><span class="name">Compte Cord</span></a>
      <button class="avatar-btn" data-action="more" aria-label="${t('nav.menu')}">${avatar(user, 'sm')}</button>
    </div>
    <main class="main" id="main"><div class="main-inner" data-view="${state.route}">${view.render(account)}</div></main>
    <nav class="tabbar" aria-label="${t('nav.menu')}">
      ${ROUTES.filter((r) => r.tab).map((r) => html`<a href="#${r.id}" ${state.route === r.id ? raw('aria-current="page"') : ''}>${icon(r.icon)}<span>${t(r.label)}</span></a>`)}
      <button type="button" data-action="more" ${moreActive ? raw('aria-current="page"') : ''}>${icon('ellipsis')}<span>${t('nav.more')}</span></button>
    </nav>
  </div>`);
  view.mount?.($('[data-view]', app), account);
  if (lastRendered && lastRendered !== state.route) {
    $('[data-page-title]', app)?.focus({ preventScroll: true });
    scrollTo({ top: 0, behavior: 'instant' });
  }
  lastRendered = state.route;
}

addEventListener('hashchange', () => {
  if (state.account && !location.pathname.startsWith('/authorize')) renderShell();
});

Object.assign(ACTIONS, {
  async logout() {
    await api('/api/logout', {});
    state.account = null;
    history.replaceState(null, '', '/');
    showLanding();
    toast(t('logout.done'), { type: 'info', duration: 3000 });
  },
  more() {
    const user = state.account.user;
    modal({
      title: user.name,
      desc: user.email,
      body: html`<div class="more-list">
        ${ROUTES.filter((r) => !r.tab && (!r.admin || user.admin)).map((r) => html`<a href="#${r.id}" data-close>${icon(r.icon)}${t(r.label)}</a>`)}
        <button type="button" data-action="toggle-theme" data-close>${icon(effectiveTheme() === 'dark' ? 'sun' : 'moon')}${t('nav.theme')}</button>
        <button type="button" data-action="toggle-locale" data-close>${icon('languages')}${t('nav.lang')}</button>
        <button type="button" class="danger" data-action="logout" data-close>${icon('log-out')}${t('nav.logout')}</button>
      </div>`,
      onOpen(ctx) {
        ctx.dialog.addEventListener('click', (event) => {
          const link = event.target.closest('a[href^="#"]');
          if (link) { location.hash = link.getAttribute('href'); }
        });
      },
    });
  },
});
