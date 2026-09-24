/* Confidentialité : inventaire des données, export RGPD, suppression du compte. */

messages({
  fr: {
    'privacy.title': 'Confidentialité', 'privacy.desc': 'Tout ce que le Compte Cord sait de toi, et comment le récupérer ou l’effacer.',
    'privacy.inventory': 'Ce que nous savons de toi',
    'inv.profile': 'Profil', 'inv.profile.desc': 'Nom, email{photo}, date d’inscription, préférences.',
    'inv.photo': ', photo',
    'inv.security': 'Sécurité', 'inv.security.desc': 'Mot de passe haché (scrypt){mfa}. Jamais lisibles, même par nous.',
    'inv.mfa': ', secret 2FA chiffré (AES-256-GCM), codes de secours hachés',
    'inv.keys': 'Clés de connexion', 'inv.keys.desc': 'Clés publiques de tes passkeys et iPhone Passcord. Les clés privées restent sur tes appareils.',
    'inv.sessions': 'Sessions', 'inv.sessions.desc': 'Appareil (navigateur, système), IP et dates. Jetons stockés hachés, expirent après 7 jours.',
    'inv.apps': 'Apps connectées', 'inv.apps.desc': 'Quelles apps tu as autorisées, quand, et avec quelles permissions.',
    'inv.events': 'Journal d’activité', 'inv.events.desc': 'Connexions et changements du compte, effacés automatiquement après 180 jours.',
    'privacy.never': 'Ce qu’on ne stocke jamais',
    'never.1': 'Ton mot de passe en clair — ni en base, ni dans les journaux.', 'never.2': 'La clé privée de Passcord ou de tes passkeys.',
    'never.3': 'Le contenu de tes apps : fichiers Drivecord, coffre Passcord, podcasts Tunecord…', 'never.4': 'De pisteur, de pub ou de cookie tiers. Un seul cookie : ta session.',
    'privacy.export': 'Exporter mes données', 'privacy.exportDesc': 'Un fichier JSON lisible avec tout ce qui précède (hors secrets, qu’on ne connaît pas en clair).',
    'privacy.exportBtn': 'Télécharger (JSON)', 'privacy.exported': 'Export téléchargé.',
    'privacy.delete': 'Supprimer mon compte', 'privacy.deleteDesc': 'Efface définitivement ton Compte Cord : profil, appareils, sessions, apps connectées et historique. Irréversible.',
    'privacy.deleteBtn': 'Supprimer mon compte…',
    'del.title': 'Supprimer définitivement ton compte ?', 'del.desc': 'Cette action ne peut pas être annulée.',
    'del.list.1': 'Tu seras déconnecté de toutes les apps de la suite.', 'del.list.2': 'Tes iPhone Passcord et passkeys ne fonctionneront plus.',
    'del.list.3': 'Les données propres à chaque app (fichiers Drivecord…) restent gérées par ces apps.',
    'del.confirm': 'Pour confirmer, saisis ton adresse email', 'del.mismatch': 'L’adresse ne correspond pas.', 'del.submit': 'Supprimer mon compte',
    'del.exportFirst': 'Exporter mes données d’abord', 'del.done': 'Ton compte a été supprimé. Merci d’avoir essayé Cord.',
  },
  en: {
    'privacy.title': 'Privacy', 'privacy.desc': 'Everything Cord Account knows about you, and how to take it back or erase it.',
    'privacy.inventory': 'What we know about you',
    'inv.profile': 'Profile', 'inv.profile.desc': 'Name, email{photo}, sign-up date, preferences.',
    'inv.photo': ', photo',
    'inv.security': 'Security', 'inv.security.desc': 'Hashed password (scrypt){mfa}. Never readable, not even by us.',
    'inv.mfa': ', encrypted 2FA secret (AES-256-GCM), hashed recovery codes',
    'inv.keys': 'Sign-in keys', 'inv.keys.desc': 'Public keys of your passkeys and Passcord iPhones. Private keys stay on your devices.',
    'inv.sessions': 'Sessions', 'inv.sessions.desc': 'Device (browser, OS), IP and dates. Tokens stored hashed, expire after 7 days.',
    'inv.apps': 'Connected apps', 'inv.apps.desc': 'Which apps you authorized, when, and with which permissions.',
    'inv.events': 'Activity log', 'inv.events.desc': 'Sign-ins and account changes, automatically erased after 180 days.',
    'privacy.never': 'What we never store',
    'never.1': 'Your plaintext password — not in the database, not in logs.', 'never.2': 'The private key of Passcord or your passkeys.',
    'never.3': 'Your apps’ content: Drivecord files, Passcord vault, Tunecord podcasts…', 'never.4': 'Trackers, ads or third-party cookies. One cookie only: your session.',
    'privacy.export': 'Export my data', 'privacy.exportDesc': 'A readable JSON file with everything above (except secrets, which we never know in plaintext).',
    'privacy.exportBtn': 'Download (JSON)', 'privacy.exported': 'Export downloaded.',
    'privacy.delete': 'Delete my account', 'privacy.deleteDesc': 'Permanently erases your Cord account: profile, devices, sessions, connected apps and history. Irreversible.',
    'privacy.deleteBtn': 'Delete my account…',
    'del.title': 'Permanently delete your account?', 'del.desc': 'This can’t be undone.',
    'del.list.1': 'You’ll be signed out of every app in the suite.', 'del.list.2': 'Your Passcord iPhones and passkeys will stop working.',
    'del.list.3': 'Each app’s own data (Drivecord files…) stays managed by that app.',
    'del.confirm': 'To confirm, type your email address', 'del.mismatch': 'The address doesn’t match.', 'del.submit': 'Delete my account',
    'del.exportFirst': 'Export my data first', 'del.done': 'Your account was deleted. Thanks for trying Cord.',
  },
});

