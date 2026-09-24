/* ───────────────────────────────────────────────────────────────────────
 * Noyau du portail : rendu échappé, i18n, API, toasts, modales, utilitaires.
 * Aucune dépendance, compatible CSP stricte (pas de style/script en ligne :
 * les valeurs dynamiques passent par le CSSOM dans hydrate()).
 * ─────────────────────────────────────────────────────────────────────── */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// ── Rendu : gabarits étiquetés qui échappent toute interpolation ─────────
class Safe {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };
function escapeValue(value) {
  if (value == null || value === false || value === true) return '';
  if (value instanceof Safe) return value.value;
  if (Array.isArray(value)) return value.map(escapeValue).join('');
  return String(value).replace(/[&<>"'`]/g, (c) => ESCAPES[c]);
}
const html = (strings, ...values) =>
  new Safe(strings.reduce((out, chunk, i) => out + chunk + (i < values.length ? escapeValue(values[i]) : ''), ''));
const raw = (value) => new Safe(String(value));
const icon = (name, cls = '') => raw(`<svg class="i ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`);

function render(target, template) {
  target.innerHTML = escapeValue(template);
  hydrate(target);
  return target;
}

/** Applique les valeurs dynamiques via le CSSOM (autorisé par la CSP). */
function hydrate(root) {
  for (const el of $$('[data-accent]', root)) {
    const [a, b] = el.dataset.accent.split(',');
    el.style.setProperty('--a', a);
    el.style.setProperty('--b', b || a);
  }
  for (const el of $$('[data-width]', root)) el.style.setProperty('--w', `${Math.max(0, Math.min(100, Number(el.dataset.width)))}%`);
  for (const el of $$('[data-height]', root)) el.style.height = `${Math.max(2, Number(el.dataset.height))}%`;
  for (const el of $$('[data-dash]', root)) {
    // Animation CSS (et non transition + rAF) : l'état final s'applique même
    // si l'onglet est en arrière-plan au moment du rendu.
    const [length, offset] = el.dataset.dash.split(',');
    el.style.setProperty('--len', length);
    el.style.setProperty('--offset', offset);
  }
  for (const el of $$('[data-delay]', root)) el.style.animationDelay = `${el.dataset.delay}ms`;
}

// Lumière qui suit le pointeur sur les panneaux de verre.
document.addEventListener('pointermove', (event) => {
  const glass = event.target.closest?.('.glass');
  if (!glass || event.pointerType === 'touch') return;
  const rect = glass.getBoundingClientRect();
  glass.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  glass.style.setProperty('--my', `${event.clientY - rect.top}px`);
}, { passive: true });

// ── i18n ─────────────────────────────────────────────────────────────────
const MESSAGES = { fr: {}, en: {} };
const LOCALES = ['fr', 'en'];
let locale = 'fr';
function messages(dict) {
  for (const lang of LOCALES) Object.assign(MESSAGES[lang], dict[lang] ?? {});
}
/** t('clé', { var }) — repli : français, puis la clé elle-même. */
function t(key, vars) {
  let text = MESSAGES[locale][key] ?? MESSAGES.fr[key] ?? key;
  if (typeof text === 'function') text = text(vars ?? {});
  if (vars) text = text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
  return text;
}
function setLocale(next) {
  locale = LOCALES.includes(next) ? next : 'fr';
  document.documentElement.lang = locale;
  try { localStorage.setItem('cord:locale', locale); } catch { /* stockage indisponible */ }
}
function initialLocale() {
  try {
    const saved = localStorage.getItem('cord:locale');
    if (LOCALES.includes(saved)) return saved;
  } catch { /* stockage indisponible */ }
  return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'fr';
}
const intlLocale = () => (locale === 'fr' ? 'fr-FR' : 'en-GB');
const fmtDate = (ms) => (ms ? new Intl.DateTimeFormat(intlLocale(), { dateStyle: 'long' }).format(new Date(ms)) : '—');
const fmtDateShort = (ms) => (ms ? new Intl.DateTimeFormat(intlLocale(), { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(ms)) : '—');
const fmtDateTime = (ms) => (ms ? new Intl.DateTimeFormat(intlLocale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms)) : '—');
const fmtTime = (ms) => new Intl.DateTimeFormat(intlLocale(), { hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
function fmtRelative(ms) {
  if (!ms) return '—';
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(intlLocale(), { numeric: 'auto' });
  if (abs < 60_000) return t('time.now');
  if (abs < 3600_000) return rtf.format(Math.round(diff / 60_000), 'minute');
  if (abs < 86400_000) return rtf.format(Math.round(diff / 3600_000), 'hour');
  if (abs < 30 * 86400_000) return rtf.format(Math.round(diff / 86400_000), 'day');
  if (abs < 365 * 86400_000) return rtf.format(Math.round(diff / (30 * 86400_000)), 'month');
  return rtf.format(Math.round(diff / (365 * 86400_000)), 'year');
}
const plural = (n, key) => t(n === 1 ? `${key}.one` : `${key}.other`, { n });

// ── Thème ────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark' || theme === 'light') root.dataset.theme = theme;
  else delete root.dataset.theme;
  try { localStorage.setItem('cord:theme', theme || 'system'); } catch { /* stockage indisponible */ }
}
function savedTheme() {
  try { return localStorage.getItem('cord:theme') || 'system'; } catch { return 'system'; }
}
const effectiveTheme = () =>
  document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

// ── API ──────────────────────────────────────────────────────────────────
class ApiError extends Error {
  constructor(message, status, reason) { super(message); this.status = status; this.reason = reason; }
}
async function api(path, data, method = data === undefined ? 'GET' : 'POST') {
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: method === 'GET' ? { Accept: 'application/json' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
      ...(method === 'GET' ? {} : { body: JSON.stringify(data ?? {}) }),
    });
  } catch {
    throw new ApiError(t('error.network'), 0);
  }
  let body = {};
  try { body = await response.json(); } catch { /* réponse vide */ }
  if (!response.ok) throw new ApiError(translateError(body.error, body.reason, response.status), response.status, body.reason);
  return body;
}
function translateError(message, reason, status) {
  if (reason && MESSAGES[locale][`reason.${reason}`]) return t(`reason.${reason}`);
  if (locale !== 'fr' && status === 429) return t('error.rate');
  if (locale !== 'fr' && status >= 500) return t('error.server');
  return message || t('error.server');
}

// ── Notifications ────────────────────────────────────────────────────────
function toast(message, { type = 'success', duration = type === 'error' ? 7000 : 4500, action } = {}) {
  const host = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  const lead = { success: 'circle-check', error: 'circle-alert', info: 'info' }[type] ?? 'info';
  render(el, html`${icon(lead, 'lead')}<div class="body">${message}${action ? html` <a href="${action.href}" ${action.external ? raw('target="_blank" rel="noopener"') : ''}>${action.label}</a>` : ''}</div>
    <button class="btn btn-ghost btn-icon btn-sm close" aria-label="${t('common.close')}">${icon('x')}</button>
    <span class="bar"></span>`);
  $('.bar', el).style.animationDuration = `${duration}ms`;
  const close = () => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  };
  $('.close', el).addEventListener('click', close);
  let timer = setTimeout(close, duration);
  el.addEventListener('pointerenter', () => { clearTimeout(timer); $('.bar', el).style.animationPlayState = 'paused'; });
  el.addEventListener('pointerleave', () => { timer = setTimeout(close, 2000); $('.bar', el).style.animationPlayState = 'running'; });
  host.append(el);
  while (host.children.length > 4) host.firstElementChild.remove();
}
const toastError = (e) => toast(e?.message || t('error.server'), { type: 'error' });

