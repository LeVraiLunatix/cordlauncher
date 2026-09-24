/* Sécurité : mot de passe, double authentification (TOTP), passkeys, alertes. */

messages({
  fr: {
    'sec.title': 'Sécurité', 'sec.desc': 'Comment tu te connectes, et ce qui protège ton compte si un mot de passe fuit.',
    'sec.score.title': 'Niveau de protection', 'sec.score.all': 'Tout est en ordre. Ton compte est très bien protégé.',
    'sec.tip.email': 'Confirme ton adresse email', 'sec.tip.mfa': 'Active la double authentification', 'sec.tip.strong': 'Ajoute une passkey ou associe Passcord',
    'sec.tip.recovery': 'Régénère tes codes de secours (moins de 3 restants)', 'sec.tip.alerts': 'Réactive les alertes de connexion', 'sec.tip.fresh': 'Change ton mot de passe (plus d’un an)',
    'sec.methods': 'Méthodes de connexion',
    'sec.password': 'Mot de passe', 'sec.password.changed': 'Modifié {when}', 'sec.password.unknown': 'Défini à la création du compte', 'sec.password.change': 'Changer',
    'sec.mfa': 'Double authentification (2FA)', 'sec.mfa.off': 'Un code à 6 chiffres depuis une app comme 1Password, Authy ou Google Authenticator, en plus du mot de passe.',
    'sec.mfa.on': 'Activée {when} · {n} codes de secours restants', 'sec.mfa.enable': 'Activer', 'sec.mfa.disable': 'Désactiver', 'sec.mfa.codes': 'Nouveaux codes de secours',
    'sec.passkeys': 'Passkeys', 'sec.passkeys.desc': 'Connexion instantanée avec Face ID, Touch ID, Windows Hello ou ton téléphone. Rien à retenir, rien à voler.',
    'sec.passkeys.add': 'Ajouter une passkey', 'sec.passkeys.empty': 'Aucune passkey pour l’instant.', 'sec.passkeys.unsupported': 'Ce navigateur ne gère pas les passkeys.',
    'sec.passkeys.synced': 'Synchronisée', 'sec.passkeys.added': 'Ajoutée {when}', 'sec.passkeys.used': 'Utilisée {when}', 'sec.passkeys.unused': 'Jamais utilisée',
    'sec.passkeys.name': 'Nom de la passkey', 'sec.passkeys.nameHint': 'Pour la reconnaître : « MacBook », « iPhone de Luna »…',
    'sec.passkeys.create': 'Créer la passkey', 'sec.passkeys.done': 'Passkey ajoutée. Tu pourras te connecter sans mot de passe.',
    'sec.passkeys.cancelled': 'Création annulée.', 'sec.passkeys.removeTitle': 'Supprimer « {name} » ?',
    'sec.passkeys.removeDesc': 'Tu ne pourras plus te connecter avec cette passkey. Pense aussi à la retirer de ton gestionnaire de mots de passe.',
    'sec.passkeys.removed': 'Passkey supprimée.', 'sec.passkeys.exists': 'Cet appareil a déjà une passkey pour ton compte Cord.', 'sec.passkeys.renamed': 'Passkey renommée.',
    'sec.passcord': 'Passcord sur iPhone', 'sec.passcord.none': 'Ton iPhone peut valider tes connexions avec Face ID.', 'sec.passcord.some': '{n} iPhone associé(s)', 'sec.passcord.manage': 'Gérer',
    'sec.alerts': 'Alertes par email', 'sec.alerts.login': 'Nouvelle connexion', 'sec.alerts.loginDesc': 'Un email quand ton compte est utilisé depuis un appareil inconnu.',
    'sec.alerts.always': 'Toujours envoyées', 'sec.alerts.alwaysDesc': 'Changement de mot de passe, d’email, de 2FA ou ajout de passkey.',
    'sec.alerts.on': 'Alertes de connexion activées.', 'sec.alerts.off': 'Alertes de connexion désactivées.',
    'pw.title': 'Changer le mot de passe', 'pw.desc': 'Les autres appareils seront déconnectés.', 'pw.current': 'Mot de passe actuel', 'pw.new': 'Nouveau mot de passe',
    'pw.confirm': 'Confirme le nouveau', 'pw.submit': 'Changer le mot de passe', 'pw.recent': 'Tu viens de te connecter avec {method} : pas besoin de l’ancien mot de passe.',
    'pw.done': 'Mot de passe changé. {n} autre(s) session(s) fermée(s).',
    'totp.title': 'Activer la double authentification', 'totp.step1': 'Scanne ce QR code avec ton application d’authentification.',
    'totp.manual': 'Ou saisis la clé à la main', 'totp.openApp': 'Ouvrir dans l’app', 'totp.step2': 'Saisis le code à 6 chiffres affiché par l’application.',
    'totp.code': 'Code de vérification', 'totp.verify': 'Vérifier et activer', 'totp.next': 'J’ai scanné le code',
    'totp.step3': 'Garde ces codes de secours en lieu sûr. Chacun permet une connexion si tu perds ton téléphone.',
    'totp.saved': 'J’ai mis mes codes de secours à l’abri', 'totp.download': 'Télécharger (.txt)', 'totp.copyAll': 'Tout copier',
    'totp.finish': 'Terminer', 'totp.done': 'Double authentification activée. Ton compte est bien mieux protégé.',
    'totp.disableTitle': 'Désactiver la double authentification ?', 'totp.disableDesc': 'Saisis un code de ton application (ou un code de secours) pour confirmer.',
    'totp.disabled': 'Double authentification désactivée.', 'totp.regenTitle': 'Nouveaux codes de secours', 'totp.regenDesc': 'Les anciens codes cesseront de fonctionner. Confirme avec un code de ton application.',
    'reauth.title': 'Confirme que c’est bien toi', 'reauth.desc': 'Pour ajouter une protection à ton compte, saisis ton mot de passe. On ne te le redemandera pas avant un moment.',
    'totp.regenerate': 'Générer de nouveaux codes', 'totp.file': 'Codes de secours du Compte Cord\n{email}\nGénérés le {date}\n\nChaque code ne sert qu’une fois.\n\n',
  },
  en: {
    'sec.title': 'Security', 'sec.desc': 'How you sign in, and what protects your account if a password leaks.',
    'sec.score.title': 'Protection level', 'sec.score.all': 'All good. Your account is very well protected.',
    'sec.tip.email': 'Confirm your email address', 'sec.tip.mfa': 'Turn on two-factor authentication', 'sec.tip.strong': 'Add a passkey or pair Passcord',
    'sec.tip.recovery': 'Regenerate your recovery codes (fewer than 3 left)', 'sec.tip.alerts': 'Turn sign-in alerts back on', 'sec.tip.fresh': 'Change your password (over a year old)',
    'sec.methods': 'Sign-in methods',
    'sec.password': 'Password', 'sec.password.changed': 'Changed {when}', 'sec.password.unknown': 'Set when the account was created', 'sec.password.change': 'Change',
    'sec.mfa': 'Two-factor authentication (2FA)', 'sec.mfa.off': 'A 6-digit code from an app like 1Password, Authy or Google Authenticator, on top of your password.',
    'sec.mfa.on': 'On since {when} · {n} recovery codes left', 'sec.mfa.enable': 'Turn on', 'sec.mfa.disable': 'Turn off', 'sec.mfa.codes': 'New recovery codes',
    'sec.passkeys': 'Passkeys', 'sec.passkeys.desc': 'Instant sign-in with Face ID, Touch ID, Windows Hello or your phone. Nothing to remember, nothing to steal.',
    'sec.passkeys.add': 'Add a passkey', 'sec.passkeys.empty': 'No passkeys yet.', 'sec.passkeys.unsupported': 'This browser doesn’t support passkeys.',
    'sec.passkeys.synced': 'Synced', 'sec.passkeys.added': 'Added {when}', 'sec.passkeys.used': 'Used {when}', 'sec.passkeys.unused': 'Never used',
    'sec.passkeys.name': 'Passkey name', 'sec.passkeys.nameHint': 'To recognize it: “MacBook”, “Luna’s iPhone”…',
    'sec.passkeys.create': 'Create passkey', 'sec.passkeys.done': 'Passkey added. You can now sign in without a password.',
    'sec.passkeys.cancelled': 'Creation cancelled.', 'sec.passkeys.removeTitle': 'Remove “{name}”?',
    'sec.passkeys.removeDesc': 'You won’t be able to sign in with this passkey anymore. Also remove it from your password manager.',
    'sec.passkeys.removed': 'Passkey removed.', 'sec.passkeys.exists': 'This device already has a passkey for your Cord account.', 'sec.passkeys.renamed': 'Passkey renamed.',
    'sec.passcord': 'Passcord on iPhone', 'sec.passcord.none': 'Your iPhone can approve your sign-ins with Face ID.', 'sec.passcord.some': '{n} iPhone(s) paired', 'sec.passcord.manage': 'Manage',
    'sec.alerts': 'Email alerts', 'sec.alerts.login': 'New sign-in', 'sec.alerts.loginDesc': 'An email when your account is used from an unknown device.',
    'sec.alerts.always': 'Always sent', 'sec.alerts.alwaysDesc': 'Password, email or 2FA changes, and new passkeys.',
    'sec.alerts.on': 'Sign-in alerts on.', 'sec.alerts.off': 'Sign-in alerts off.',
    'pw.title': 'Change password', 'pw.desc': 'Your other devices will be signed out.', 'pw.current': 'Current password', 'pw.new': 'New password',
    'pw.confirm': 'Confirm new password', 'pw.submit': 'Change password', 'pw.recent': 'You just signed in with {method}: no need for the old password.',
    'pw.done': 'Password changed. {n} other session(s) signed out.',
    'totp.title': 'Turn on two-factor authentication', 'totp.step1': 'Scan this QR code with your authenticator app.',
    'totp.manual': 'Or enter the key manually', 'totp.openApp': 'Open in app', 'totp.step2': 'Enter the 6-digit code shown by the app.',
    'totp.code': 'Verification code', 'totp.verify': 'Verify and turn on', 'totp.next': 'I scanned the code',
    'totp.step3': 'Keep these recovery codes somewhere safe. Each one lets you sign in if you lose your phone.',
    'totp.saved': 'I stored my recovery codes safely', 'totp.download': 'Download (.txt)', 'totp.copyAll': 'Copy all',
    'totp.finish': 'Finish', 'totp.done': 'Two-factor authentication is on. Your account is much safer.',
    'totp.disableTitle': 'Turn off two-factor authentication?', 'totp.disableDesc': 'Enter a code from your app (or a recovery code) to confirm.',
    'totp.disabled': 'Two-factor authentication turned off.', 'totp.regenTitle': 'New recovery codes', 'totp.regenDesc': 'Your old codes will stop working. Confirm with a code from your app.',
    'reauth.title': 'Confirm it’s you', 'reauth.desc': 'To add a protection to your account, enter your password. We won’t ask again for a while.',
    'totp.regenerate': 'Generate new codes', 'totp.file': 'Cord Account recovery codes\n{email}\nGenerated on {date}\n\nEach code works once.\n\n',
  },
});

