/* Profil : photo, nom, email, identifiant et préférences. */

messages({
  fr: {
    'profile.title': 'Profil', 'profile.desc': 'Ce que les apps de la suite voient de toi quand tu te connectes avec Cord.',
    'profile.photo': 'Changer la photo', 'profile.photoRemove': 'Retirer la photo', 'profile.photoSaved': 'Photo mise à jour.', 'profile.photoRemoved': 'Photo retirée : ton avatar généré est de retour.',
    'profile.photoError': 'Image illisible. Essaie un PNG ou un JPEG.', 'profile.photoHint': 'Recadrée en carré, 256 × 256. Sans photo, un avatar est généré à partir de ton identifiant.',
    'profile.identity': 'Identité', 'profile.name': 'Nom affiché', 'profile.nameSaved': 'Nom enregistré.',
    'profile.email': 'Adresse email', 'profile.emailChange': 'Modifier', 'profile.id': 'Identifiant Cord', 'profile.since': 'Membre depuis',
    'profile.idHint': 'Identifiant permanent partagé avec les apps connectées (« sub » OIDC).',
    'email.title': 'Changer d’adresse email', 'email.desc': 'On envoie un lien de confirmation à la nouvelle adresse. L’ancienne reste active tant que tu n’as pas cliqué.',
    'email.new': 'Nouvelle adresse', 'email.password': 'Mot de passe actuel', 'email.submit': 'Envoyer le lien',
    'email.sent': 'Lien envoyé à {email}. Clique dessus pour finaliser le changement.', 'email.changed': 'Adresse email mise à jour : {email}.',
    'prefs.title': 'Préférences', 'prefs.theme': 'Apparence', 'prefs.themeDesc': 'Le Compte Cord suit ton système, ou le thème de ton choix.',
    'prefs.system': 'Système', 'prefs.dark': 'Sombre', 'prefs.light': 'Clair', 'prefs.lang': 'Langue', 'prefs.langDesc': 'Pour le portail et, bientôt, pour les emails.',
    'prefs.saved': 'Préférences enregistrées.',
  },
  en: {
    'profile.title': 'Profile', 'profile.desc': 'What the suite’s apps see about you when you sign in with Cord.',
    'profile.photo': 'Change photo', 'profile.photoRemove': 'Remove photo', 'profile.photoSaved': 'Photo updated.', 'profile.photoRemoved': 'Photo removed: your generated avatar is back.',
    'profile.photoError': 'Couldn’t read that image. Try a PNG or a JPEG.', 'profile.photoHint': 'Cropped to a 256 × 256 square. Without a photo, an avatar is generated from your ID.',
    'profile.identity': 'Identity', 'profile.name': 'Display name', 'profile.nameSaved': 'Name saved.',
    'profile.email': 'Email address', 'profile.emailChange': 'Change', 'profile.id': 'Cord ID', 'profile.since': 'Member since',
    'profile.idHint': 'Permanent ID shared with connected apps (OIDC “sub”).',
    'email.title': 'Change email address', 'email.desc': 'We send a confirmation link to the new address. The old one stays active until you click it.',
    'email.new': 'New address', 'email.password': 'Current password', 'email.submit': 'Send the link',
    'email.sent': 'Link sent to {email}. Click it to finish the change.', 'email.changed': 'Email address updated: {email}.',
    'prefs.title': 'Preferences', 'prefs.theme': 'Appearance', 'prefs.themeDesc': 'Cord Account follows your system, or the theme you pick.',
    'prefs.system': 'System', 'prefs.dark': 'Dark', 'prefs.light': 'Light', 'prefs.lang': 'Language', 'prefs.langDesc': 'For the portal and, soon, for emails.',
    'prefs.saved': 'Preferences saved.',
  },
});

