/* Palette de commandes (Ctrl/⌘ K ou « / ») : aller partout, ouvrir une app, agir. */

messages({
  fr: {
    'palette.placeholder': 'Rechercher une page, une app, une action…', 'palette.empty': 'Rien ne correspond à « {q} ».',
    'palette.go': 'Aller à', 'palette.apps': 'Apps', 'palette.actions': 'Actions', 'palette.pages': 'Pages',
    'palette.hint': '↑↓ pour choisir · Entrée pour valider · Échap pour fermer',
    'cmd.passkey': 'Ajouter une passkey', 'cmd.totp': 'Activer la double authentification', 'cmd.password': 'Changer de mot de passe',
    'cmd.export': 'Exporter mes données', 'cmd.pair': 'Associer Passcord', 'cmd.inbox': 'Ouvrir les notifications',
    'cmd.theme': 'Basculer thème clair / sombre', 'cmd.lang': 'Switch to English', 'cmd.logout': 'Se déconnecter',
    'cmd.open': 'Ouvrir {app}', 'cmd.verify': 'Confirmer mon adresse email',
  },
  en: {
    'palette.placeholder': 'Search a page, an app, an action…', 'palette.empty': 'Nothing matches “{q}”.',
    'palette.go': 'Go to', 'palette.apps': 'Apps', 'palette.actions': 'Actions', 'palette.pages': 'Pages',
    'palette.hint': '↑↓ to pick · Enter to run · Esc to close',
    'cmd.passkey': 'Add a passkey', 'cmd.totp': 'Turn on two-factor authentication', 'cmd.password': 'Change password',
    'cmd.export': 'Export my data', 'cmd.pair': 'Pair Passcord', 'cmd.inbox': 'Open notifications',
    'cmd.theme': 'Toggle light / dark theme', 'cmd.lang': 'Passer en français', 'cmd.logout': 'Sign out',
    'cmd.open': 'Open {app}', 'cmd.verify': 'Confirm my email address',
  },
});

const fold = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function paletteCommands() {
  const a = state.account;
  const user = a.user;
  const go = (hash) => () => { location.hash = hash; };
  const run = (name) => () => ACTIONS[name]?.(null);
  const commands = [];
  for (const r of ROUTES.filter((x) => !x.admin || user.admin)) {
    commands.push({ group: 'pages', icon: r.icon, label: t(r.label), hint: t('palette.go'), keys: r.id, run: go(r.id) });
  }
  if (!user.emailVerified) commands.push({ group: 'actions', icon: 'mail-check', label: t('cmd.verify'), run: go('apercu') });
  commands.push(
    { group: 'actions', icon: 'fingerprint-pattern', label: t('cmd.passkey'), keys: 'passkey face id', run: () => { location.hash = 'securite'; setTimeout(() => ACTIONS['passkey-add']?.($('[data-action="passkey-add"]')), 120); } },
    ...(a.security.mfa ? [] : [{ group: 'actions', icon: 'shield-check', label: t('cmd.totp'), keys: '2fa totp mfa', run: () => { location.hash = 'securite'; setTimeout(() => ACTIONS['totp-setup']?.($('[data-action="totp-setup"]')), 120); } }]),
    { group: 'actions', icon: 'smartphone', label: t('cmd.pair'), keys: 'passcord iphone qr', run: go('appareils') },
    { group: 'actions', icon: 'key-round', label: t('cmd.password'), keys: 'mot de passe password', run: go('securite') },
    { group: 'actions', icon: 'bell', label: t('cmd.inbox'), keys: 'inbox notifications', run: run('inbox') },
    { group: 'actions', icon: 'download', label: t('cmd.export'), keys: 'rgpd gdpr export json', run: go('confidentialite') },
    { group: 'actions', icon: effectiveTheme() === 'dark' ? 'sun' : 'moon', label: t('cmd.theme'), keys: 'dark light', run: run('toggle-theme') },
    { group: 'actions', icon: 'languages', label: t('cmd.lang'), keys: 'langue language', run: run('toggle-locale') },
    { group: 'actions', icon: 'log-out', label: t('cmd.logout'), keys: 'logout', run: run('logout') },
  );
  for (const app of state.hub?.apps ?? []) {
    if (!app.launch || app.status === 'soon') continue;
    commands.push({ group: 'apps', img: app.logo, label: t('cmd.open', { app: app.name }), hint: app.tagline, keys: app.slug, run: () => window.open(app.launch, '_blank', 'noopener') });
  }
  return commands;
}

