/* Briques d'interface partagées : avatars, QR, anneaux, champs mot de passe. */

messages({
  fr: {
    'common.close': 'Fermer', 'common.cancel': 'Annuler', 'common.save': 'Enregistrer', 'common.continue': 'Continuer',
    'common.copy': 'Copier', 'common.copied': 'Copié dans le presse-papiers.', 'common.back': 'Retour', 'common.done': 'Terminé',
    'common.rename': 'Renommer', 'common.remove': 'Supprimer', 'common.revoke': 'Révoquer', 'common.retry': 'Réessayer',
    'common.device': 'Appareil', 'common.name': 'Nom', 'common.show': 'Afficher', 'common.hide': 'Masquer', 'common.open': 'Ouvrir',
    'common.never': 'Jamais', 'common.today': 'Aujourd’hui', 'common.yesterday': 'Hier', 'common.loading': 'Chargement…',
    'common.or': 'ou', 'common.enabled': 'Activée', 'common.disabled': 'Désactivée', 'common.new': 'Nouveau',
    'time.now': 'à l’instant',
    'error.network': 'Connexion impossible au Compte Cord. Vérifie ta connexion Internet.',
    'error.server': 'Le service Cord ne répond pas correctement. Réessaie dans un instant.',
    'error.rate': 'Trop de tentatives. Patiente un peu avant de réessayer.',
    'error.form': 'Vérifie les champs du formulaire.',
    'error.copy': 'Copie impossible : sélectionne le texte à la main.',
    'reason.mfa_required': 'Saisis le code de ton application d’authentification.',
    'reason.mfa_invalid': 'Ce code ne fonctionne pas. Vérifie l’heure de ton téléphone ou utilise un code de secours.',
    'reason.password_invalid': 'Mot de passe incorrect.',
    'reason.mfa_unreadable': 'Ton application d’authentification ne peut pas être vérifiée pour le moment : utilise un code de secours.',
    'reason.passkey_unknown': 'Cette passkey n’est plus liée à un compte Cord. Supprime-la de ton gestionnaire.',
    'password.show': 'Afficher le mot de passe', 'password.hide': 'Masquer le mot de passe',
    'strength.0': ' ', 'strength.1': 'Trop faible', 'strength.2': 'Moyen', 'strength.3': 'Solide', 'strength.4': 'Excellent',
    'strength.hint': '12 caractères minimum. Une phrase de passe fonctionne très bien.',
    'status.live': 'En ligne', 'status.beta': 'En développement', 'status.soon': 'Bientôt',
    'device.desktop': 'Ordinateur', 'device.mobile': 'Mobile', 'device.tablet': 'Tablette', 'device.api': 'Application', 'device.unknown': 'Appareil',
  },
  en: {
    'common.close': 'Close', 'common.cancel': 'Cancel', 'common.save': 'Save', 'common.continue': 'Continue',
    'common.copy': 'Copy', 'common.copied': 'Copied to clipboard.', 'common.back': 'Back', 'common.done': 'Done',
    'common.rename': 'Rename', 'common.remove': 'Remove', 'common.revoke': 'Revoke', 'common.retry': 'Try again',
    'common.device': 'Device', 'common.name': 'Name', 'common.show': 'Show', 'common.hide': 'Hide', 'common.open': 'Open',
    'common.never': 'Never', 'common.today': 'Today', 'common.yesterday': 'Yesterday', 'common.loading': 'Loading…',
    'common.or': 'or', 'common.enabled': 'On', 'common.disabled': 'Off', 'common.new': 'New',
    'time.now': 'just now',
    'error.network': 'Can’t reach Cord Account. Check your internet connection.',
    'error.server': 'The Cord service isn’t responding properly. Try again in a moment.',
    'error.rate': 'Too many attempts. Wait a little before trying again.',
    'error.form': 'Please check the form fields.',
    'error.copy': 'Couldn’t copy: select the text manually.',
    'reason.mfa_required': 'Enter the code from your authenticator app.',
    'reason.mfa_invalid': 'That code doesn’t work. Check your phone’s clock or use a recovery code.',
    'reason.password_invalid': 'Wrong password.',
    'reason.mfa_unreadable': 'Your authenticator app can’t be verified right now: use a recovery code.',
    'reason.passkey_unknown': 'This passkey is no longer linked to a Cord account. Remove it from your password manager.',
    'password.show': 'Show password', 'password.hide': 'Hide password',
    'strength.0': ' ', 'strength.1': 'Too weak', 'strength.2': 'Fair', 'strength.3': 'Strong', 'strength.4': 'Excellent',
    'strength.hint': 'At least 12 characters. A passphrase works great.',
    'status.live': 'Live', 'status.beta': 'In development', 'status.soon': 'Coming soon',
    'device.desktop': 'Computer', 'device.mobile': 'Mobile', 'device.tablet': 'Tablet', 'device.api': 'App', 'device.unknown': 'Device',
  },
});