const currentSession = () => state.account?.sessions.find((s) => s.current);
const recentStrongLogin = () => {
  const s = currentSession();
  return s && ['passcord', 'passkey', 'reset'].includes(s.method) && Date.now() - s.createdAt < 14 * 60_000 ? s.method : null;
};

VIEWS.securite = {
  render(a) {
    const score = securityScore(a);
    const tips = score.checks.filter((c) => !c.ok);
    const tipAction = { email: 'send-verification', mfa: 'totp-setup', strong: passkeysSupported() ? 'passkey-add' : null, recovery: 'totp-regenerate', alerts: 'alerts-on', fresh: 'password-change' };
    return html`<div class="view">
      ${pageHead({ eyebrow: t('nav.section.account'), title: t('sec.title'), desc: t('sec.desc') })}
      <section class="card glass">
        <div class="method">
          ${scoreRing(score.value, { size: 96, stroke: 9, caption: t('score.label') })}
          <div><h2 class="card-title">${t('sec.score.title')} · <span class="tone-${score.tone}">${score.label}</span></h2>
            ${tips.length ? html`<ul class="never tips">${tips.map((c) => html`<li>${icon('chevron-right')}<span>${t(`sec.tip.${c.id}`)}</span></li>`)}</ul>` : html`<p class="card-desc">${t('sec.score.all')}</p>`}
          </div>
          <div class="state">${tips.length && (tipAction[tips[0].id] || tips[0].id === 'strong') ? (tipAction[tips[0].id]
            ? html`<button class="btn btn-primary btn-sm" data-action="${tipAction[tips[0].id]}">${t(`sec.tip.${tips[0].id}`)}</button>`
            : html`<a class="btn btn-primary btn-sm" href="#appareils">${t(`sec.tip.${tips[0].id}`)}</a>`) : ''}</div>
        </div>
      </section>

      <div class="section-title"><h2>${t('sec.methods')}</h2></div>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge">${icon('key-round')}</span>
          <div><h3 class="card-title">${t('sec.password')}</h3><p class="card-desc">${a.security.passwordChangedAt ? t('sec.password.changed', { when: fmtRelative(a.security.passwordChangedAt) }) : t('sec.password.unknown')}</p></div>
          <div class="state"><button class="btn btn-glass btn-sm" data-action="password-change">${icon('pencil')}${t('sec.password.change')}</button></div>
        </div>
      </section>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge ${a.security.mfa ? 'tone-ok' : 'tone-warn'}">${icon(a.security.mfa ? 'shield-check' : 'shield-alert')}</span>
          <div><h3 class="card-title">${t('sec.mfa')}</h3>
            <p class="card-desc">${a.security.mfa ? t('sec.mfa.on', { when: fmtDateShort(a.security.mfaSince), n: a.security.recoveryCodesLeft }) : t('sec.mfa.off')}</p></div>
          <div class="state">
            ${a.security.mfa
              ? html`<span class="badge tone-ok"><span class="dot"></span>${t('common.enabled')}</span>
                  <button class="btn btn-ghost btn-sm" data-action="totp-regenerate">${icon('refresh-cw')}${t('sec.mfa.codes')}</button>
                  <button class="btn btn-danger btn-sm" data-action="totp-disable">${t('sec.mfa.disable')}</button>`
              : html`<button class="btn btn-primary btn-sm" data-action="totp-setup">${icon('shield-check')}${t('sec.mfa.enable')}</button>`}
          </div>
        </div>
      </section>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge ${a.passkeys.length ? 'tone-ok' : ''}">${icon('fingerprint-pattern')}</span>
          <div><h3 class="card-title">${t('sec.passkeys')}</h3><p class="card-desc">${t('sec.passkeys.desc')}</p></div>
          <div class="state">${passkeysSupported()
            ? html`<button class="btn btn-glass btn-sm" data-action="passkey-add">${icon('plus')}${t('sec.passkeys.add')}</button>`
            : html`<span class="badge">${t('sec.passkeys.unsupported')}</span>`}</div>
        </div>
        ${a.passkeys.length ? html`<ul class="list card-body">${a.passkeys.map((p) => html`<li class="list-item">
          <span class="icon-badge sm tone-muted">${icon('fingerprint-pattern')}</span>
          <div class="body"><div class="title">${p.name}${p.backedUp ? html`<span class="badge tone-info">${icon('cloud')}${t('sec.passkeys.synced')}</span>` : ''}</div>
            <div class="meta"><span>${t('sec.passkeys.added', { when: fmtDateShort(p.createdAt) })}</span><span>${p.lastUsedAt ? t('sec.passkeys.used', { when: fmtRelative(p.lastUsedAt) }) : t('sec.passkeys.unused')}</span></div></div>
          <div class="actions compact">
            <button class="btn btn-ghost btn-icon btn-sm" data-action="passkey-rename" data-id="${p.id}" data-name="${p.name}" aria-label="${t('common.rename')} ${p.name}">${icon('pencil')}</button>
            <button class="btn btn-ghost btn-icon btn-sm" data-action="passkey-remove" data-id="${p.id}" data-name="${p.name}" aria-label="${t('common.remove')} ${p.name}">${icon('trash-2')}</button>
          </div></li>`)}</ul>` : ''}
      </section>

      <section class="card glass">
        <div class="method">
          <span class="icon-badge ${a.passcord.length ? 'tone-ok' : ''}">${icon('smartphone')}</span>
          <div><h3 class="card-title">${t('sec.passcord')}</h3><p class="card-desc">${a.passcord.length ? t('sec.passcord.some', { n: a.passcord.length }) : t('sec.passcord.none')}</p></div>
          <div class="state"><a class="btn btn-glass btn-sm" href="#appareils">${t('sec.passcord.manage')}${icon('chevron-right')}</a></div>
        </div>
      </section>

      <div class="section-title"><h2>${t('sec.alerts')}</h2></div>
      <section class="card glass">
        <div class="pref"><div class="label"><strong>${t('sec.alerts.login')}</strong><span>${t('sec.alerts.loginDesc')}</span></div>
          <label class="switch"><input type="checkbox" role="switch" data-change="alerts-toggle" ${a.user.alerts ? raw('checked') : ''} aria-label="${t('sec.alerts.login')}"><span></span></label></div>
        <div class="pref"><div class="label"><strong>${t('sec.alerts.always')}</strong><span>${t('sec.alerts.alwaysDesc')}</span></div><span class="badge tone-ok">${icon('check')}${t('common.enabled')}</span></div>
      </section>
    </div>`;
  },
};