VIEWS.confidentialite = {
  render(a) {
    const items = [
      ['user-round', 'profile', 1, { photo: a.user.avatarUrl ? t('inv.photo') : '' }],
      ['lock', 'security', null, { mfa: a.security.mfa ? t('inv.mfa') : '' }],
      ['fingerprint-pattern', 'keys', a.passkeys.length + a.passcord.length],
      ['monitor-smartphone', 'sessions', a.sessions.length],
      ['app-window', 'apps', a.apps.length],
      ['history', 'events', a.activity.length >= 40 ? '40+' : a.activity.length],
    ];
    return html`<div class="view">
      ${pageHead({ eyebrow: t('nav.section.data'), title: t('privacy.title'), desc: t('privacy.desc') })}
      <section class="card glass">
        <div class="card-head"><span class="icon-badge">${icon('database')}</span><div class="grow"><h2 class="card-title">${t('privacy.inventory')}</h2></div></div>
        <div class="inventory card-body">
          ${items.map(([ic, key, count, vars]) => html`<div class="item"><span class="icon-badge sm tone-muted">${icon(ic)}</span>
            <div><strong>${t(`inv.${key}`)}</strong><p>${t(`inv.${key}.desc`, vars ?? {})}</p></div>${count !== null && count !== undefined ? html`<span class="count">${count}</span>` : ''}</div>`)}
        </div>
      </section>
      <section class="card glass">
        <div class="card-head"><span class="icon-badge tone-ok">${icon('shield-check')}</span><div class="grow"><h2 class="card-title">${t('privacy.never')}</h2></div></div>
        <ul class="never card-body">${[1, 2, 3, 4].map((n) => html`<li>${icon('check')}<span>${t(`never.${n}`)}</span></li>`)}</ul>
      </section>
      <section class="card glass">
        <div class="method">
          <span class="icon-badge tone-info">${icon('file-json')}</span>
          <div><h2 class="card-title">${t('privacy.export')}</h2><p class="card-desc">${t('privacy.exportDesc')}</p></div>
          <div class="state"><button class="btn btn-glass" data-action="export-data">${icon('download')}${t('privacy.exportBtn')}</button></div>
        </div>
      </section>
      <section class="card glass danger-zone">
        <div class="method">
          <span class="icon-badge tone-danger">${icon('trash-2')}</span>
          <div><h2 class="card-title">${t('privacy.delete')}</h2><p class="card-desc">${t('privacy.deleteDesc')}</p></div>
          <div class="state"><button class="btn btn-danger" data-action="delete-account">${t('privacy.deleteBtn')}</button></div>
        </div>
      </section>
    </div>`;
  },
};

async function exportData() {
  const response = await fetch('/api/account/export', { credentials: 'same-origin' });
  if (!response.ok) throw new Error(t('error.server'));
  const data = await response.json();
  downloadFile(`compte-cord-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2));
  toast(t('privacy.exported'));
}

Object.assign(ACTIONS, {
  async 'export-data'(button) {
    await busy(button, exportData);
  },
  'delete-account'() {
    const email = state.account.user.email;
    return modal({
      title: t('del.title'),
      desc: t('del.desc'),
      iconName: 'triangle-alert',
      tone: 'tone-danger',
      body: html`<ul class="never">${[1, 2, 3].map((n) => html`<li>${icon('circle-alert')}<span>${t(`del.list.${n}`)}</span></li>`)}</ul>
        <button type="button" class="btn btn-glass btn-sm" data-export>${icon('download')}${t('del.exportFirst')}</button>
        <div class="field"><label for="m-del">${t('del.confirm')}</label><input class="input" id="m-del" name="email" type="email" required autocomplete="off" placeholder="${email}" spellcheck="false" autocapitalize="off"></div>`,
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-danger-solid">${icon('trash-2')}${t('del.submit')}</button>`,
      onOpen(ctx) {
        $('[data-export]', ctx.dialog).addEventListener('click', (event) => busy(event.currentTarget, () => exportData().catch(toastError)));
      },
      async onSubmit(data, ctx) {
        if (String(data.get('email')).trim().toLowerCase() !== email.toLowerCase()) throw new Error(t('del.mismatch'));
        await api('/api/me', {}, 'DELETE');
        ctx.close();
        state.account = null;
        history.replaceState(null, '', '/');
        showLanding();
        toast(t('del.done'), { type: 'info', duration: 8000 });
      },
    });
  },
});