function openPalette() {
  if (!state.account || $('dialog.palette')) return;
  const commands = paletteCommands();
  let query = '';
  let index = 0;
  let shown = commands;
  const dialog = document.createElement('dialog');
  dialog.className = 'palette';
  dialog.setAttribute('aria-label', t('nav.search'));
  const list = () => {
    const tokens = fold(query).split(/\s+/).filter(Boolean);
    shown = tokens.length ? commands.filter((c) => tokens.every((tok) => fold(`${c.label} ${c.keys ?? ''} ${c.hint ?? ''}`).includes(tok))) : commands;
    index = Math.min(index, Math.max(0, shown.length - 1));
    if (!shown.length) return html`<p class="palette-empty">${t('palette.empty', { q: query })}</p>`;
    let group = '';
    return html`${shown.map((c, i) => {
      const head = c.group !== group ? html`<p class="palette-group">${t(`palette.${c.group}`)}</p>` : '';
      group = c.group;
      return html`${head}<button type="button" class="palette-item" role="option" data-index="${i}" ${i === index ? raw('aria-selected="true"') : ''}>
        ${c.img ? html`<img src="${c.img}" alt="" width="22" height="22">` : html`<span class="palette-ic">${icon(c.icon)}</span>`}
        <span class="label">${c.label}</span>${c.hint ? html`<span class="hint">${c.hint}</span>` : ''}${i === index ? html`<span class="enter">${icon('corner-down-left')}</span>` : ''}</button>`;
    })}`;
  };
  render(dialog, html`<div class="palette-inner">
    <label class="palette-search">${icon('search')}<input type="text" placeholder="${t('palette.placeholder')}" autocomplete="off" spellcheck="false" aria-label="${t('nav.search')}"><kbd>Esc</kbd></label>
    <div class="palette-list" role="listbox">${list()}</div>
    <p class="palette-foot">${icon('command')}${t('palette.hint')}</p>
  </div>`);
  const input = $('input', dialog);
  const listBox = $('.palette-list', dialog);
  const redraw = () => {
    render(listBox, list());
    $('[aria-selected="true"]', listBox)?.scrollIntoView({ block: 'nearest' });
  };
  const close = () => { dialog.classList.add('closing'); setTimeout(() => dialog.close(), 140); };
  const exec = (i) => {
    const c = shown[i];
    if (!c) return;
    close();
    setTimeout(() => Promise.resolve(c.run()).catch(toastError), 60);
  };
  input.addEventListener('input', () => { query = input.value; index = 0; redraw(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); index = (index + 1) % Math.max(1, shown.length); redraw(); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); index = (index - 1 + shown.length) % Math.max(1, shown.length); redraw(); }
    else if (event.key === 'Enter') { event.preventDefault(); exec(index); }
  });
  listBox.addEventListener('click', (event) => {
    const item = event.target.closest('[data-index]');
    if (item) exec(Number(item.dataset.index));
  });
  listBox.addEventListener('pointermove', (event) => {
    const item = event.target.closest('[data-index]');
    if (item && Number(item.dataset.index) !== index) { index = Number(item.dataset.index); redraw(); }
  });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
  input.focus();
}

ACTIONS.palette = () => openPalette();
document.addEventListener('keydown', (event) => {
  if (!state.account || location.pathname.startsWith('/authorize')) return;
  const typing = event.target.closest?.('input, textarea, select, [contenteditable="true"]');
  if ((event.key === 'k' || event.key === 'K') && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    openPalette();
  } else if (event.key === '/' && !typing && !$('dialog[open]')) {
    event.preventDefault();
    openPalette();
  }
});