const SUITE_ACCENTS = [['#6D64F2', '#C64BF1'], ['#126A84', '#1CC3E0'], ['#BD2F98', '#F65D63'], ['#1E8FDC', '#1E61DC'], ['#19A684', '#37CC94'], ['#F16C8E', '#F9A159'], ['#EB981F', '#EF6327'], ['#6E58F0', '#B842EC']];

/** Avatar : photo si présente, sinon « identicon » dégradé + initiales. */
function avatar(user, size = '') {
  const cls = `avatar ${size ? `avatar-${size}` : ''}`;
  if (user?.avatarUrl) return html`<span class="${cls}"><img src="${user.avatarUrl}" alt="" loading="lazy" decoding="async"></span>`;
  const seed = hashString(user?.id || user?.email || 'cord');
  const [a, b] = SUITE_ACCENTS[seed % SUITE_ACCENTS.length];
  const angle = seed % 360;
  const initials = (user?.name || user?.email || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';
  const gid = `g${seed.toString(36)}`;
  return html`<span class="${cls}"><svg viewBox="0 0 100 100" role="img" aria-label="${user?.name ?? ''}">
    <defs><linearGradient id="${gid}" gradientTransform="rotate(${angle % 90} .5 .5)"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="100" height="100" fill="url(#${gid})"/>
    <circle cx="${20 + (seed % 60)}" cy="${18 + ((seed >> 3) % 30)}" r="${26 + ((seed >> 5) % 18)}" fill="#fff" opacity=".13"/>
    <circle cx="${80 - ((seed >> 7) % 50)}" cy="${86 - ((seed >> 9) % 20)}" r="${20 + ((seed >> 11) % 16)}" fill="#000" opacity=".12"/>
    <text x="50" y="50" dy=".36em" text-anchor="middle" font-size="${initials.length > 1 ? 38 : 44}" class="avatar-initials">${initials}</text>
  </svg></span>`;
}

/** QR code en SVG (modules arrondis, dégradé de la suite, logo au centre). */
function qrSvg(text, { logo = '/assets/icon-180.png' } = {}) {
  const qr = qrcode(0, 'Q');
  qr.addData(text);
  qr.make();
  const count = qr.getModuleCount();
  const margin = 1;
  const size = count + margin * 2;
  // Validé au décodeur (jsQR) : modules arrondis de 0,92, logo à 20 %, niveau Q.
  const logoSpan = Math.ceil(count * 0.2) | 1;
  const start = Math.floor((count - logoSpan) / 2);
  const inLogo = (r, c) => logo && r >= start - 1 && r <= start + logoSpan && c >= start - 1 && c <= start + logoSpan;
  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);
  const s = 0.92, k = 0.28, e = (s - 2 * k).toFixed(2), i0 = (1 - s) / 2;
  let dots = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.isDark(r, c) || isFinder(r, c) || inLogo(r, c)) continue;
      const x = (c + margin + i0).toFixed(2);
      const y = (r + margin + i0).toFixed(2);
      dots += `M${x},${y}m${k},0h${e}a${k},${k} 0 0 1 ${k},${k}v${e}a${k},${k} 0 0 1 -${k},${k}h-${e}a${k},${k} 0 0 1 -${k},-${k}v-${e}a${k},${k} 0 0 1 ${k},-${k}z`;
    }
  }
  const finder = (x, y) =>
    `<rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" rx="1.7" fill="none" stroke="url(#qrg)" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".9" fill="url(#qrg)"/>`;
  const svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="QR code">
    <defs><linearGradient id="qrg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b33d6"/><stop offset=".55" stop-color="#7a3fe0"/><stop offset="1" stop-color="#b52fcf"/></linearGradient></defs>
    <path d="${dots}" fill="url(#qrg)"/>${finder(margin, margin)}${finder(margin + count - 7, margin)}${finder(margin, margin + count - 7)}</svg>`;
  return html`${raw(svg)}${logo ? html`<img class="qr-logo" src="${logo}" alt="">` : ''}`;
}

/** Anneau de score (0-100). */
function scoreRing(value, { size = 112, stroke = 10, label, caption } = {}) {
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const offset = length * (1 - Math.max(0, Math.min(100, value)) / 100);
  return html`<div class="ring" role="img" aria-label="${caption ?? ''} ${value}/100">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6e58f0"/><stop offset=".5" stop-color="#b842ec"/><stop offset="1" stop-color="#d24bef"/></linearGradient></defs>
      <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}"/>
      <circle class="value" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}" data-dash="${length.toFixed(1)},${offset.toFixed(1)}"/>
    </svg>
    <div class="label"><strong>${label ?? value}</strong><small>${caption ?? ''}</small></div>
  </div>`;
}

/** Champ mot de passe avec bouton « afficher ». */
function passwordField({ name = 'password', label, autocomplete = 'current-password', minlength, strength = false, hint, autofocus = false, required = true, id }) {
  const fieldId = id ?? `f-${name}-${Math.random().toString(36).slice(2, 7)}`;
  return html`<div class="field">
    <label for="${fieldId}">${label}</label>
    <div class="input-wrap">
      <input class="input" id="${fieldId}" type="password" name="${name}" autocomplete="${autocomplete}" maxlength="512"
        ${minlength ? raw(`minlength="${minlength}"`) : ''} ${required ? raw('required') : ''} ${autofocus ? raw('autofocus') : ''}
        ${strength ? raw('data-strength') : ''} spellcheck="false" autocapitalize="off">
      <button type="button" class="btn btn-ghost btn-icon btn-sm input-action" data-reveal aria-label="${t('password.show')}" aria-pressed="false">${icon('eye')}</button>
    </div>
    ${strength ? html`<div class="strength" data-score="0" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <div class="strength-label"><span data-strength-label>${hint ?? t('strength.hint')}</span></div>` : hint ? html`<p class="field-hint">${hint}</p>` : ''}
  </div>`;
}
// Délégation : afficher/masquer + jauge de force, pour tous les champs du portail.
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-reveal]');
  if (!button) return;
  const input = button.parentElement.querySelector('input');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(show));
  button.setAttribute('aria-label', t(show ? 'password.hide' : 'password.show'));
  render(button, icon(show ? 'eye-off' : 'eye'));
});
document.addEventListener('input', (event) => {
  const input = event.target;
  if (!input.matches?.('[data-strength]')) return;
  const field = input.closest('.field');
  const score = input.value ? passwordScore(input.value) : 0;
  $('.strength', field).dataset.score = String(score);
  $('[data-strength-label]', field).textContent = input.value ? t(`strength.${score}`) : t('strength.hint');
});

/** Logo d'app de la suite (ou pastille à l'initiale). */
function appLogo(app, cls = '') {
  return app?.logo
    ? html`<img class="${cls}" src="${app.logo}" alt="" width="46" height="46" loading="lazy">`
    : html`<span class="fallback ${cls}">${(app?.name ?? '?').slice(0, 1)}</span>`;
}
function statusBadge(status) {
  const tone = { live: 'tone-ok', beta: 'tone-warn', soon: 'tone-muted' }[status] ?? 'tone-muted';
  return html`<span class="badge ${tone}">${status === 'live' ? html`<span class="dot"></span>` : ''}${t(`status.${status}`)}</span>`;
}
const deviceIcon = (kind) => ({ desktop: 'laptop', mobile: 'smartphone', tablet: 'tablet-smartphone', api: 'cpu' })[kind] ?? 'monitor-smartphone';

function emptyState({ iconName, title, desc, action }) {
  return html`<div class="empty"><div class="icon-badge lg tone-muted">${icon(iconName)}</div><p class="title">${title}</p>${desc ? html`<p class="desc">${desc}</p>` : ''}${action ?? ''}</div>`;
}

/** Compte à rebours circulaire (Passcord, 3 minutes). Renvoie stop(). */
function startCountdown(el, expiresAt, onExpire) {
  const total = Math.max(1, expiresAt - Date.now());
  const r = 7;
  const length = 2 * Math.PI * r;
  render(el, html`<svg viewBox="0 0 18 18"><circle class="track" cx="9" cy="9" r="${r}"/><circle class="value" cx="9" cy="9" r="${r}"/></svg><span></span>`);
  const circle = $('.value', el);
  circle.style.strokeDasharray = String(length);
  const label = $('span', el);
  let timer;
  const tick = () => {
    const left = Math.max(0, expiresAt - Date.now());
    label.textContent = `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}`;
    circle.style.strokeDashoffset = String(length * (1 - left / total));
    if (left <= 0) { clearInterval(timer); onExpire?.(); }
  };
  tick();
  timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}