VIEWS.profil = {
  render(a) {
    const u = a.user;
    return html`<div class="view">
      ${pageHead({ eyebrow: t('nav.section.account'), title: t('profile.title'), desc: t('profile.desc') })}
      <section class="card glass card-lg">
        <div class="profile-hero">
          <div class="avatar-edit">
            <div class="avatar-ring avatar-2xl">${avatar(u)}</div>
            <label class="btn btn-primary btn-icon" aria-label="${t('profile.photo')}" title="${t('profile.photo')}">${icon('camera')}<input type="file" accept="image/png,image/jpeg,image/webp,image/heic" class="sr-only" data-change="avatar-upload"></label>
          </div>
          <div class="who">
            <h2>${u.name}</h2>
            <p>${u.email}</p>
            <div class="row-wrap">
              ${u.avatarUrl ? html`<button class="btn btn-ghost btn-sm" data-action="avatar-remove">${icon('trash-2')}${t('profile.photoRemove')}</button>` : ''}
            </div>
            <p class="tiny subtle">${t('profile.photoHint')}</p>
          </div>
        </div>
      </section>

      <section class="card glass">
        <div class="card-head"><span class="icon-badge">${icon('id-card')}</span><div class="grow"><h2 class="card-title">${t('profile.identity')}</h2></div></div>
        <div class="card-body stack">
          <form class="field" data-scope="profile" id="name-form">
            <label for="p-name">${t('profile.name')}</label>
            <div class="row"><input class="input" id="p-name" name="name" required maxlength="60" value="${u.name}" autocomplete="nickname"><button class="btn btn-glass" type="submit">${t('common.save')}</button></div>
          </form>
          <div class="field"><span class="field-label">${t('profile.email')}</span>
            <div class="row"><input class="input" value="${u.email}" readonly aria-label="${t('profile.email')}">
              <button class="btn btn-glass" data-action="email-change">${t('profile.emailChange')}</button></div>
            ${u.emailVerified ? html`<p class="field-hint row">${icon('badge-check')}<span>${t('hello.verified')}</span></p>` : html`<p class="field-hint">${t('verify.desc')} <button class="link-btn" data-action="send-verification">${t('verify.send')}</button></p>`}
          </div>
          <div class="field"><span class="field-label">${t('profile.id')}</span>
            <div class="copyable"><code>${u.id}</code><button class="btn btn-ghost btn-icon btn-sm" data-action="copy" data-value="${u.id}" aria-label="${t('common.copy')}">${icon('copy')}</button></div>
            <p class="field-hint">${t('profile.idHint')}</p>
          </div>
          <dl class="kv"><dt>${t('profile.since')}</dt><dd>${fmtDate(u.createdAt)}</dd></dl>
        </div>
      </section>

      <section class="card glass">
        <div class="card-head"><span class="icon-badge">${icon('sliders-horizontal')}</span><div class="grow"><h2 class="card-title">${t('prefs.title')}</h2></div></div>
        <div class="card-body">
          <div class="pref"><div class="label"><strong>${t('prefs.theme')}</strong><span>${t('prefs.themeDesc')}</span></div>
            <div class="segmented" role="radiogroup" aria-label="${t('prefs.theme')}">
              ${[['system', 'sun-moon'], ['dark', 'moon'], ['light', 'sun']].map(([value, ic]) => html`<label><input type="radio" name="theme" value="${value}" data-change="pref-theme" ${u.theme === value ? raw('checked') : ''}><span>${icon(ic)}${t(`prefs.${value}`)}</span></label>`)}
            </div></div>
          <div class="pref"><div class="label"><strong>${t('prefs.lang')}</strong><span>${t('prefs.langDesc')}</span></div>
            <div class="segmented" role="radiogroup" aria-label="${t('prefs.lang')}">
              ${[['fr', 'Français'], ['en', 'English']].map(([value, label]) => html`<label><input type="radio" name="locale" value="${value}" data-change="pref-locale" ${locale === value ? raw('checked') : ''}><span>${label}</span></label>`)}
            </div></div>
        </div>
      </section>
    </div>`;
  },
  mount(root) {
    $('#name-form', root).addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.target;
      await busy($('[type="submit"]', form), async () => {
        try {
          await api('/api/me', { name: form.name.value.trim() }, 'PATCH');
          toast(t('profile.nameSaved'));
          refresh();
        } catch (e) { toastError(e); }
      });
    });
  },
};

/** Recadre en carré 256 px et compresse (WebP, sinon JPEG) sous ~120 Ko. */
async function prepareAvatar(file) {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error(t('profile.photoError'));
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const side = Math.min(bitmap.width, bitmap.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  for (const [type, quality] of [['image/webp', 0.86], ['image/jpeg', 0.86], ['image/jpeg', 0.7], ['image/jpeg', 0.5]]) {
    const url = canvas.toDataURL(type, quality);
    if (url.startsWith(`data:${type}`) && url.length < 170_000) return url;
  }
  throw new Error(t('profile.photoError'));
}

Object.assign(ACTIONS, {
  async 'avatar-upload'(input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const avatarUrl = await prepareAvatar(file);
    await api('/api/me', { avatar: avatarUrl }, 'PATCH');
    toast(t('profile.photoSaved'));
    refresh();
  },
  async 'avatar-remove'(button) {
    await busy(button, () => api('/api/me', { avatar: null }, 'PATCH'));
    toast(t('profile.photoRemoved'), { type: 'info' });
    refresh();
  },
  copy(button) {
    return copyText(button.dataset.value);
  },
  'email-change'() {
    const recent = recentStrongLogin();
    return modal({
      title: t('email.title'),
      desc: t('email.desc'),
      iconName: 'at-sign',
      body: html`<div class="field"><label for="m-email">${t('email.new')}</label><input class="input" id="m-email" type="email" name="email" required maxlength="254" autocomplete="email" autofocus></div>
        ${recent ? '' : passwordField({ name: 'password', label: t('email.password') })}`,
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${icon('send')}${t('email.submit')}</button>`,
      async onSubmit(data, ctx) {
        const email = String(data.get('email')).trim();
        const result = await api('/api/email/change', { email, password: data.get('password') ?? undefined });
        ctx.close();
        toast(t('email.sent', { email }), { duration: 9000, ...(result.devUrl ? { action: { href: result.devUrl, label: t('auth.devLink') } } : {}) });
      },
    });
  },
  async 'pref-theme'(input) {
    applyTheme(input.value);
    state.account.user.theme = input.value;
    await api('/api/me', { theme: input.value }, 'PATCH');
    renderShell();
  },
  async 'pref-locale'(input) {
    setLocale(input.value);
    state.account.user.locale = input.value;
    await api('/api/me', { locale: input.value }, 'PATCH');
    renderShell();
    toast(t('prefs.saved'), { duration: 2000 });
  },
});