/**
 * Action sensible : si le serveur répond `reauth_required` (connexion de plus
 * de 15 min), on demande le mot de passe puis on rejoue. `undefined` = annulé.
 */
async function withReauth(call) {
  try {
    return await call({});
  } catch (e) {
    if (e.reason !== 'reauth_required') throw e;
  }
  let result;
  const confirmed = await modal({
    title: t('reauth.title'),
    desc: t('reauth.desc'),
    iconName: 'lock-keyhole',
    body: html`${passwordField({ label: t('auth.password'), autofocus: true })}
      <input type="text" name="username" autocomplete="username" value="${state.account.user.email}" hidden>`,
    actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${t('common.continue')}</button>`,
    async onSubmit(data, ctx) {
      result = await call({ password: data.get('password') });
      ctx.close(true);
    },
  });
  return confirmed ? result : undefined;
}

async function createPasskey(name, options) {
  const pk = options.publicKey;
  let credential;
  try {
    credential = await navigator.credentials.create({
      publicKey: {
        ...pk,
        challenge: b64uToBytes(pk.challenge),
        user: { ...pk.user, id: b64uToBytes(pk.user.id) },
        excludeCredentials: pk.excludeCredentials.map((c) => ({ ...c, id: b64uToBytes(c.id) })),
      },
    });
  } catch (e) {
    throw new Error(e?.name === 'InvalidStateError' ? t('sec.passkeys.exists') : e?.name === 'NotAllowedError' ? t('sec.passkeys.cancelled') : e?.message || t('sec.passkeys.cancelled'));
  }
  await api('/api/passkeys/register', {
    id: options.id,
    name,
    credential: {
      id: credential.id,
      clientDataJSON: bytesToB64u(credential.response.clientDataJSON),
      attestationObject: bytesToB64u(credential.response.attestationObject),
      transports: credential.response.getTransports?.() ?? [],
    },
  });
}

function recoveryCodesBlock(codes) {
  return html`<div class="codes" aria-label="Codes">${codes.map((c) => html`<code>${c}</code>`)}</div>
    <div class="row-wrap"><button type="button" class="btn btn-glass btn-sm" data-codes-copy>${icon('copy')}${t('totp.copyAll')}</button>
    <button type="button" class="btn btn-glass btn-sm" data-codes-download>${icon('download')}${t('totp.download')}</button></div>`;
}
function wireRecoveryCodes(dialog, codes) {
  const text = t('totp.file', { email: state.account.user.email, date: fmtDateTime(Date.now()) }) + codes.join('\n') + '\n';
  $('[data-codes-copy]', dialog)?.addEventListener('click', () => copyText(codes.join('\n')));
  $('[data-codes-download]', dialog)?.addEventListener('click', () => downloadFile('compte-cord-codes-de-secours.txt', text, 'text/plain'));
}
const otpInput = (name = 'code', { recovery = false } = {}) => recovery
  ? html`<div class="field"><label for="m-code">${t('totp.code')}</label><input class="input mono" id="m-code" name="${name}" required maxlength="24" autocomplete="one-time-code" spellcheck="false" autocapitalize="off" autofocus></div>`
  : html`<div class="field"><label for="m-code" class="sr-only">${t('totp.code')}</label><input class="input input-otp" id="m-code" name="${name}" inputmode="numeric" pattern="[0-9 ]{6,7}" maxlength="7" required autocomplete="one-time-code" placeholder="••••••" autofocus></div>`;

Object.assign(ACTIONS, {
  'password-change'() {
    const recent = recentStrongLogin();
    return modal({
      title: t('pw.title'),
      desc: t('pw.desc'),
      iconName: 'key-round',
      body: html`${recent ? html`<div class="banner tone-info">${icon('info')}<div class="body"><p class="desc">${t('pw.recent', { method: t(`via.${recent}`) })}</p></div></div>` : passwordField({ name: 'current', label: t('pw.current'), autofocus: true })}
        ${passwordField({ name: 'password', label: t('pw.new'), autocomplete: 'new-password', minlength: 12, strength: true, autofocus: Boolean(recent) })}
        ${passwordField({ name: 'confirm', label: t('pw.confirm'), autocomplete: 'new-password', minlength: 12 })}
        <input type="text" name="username" autocomplete="username" value="${state.account.user.email}" hidden>`,
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${t('pw.submit')}</button>`,
      async onSubmit(data, ctx) {
        if (data.get('password') !== data.get('confirm')) throw new Error(t('auth.reset.mismatch'));
        const result = await api('/api/security/password', { current: data.get('current') ?? undefined, password: data.get('password') });
        ctx.close();
        toast(t('pw.done', { n: result.closedSessions }));
        refresh();
      },
    });
  },

  async 'totp-setup'(button) {
    const setup = await busy(button, () => withReauth((extra) => api('/api/security/totp', { action: 'setup', ...extra })));
    if (!setup) return;
    const grouped = setup.secret.match(/.{1,4}/g).join(' ');
    let step = 1;
    let codes = [];
    await modal({
      title: t('totp.title'),
      iconName: 'shield-check',
      tone: 'grad',
      body: () => html`<div class="steps" aria-hidden="true"><span class="on"></span><span></span><span></span></div>
        <p class="muted">${t('totp.step1')}</p>
        <div class="qr-frame">${qrSvg(setup.otpauth, { logo: '/assets/icon-180.png' })}</div>
        <details><summary class="link-btn">${t('totp.manual')}</summary>
          <div class="stack-sm"><div class="copyable"><code>${grouped}</code><button type="button" class="btn btn-ghost btn-icon btn-sm" data-secret-copy aria-label="${t('common.copy')}">${icon('copy')}</button></div></div>
        </details>
        ${isMobile() ? html`<a class="btn btn-glass btn-block" href="${setup.otpauth}">${icon('external-link')}${t('totp.openApp')}</a>` : ''}`,
      actions: () => html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${t('totp.next')}${icon('arrow-right')}</button>`,
      onOpen(ctx) {
        $('[data-secret-copy]', ctx.dialog)?.addEventListener('click', () => copyText(setup.secret));
      },
      async onSubmit(data, ctx) {
        const actions = $('.modal-actions', ctx.dialog);
        if (step === 1) {
          step = 2;
          ctx.setBody(html`<div class="steps" aria-hidden="true"><span class="on"></span><span class="on"></span><span></span></div><p class="muted">${t('totp.step2')}</p>${otpInput()}`);
          render(actions, html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${t('totp.verify')}</button>`);
          $('#m-code', ctx.dialog).focus();
          return;
        }
        if (step === 2) {
          const result = await api('/api/security/totp', { action: 'enable', code: data.get('code') });
          codes = result.recoveryCodes;
          step = 3;
          ctx.setBody(html`<div class="steps" aria-hidden="true"><span class="on"></span><span class="on"></span><span class="on"></span></div>
            <p class="muted">${t('totp.step3')}</p>${recoveryCodesBlock(codes)}
            <label class="row small"><input type="checkbox" name="saved" required> ${t('totp.saved')}</label>`);
          wireRecoveryCodes(ctx.dialog, codes);
          render(actions, html`<button type="submit" class="btn btn-primary">${t('totp.finish')}</button>`);
          $('.modal-close', ctx.dialog)?.remove();
          refresh();
          return;
        }
        ctx.close(true);
        celebrate();
        toast(t('totp.done'));
      },
    });
  },

  'totp-disable'() {
    return modal({
      title: t('totp.disableTitle'),
      desc: t('totp.disableDesc'),
      iconName: 'shield-alert',
      tone: 'tone-danger',
      body: () => html`${otpInput('code', { recovery: true })}`,
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-danger-solid">${t('sec.mfa.disable')}</button>`,
      async onSubmit(data, ctx) {
        await api('/api/security/totp', { action: 'disable', code: data.get('code').trim() });
        ctx.close();
        toast(t('totp.disabled'), { type: 'info' });
        refresh();
      },
    });
  },

  'totp-regenerate'() {
    let codes = null;
    return modal({
      title: t('totp.regenTitle'),
      desc: t('totp.regenDesc'),
      iconName: 'refresh-cw',
      body: otpInput(),
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${t('totp.regenerate')}</button>`,
      async onSubmit(data, ctx) {
        if (codes) return ctx.close();
        codes = (await api('/api/security/totp', { action: 'regenerate', code: data.get('code') })).recoveryCodes;
        ctx.setBody(html`<p class="muted">${t('totp.step3')}</p>${recoveryCodesBlock(codes)}`);
        wireRecoveryCodes(ctx.dialog, codes);
        render($('.modal-actions', ctx.dialog), html`<button type="submit" class="btn btn-primary">${t('common.done')}</button>`);
        refresh();
      },
    });
  },

  async 'passkey-add'(button) {
    // Options demandées AVANT le geste final : Safari exige que
    // credentials.create() suive directement le toucher, sans requête entre.
    const options = await busy(button, () => withReauth((extra) => api('/api/passkeys/register/options', extra)));
    if (!options) return undefined;
    return modal({
      title: t('sec.passkeys.add'),
      desc: t('sec.passkeys.desc'),
      iconName: 'fingerprint-pattern',
      tone: 'grad',
      body: html`<div class="field"><label for="m-pk">${t('sec.passkeys.name')}</label><input class="input" id="m-pk" name="name" maxlength="60" required value="${deviceName()}" autofocus><p class="field-hint">${t('sec.passkeys.nameHint')}</p></div>`,
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${icon('fingerprint-pattern')}${t('sec.passkeys.create')}</button>`,
      async onSubmit(data, ctx) {
        await createPasskey(String(data.get('name')).trim(), options);
        ctx.close();
        celebrate();
        toast(t('sec.passkeys.done'));
        refresh();
      },
    });
  },
  'passkey-rename'(button) {
    return modal({
      title: t('common.rename'),
      iconName: 'pencil',
      body: html`<div class="field"><label for="m-pk">${t('sec.passkeys.name')}</label><input class="input" id="m-pk" name="name" maxlength="60" required value="${button.dataset.name}" autofocus></div>`,
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${t('common.save')}</button>`,
      async onSubmit(data, ctx) {
        await api('/api/passkeys', { id: button.dataset.id, name: String(data.get('name')).trim() }, 'PATCH');
        ctx.close();
        toast(t('sec.passkeys.renamed'));
        refresh();
      },
    });
  },
  async 'passkey-remove'(button) {
    const ok = await confirmDialog({ title: t('sec.passkeys.removeTitle', { name: button.dataset.name }), desc: t('sec.passkeys.removeDesc'), confirm: t('common.remove') });
    if (!ok) return;
    await api('/api/passkeys', { id: button.dataset.id }, 'DELETE');
    toast(t('sec.passkeys.removed'), { type: 'info' });
    refresh();
  },
  async 'alerts-toggle'(input) {
    const alerts = input.checked;
    try {
      await api('/api/me', { alerts }, 'PATCH');
      state.account.user.alerts = alerts;
      toast(t(alerts ? 'sec.alerts.on' : 'sec.alerts.off'), { type: 'info', duration: 2500 });
    } catch (e) {
      input.checked = !alerts;
      throw e;
    }
  },
  async 'alerts-on'() {
    await api('/api/me', { alerts: true }, 'PATCH');
    toast(t('sec.alerts.on'), { type: 'info' });
    refresh();
  },
});
