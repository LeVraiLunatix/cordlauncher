/*
 * Notifications push : le Compte Cord installé comme app (écran d'accueil de
 * l'iPhone, Chrome, Edge…) reçoit les demandes Passcord et les nouvelles de
 * la suite. iOS n'accepte les notifications que depuis l'app installée.
 */

messages({
  fr: {
    'push.title': 'Notifications', 'push.desc': 'Reçois les demandes de connexion Passcord et les nouvelles de la suite sur cet appareil.',
    'push.on': 'Activées sur cet appareil', 'push.off': 'Désactivées sur cet appareil',
    'push.enable': 'Activer les notifications', 'push.disable': 'Désactiver', 'push.enabled': 'Notifications activées sur cet appareil.',
    'push.disabled': 'Notifications désactivées sur cet appareil.', 'push.denied': 'Les notifications sont bloquées : autorise-les dans les réglages du navigateur.',
    'push.unsupported': 'Ce navigateur ne gère pas les notifications push.',
    'push.iosInstall': 'Sur iPhone, les notifications passent par l’app Compte Cord : dans Safari, touche Partager puis « Sur l’écran d’accueil », ouvre Compte Cord depuis l’icône et reviens ici.',
    'push.iosTip': 'Active-les sur ton iPhone : chaque demande de connexion Passcord t’arrivera en notification.',
    'push.request.title': 'Demande de connexion', 'push.request.desc': 'Un appareil veut se connecter à ton Compte Cord. Ouvre Passcord, choisis le nombre affiché sur l’autre écran et valide avec Face ID.',
    'push.request.open': 'Ouvrir Passcord', 'push.request.ignore': 'Tu n’as rien demandé ? Ignore-la : sans ton iPhone et Face ID, personne ne peut se connecter.',
    'push.request.account': 'Aller à mon compte',
    'push.devices': 'Appareils qui reçoivent les notifications', 'push.thisDevice': 'Cet appareil', 'push.since': 'ajouté {when}',
    'push.remove': 'Retirer', 'push.removed': 'Appareil retiré : il ne recevra plus de notifications.',
  },
  en: {
    'push.title': 'Notifications', 'push.desc': 'Get Passcord sign-in requests and suite news on this device.',
    'push.on': 'On for this device', 'push.off': 'Off for this device',
    'push.enable': 'Turn on notifications', 'push.disable': 'Turn off', 'push.enabled': 'Notifications are on for this device.',
    'push.disabled': 'Notifications are off for this device.', 'push.denied': 'Notifications are blocked: allow them in your browser settings.',
    'push.unsupported': 'This browser doesn’t support push notifications.',
    'push.iosInstall': 'On iPhone, notifications go through the Cord Account app: in Safari, tap Share then “Add to Home Screen”, open Cord Account from the icon and come back here.',
    'push.iosTip': 'Turn them on on your iPhone: every Passcord sign-in request will reach you as a notification.',
    'push.request.title': 'Sign-in request', 'push.request.desc': 'A device wants to sign in to your Cord Account. Open Passcord, pick the number shown on the other screen and approve with Face ID.',
    'push.request.open': 'Open Passcord', 'push.request.ignore': 'Didn’t ask for this? Ignore it: without your iPhone and Face ID, nobody can sign in.',
    'push.request.account': 'Go to my account',
    'push.devices': 'Devices getting notifications', 'push.thisDevice': 'This device', 'push.since': 'added {when}',
    'push.remove': 'Remove', 'push.removed': 'Device removed: it won’t get notifications anymore.',
  },
});

/** Identifiant serveur d'un abonnement (même calcul que le service : sha256 base64url). */
async function pushId(endpoint) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`push:${endpoint}`));
  return bytesToB64u(digest);
}

function pushDevicesList(currentId) {
  const devices = state.account?.pushDevices ?? [];
  if (!devices.length) return '';
  return html`<div class="push-devices"><p class="tiny subtle">${t('push.devices')}</p>
    <ul class="list">${devices.map((d) => html`<li class="list-item">
      <span class="icon-badge ${d.id === currentId ? 'grad' : 'tone-muted'}">${icon('bell')}</span>
      <div class="body"><div class="title">${d.device || d.service}${d.id === currentId ? html`<span class="badge tone-ok"><span class="dot"></span>${t('push.thisDevice')}</span>` : ''}</div>
        <div class="meta"><span>${t('push.since', { when: fmtRelative(d.createdAt) })}</span><span class="mono">${d.service}</span></div></div>
      <div class="actions compact"><button type="button" class="btn btn-ghost btn-sm" data-action="push-remove" data-id="${d.id}">${icon('bell-off')}${t('push.remove')}</button></div>
    </li>`)}</ul></div>`;
}

const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