// ── Modales (<dialog> natif : focus piégé, Échap, accessibilité) ─────────
/**
 * modal({ title, desc, icon, tone, body, actions, wide, onSubmit, onOpen, dismissible })
 * `body` et `actions` : gabarits html (ou fonctions qui en renvoient).
 * `onSubmit(formData, ctx)` : async ; ctx.close(), ctx.setBody(), ctx.error().
 * Renvoie une promesse résolue à la fermeture avec la valeur passée à close().
 */
function modal({ title, desc, iconName, tone = '', body, actions, wide = false, onSubmit, onOpen, dismissible = true, labelledBy }) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = `modal${wide ? ' wide' : ''}`;
    const titleId = `m-${Math.random().toString(36).slice(2, 9)}`;
    dialog.setAttribute('aria-labelledby', labelledBy ?? titleId);
    let result;
    const ctx = {
      dialog,
      close(value) {
        result = value;
        dialog.classList.add('closing');
        setTimeout(() => dialog.close(), 170);
      },
      setBody(template) {
        render($('.modal-content', dialog), typeof template === 'function' ? template() : template);
      },
      error(message) {
        const box = $('.modal-error', dialog);
        if (!message) { box.hidden = true; return; }
        render(box, html`${icon('circle-alert')}<span>${message}</span>`);
        box.hidden = false;
      },
    };
    render(dialog, html`<div class="sheet-handle"></div>
      <form class="modal-inner" method="dialog" novalidate>
        <div class="modal-head">
          ${iconName ? html`<div class="icon-badge ${tone}">${icon(iconName)}</div>` : ''}
          <div class="grow"><h2 class="modal-title" id="${titleId}">${title}</h2>${desc ? html`<p class="modal-desc">${desc}</p>` : ''}</div>
          ${dismissible ? html`<button type="button" class="btn btn-ghost btn-icon modal-close" data-close aria-label="${t('common.close')}">${icon('x')}</button>` : ''}
        </div>
        <div class="modal-content stack">${typeof body === 'function' ? body() : body ?? ''}</div>
        <div class="modal-error" role="alert" hidden></div>
        ${actions ? html`<div class="modal-actions">${typeof actions === 'function' ? actions() : actions}</div>` : ''}
      </form>`);
    const form = $('form', dialog);
    dialog.addEventListener('click', (event) => {
      if (event.target.closest('[data-close]')) { event.preventDefault(); ctx.close(); }
      else if (event.target === dialog && dismissible) ctx.close();
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      if (dismissible) ctx.close();
    });
    dialog.addEventListener('close', () => { dialog.remove(); resolve(result); });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!onSubmit) return ctx.close(true);
      const submitter = event.submitter ?? $('[type="submit"]', form);
      ctx.error(null);
      if (!form.checkValidity()) {
        const invalid = $(':invalid', form);
        invalid?.focus();
        ctx.error(invalid?.validationMessage || t('error.form'));
        return;
      }
      await busy(submitter, async () => {
        try {
          await onSubmit(new FormData(form), ctx, submitter);
        } catch (e) {
          ctx.error(e?.message || t('error.server'));
        }
      });
    });
    document.body.append(dialog);
    dialog.showModal();
    onOpen?.(ctx);
    const first = $('[autofocus]', dialog) ?? $('input:not([type="hidden"]), textarea, select', dialog);
    if (first) setTimeout(() => first.focus(), 60);
  });
}
function confirmDialog({ title, desc, confirm, tone = 'danger', iconName = 'triangle-alert', body }) {
  return modal({
    title,
    desc,
    iconName,
    tone: `tone-${tone}`,
    body,
    actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button>
      <button type="submit" class="btn ${tone === 'danger' ? 'btn-danger-solid' : 'btn-primary'}">${confirm}</button>`,
    onSubmit: async (_, ctx) => ctx.close(true),
  });
}

// ── Utilitaires ──────────────────────────────────────────────────────────
async function busy(button, fn) {
  if (!button) return fn();
  if (button.getAttribute('aria-busy') === 'true') return undefined;
  button.setAttribute('aria-busy', 'true');
  button.disabled = true;
  try {
    return await fn();
  } finally {
    button.removeAttribute('aria-busy');
    button.disabled = false;
  }
}
async function copyText(text, label = t('common.copied')) {
  try {
    await navigator.clipboard.writeText(text);
    toast(label, { type: 'success', duration: 2200 });
  } catch {
    toast(t('error.copy'), { type: 'error' });
  }
}
function downloadFile(name, content, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
const b64uToBytes = (text) => {
  const base = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(base + '='.repeat((4 - (base.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};
const bytesToB64u = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const isMobile = () => matchMedia('(max-width: 960px)').matches || /iPhone|iPad|Android/i.test(navigator.userAgent);
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const hashString = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
function deviceName() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iPad';
  if (/Android/.test(ua)) return 'Android';
  if (/Mac OS X|Macintosh/.test(ua)) return 'Mac';
  if (/Windows/.test(ua)) return 'Windows';
  if (/CrOS/.test(ua)) return 'Chromebook';
  if (/Linux/.test(ua)) return 'Linux';
  return t('common.device');
}

/** Petite pluie de confettis (respecte « mouvement réduit »). */
function celebrate() {
  if (reducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'celebrate';
  const colors = ['#6e58f0', '#8b5cff', '#b842ec', '#d24bef', '#3ddc97', '#6cc7ff', '#ffbe5c'];
  for (let i = 0; i < 70; i++) {
    const bit = document.createElement('i');
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = colors[i % colors.length];
    bit.style.setProperty('--dx', `${(Math.random() - 0.5) * 240}px`);
    bit.style.setProperty('--rot', `${360 + Math.random() * 720}deg`);
    bit.style.animationDelay = `${Math.random() * 400}ms`;
    bit.style.animationDuration = `${1400 + Math.random() * 900}ms`;
    layer.append(bit);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 2800);
}

/** Force d'un mot de passe : 0 à 4 (heuristique locale, rien n'est envoyé). */
function passwordScore(password) {
  if (!password) return 0;
  let score = 0;
  const length = password.length;
  if (length >= 12) score++;
  if (length >= 16) score++;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  if (classes >= 3) score++;
  if (length >= 20 || (classes === 4 && length >= 14) || /\s\S+\s/.test(password)) score++;
  if (/^(.)\1+$/.test(password) || /(password|motdepasse|azerty|qwerty|123456|cordcord)/i.test(password)) score = Math.min(score, 1);
  if (length < 12) score = Math.min(score, 1);
  return Math.max(1, Math.min(4, score));
}
