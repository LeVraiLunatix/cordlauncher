/* État global, routeur et actions déléguées. */

const state = {
  account: null, // réponse de /api/account
  hub: null, // réponse de /api/hub (apps de la suite, état remonté, notifications)
  suite: [],
  features: { mail: true },
  route: 'apercu',
};
const VIEWS = {};
const ACTIONS = {};
const passkeysSupported = () =>
  Boolean(window.PublicKeyCredential && navigator.credentials?.create) &&
  !/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname) &&
  location.hostname !== '[::1]';

async function loadAccount() {
  const [account, hubData] = await Promise.all([api('/api/account'), api('/api/hub').catch(() => null)]);
  state.account = account;
  state.hub = hubData;
  activityState.events = null;
  const user = state.account.user;
  if (user.locale && user.locale !== locale) setLocale(user.locale);
  applyTheme(user.theme);
  return state.account;
}
/** Recharge l'état du compte puis redessine la vue courante. */
async function refresh() {
  try {
    await loadAccount();
    renderShell();
  } catch (e) {
    if (e.status === 401) return showLanding();
    toastError(e);
  }
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target || target.closest('[data-scope]')) return;
  const action = ACTIONS[target.dataset.action];
  if (!action) return;
  event.preventDefault();
  Promise.resolve(action(target, event)).catch(toastError);
});
document.addEventListener('change', (event) => {
  const target = event.target.closest('[data-change]');
  if (!target || target.closest('[data-scope]')) return;
  const action = ACTIONS[target.dataset.change];
  if (action) Promise.resolve(action(target, event)).catch(toastError);
});

// Barre du haut : verre dépoli dès qu'on défile.
addEventListener('scroll', () => {
  $('.topbar')?.classList.toggle('scrolled', scrollY > 8);
}, { passive: true });