async function pushSubscription() {
  if (!pushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration('/');
  return registration ? registration.pushManager.getSubscription() : null;
}

async function enablePush() {
  // Demandé tout de suite, dans le geste de l'utilisateur (exigé par iOS).
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error(t('push.denied'));
  const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  await navigator.serviceWorker.ready;
  const { publicKey } = await api('/api/push/key');
  const subscription = (await registration.pushManager.getSubscription())
    ?? (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(publicKey) }));
  const json = subscription.toJSON();
  await api('/api/push/subscribe', { endpoint: json.endpoint, keys: json.keys });
}

async function disablePush() {
  const subscription = await pushSubscription();
  if (!subscription) return;
  await api('/api/push/unsubscribe', { endpoint: subscription.endpoint }).catch(() => {});
  await subscription.unsubscribe();
}

/** Carte « Notifications » (page Appareils) : remplie après le rendu, l'état vit dans le navigateur. */
function pushCardShell() {
  return html`<section class="card glass" data-push-card>
    <div class="card-head">
      <span class="icon-badge tone-info">${icon('bell')}</span>
      <div class="grow"><h2 class="card-title">${t('push.title')}</h2><p class="card-desc">${t('push.desc')}</p></div>
    </div>
    <div class="card-body" data-push-body><div class="skeleton sk-line"></div></div>
  </section>`;
}

async function mountPushCard(root) {
  const body = $('[data-push-body]', root);
  if (!body) return;
  if (isIos() && !isStandalone()) {
    render(body, html`<div class="push-hint">${icon('smartphone')}<p>${t('push.iosInstall')}</p></div>${pushDevicesList(null)}`);
    return;
  }
  if (!pushSupported()) {
    render(body, html`<p class="muted small">${t('push.unsupported')}</p>${pushDevicesList(null)}`);
    return;
  }
  const subscription = await pushSubscription().catch(() => null);
  const on = Boolean(subscription) && Notification.permission === 'granted';
  const currentId = subscription ? await pushId(subscription.endpoint).catch(() => null) : null;
  render(body, html`<div class="push-row">
      <span class="badge ${on ? 'tone-ok' : 'tone-muted'}"><span class="dot"></span>${on ? t('push.on') : t('push.off')}</span>
      <span class="spacer"></span>
      ${on
        ? html`<button type="button" class="btn btn-ghost btn-sm" data-action="push-disable">${icon('bell-off')}${t('push.disable')}</button>`
        : html`<button type="button" class="btn btn-primary btn-sm" data-action="push-enable">${icon('bell')}${t('push.enable')}</button>`}
    </div>
    ${!on && !isIos() ? html`<p class="tiny subtle">${t('push.iosTip')}</p>` : ''}
    ${pushDevicesList(currentId)}`);
}

Object.assign(ACTIONS, {
  async 'push-enable'(button) {
    await busy(button, enablePush);
    toast(t('push.enabled'));
    await loadAccount().catch(() => {});
    mountPushCard(button.closest('[data-push-card]') ?? document);
  },
  async 'push-disable'(button) {
    await busy(button, disablePush);
    toast(t('push.disabled'), { type: 'info' });
    await loadAccount().catch(() => {});
    mountPushCard(button.closest('[data-push-card]') ?? document);
  },
  async 'push-remove'(button) {
    const card = button.closest('[data-push-card]') ?? document;
    await busy(button, () => api('/api/push/devices', { id: button.dataset.id }, 'DELETE'));
    // Cet appareil-ci : on se désabonne aussi dans le navigateur.
    const subscription = await pushSubscription().catch(() => null);
    if (subscription && (await pushId(subscription.endpoint)) === button.dataset.id) await subscription.unsubscribe().catch(() => {});
    toast(t('push.removed'), { type: 'info' });
    await loadAccount().catch(() => {});
    mountPushCard(card);
  },
});

/** Ouverte depuis une notification : la demande part dans Passcord d'un geste. */
function showPasscordRequest(link) {
  const app = $('#app');
  app.removeAttribute('aria-busy');
  document.title = `${t('push.request.title')} · Compte Cord`;
  render(app, html`<main class="consent-page" id="main"><section class="consent glass passcord-request" aria-live="polite">
    <div class="auth-illu"><div class="icon-badge grad">${icon('smartphone')}</div></div>
    <h1>${t('push.request.title')}</h1>
    <p class="sub">${t('push.request.desc')}</p>
    <a class="btn btn-primary btn-lg btn-block" href="${link}">${icon('external-link')}${t('push.request.open')}</a>
    <p class="tiny subtle">${t('push.request.ignore')}</p>
    <a class="btn btn-ghost btn-block" href="/">${t('push.request.account')}</a>
  </section></main>`);
}
