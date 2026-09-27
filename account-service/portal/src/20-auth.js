/* Carte d'authentification : connexion, inscription, 2FA, passkey, Passcord,
 * mot de passe oublié et réinitialisation. Réutilisée par la vitrine et par
 * l'écran de consentement OAuth. */

messages({
  fr: {
    'auth.login.title': 'Bon retour', 'auth.login.desc': 'Connecte-toi à ton compte Cord.',
    'auth.login.context': 'Connecte-toi pour continuer vers {app}.',
    'auth.email': 'Adresse email', 'auth.password': 'Mot de passe', 'auth.name': 'Ton prénom ou pseudo',
    'auth.register.context': 'Un seul compte pour {app} et toute la suite Cord. Ça prend 30 secondes.',
    'auth.verify.title': 'Vérifie ta boîte mail', 'auth.verify.desc': 'On a envoyé un code à 6 chiffres à {email}. Tape-le ici pour activer ton compte.',
    'auth.verify.submit': 'Activer mon compte', 'auth.verify.later': 'Plus tard', 'auth.verify.resent': 'Nouveau code envoyé.',
    'auth.forgot': 'Mot de passe oublié ?', 'auth.submit.login': 'Se connecter', 'auth.submit.register': 'Créer mon compte',
    'auth.passkey': 'Passkey', 'auth.passcord': 'Passcord',
    'auth.noAccount': 'Pas encore de compte ?', 'auth.createOne': 'Créer un compte Cord',
    'auth.hasAccount': 'Déjà un compte ?', 'auth.signIn': 'Se connecter',
    'auth.register.title': 'Crée ton compte Cord', 'auth.register.desc': 'Une identité pour toutes les apps de la suite. Gratuit, sans pub, sans pistage.',
    'auth.register.legal': 'En créant un compte, tu acceptes qu’on conserve ton nom et ton email pour te connecter aux apps Cord. Rien d’autre, jamais revendu.',
    'auth.mfa.title': 'Double authentification', 'auth.mfa.desc': 'Ouvre ton application d’authentification et saisis le code à 6 chiffres.',
    'auth.mfa.code': 'Code à 6 chiffres', 'auth.mfa.recovery': 'Code de secours', 'auth.mfa.useRecovery': 'Utiliser un code de secours',
    'auth.mfa.useTotp': 'Utiliser l’application d’authentification', 'auth.mfa.recoveryHint': 'Format xxxxx-xxxxx. Chaque code ne sert qu’une fois.',
    'auth.mfa.submit': 'Vérifier',
    'auth.forgot.title': 'Mot de passe oublié', 'auth.forgot.desc': 'Indique ton adresse : on t’envoie un lien pour en choisir un nouveau.',
    'auth.forgot.submit': 'Envoyer le lien',
    'auth.forgot.sent.title': 'Regarde ta boîte mail', 'auth.forgot.sent.desc': 'Si un compte Cord utilise {email}, un lien de réinitialisation vient de partir. Il est valable 30 minutes.',
    'auth.forgot.sent.tip': 'Rien reçu ? Vérifie les indésirables, ou connecte-toi avec Passcord ou une passkey si tu en as.',
    'auth.reset.title': 'Nouveau mot de passe', 'auth.reset.desc': 'Pour le compte {email}. Toutes tes sessions seront fermées.',
    'auth.reset.new': 'Nouveau mot de passe', 'auth.reset.confirm': 'Confirme-le', 'auth.reset.mismatch': 'Les deux mots de passe ne correspondent pas.',
    'auth.reset.submit': 'Changer le mot de passe', 'auth.reset.invalid': 'Ce lien a expiré ou a déjà servi. Demande-en un nouveau.',
    'auth.reset.mfa': 'Code de double authentification', 'auth.reset.mfaHint': 'Ton compte est protégé par la 2FA : code à 6 chiffres ou code de secours.',
    'auth.passcord.title': 'Connexion avec Passcord', 'auth.passcord.scan': 'Reçois la demande sur ton iPhone (ou scanne le code avec l’appareil photo), puis valide avec Face ID dans Passcord.',
    'auth.passcord.mobile': 'Ouvre la demande dans Passcord sur cet iPhone, puis reviens ici.',
    'auth.passcord.open': 'Ouvrir dans Passcord', 'auth.passcord.copy': 'Copier le lien', 'auth.passcord.waiting': 'En attente de ton iPhone…',
    'auth.passcord.expired': 'La demande a expiré.', 'auth.passcord.unpaired': 'Passcord doit d’abord être associé à ton compte depuis la page Appareils.',
    'auth.passkey.cancelled': 'Connexion par passkey annulée.', 'auth.passkey.unsupported': 'Ce navigateur ne gère pas les passkeys.',
    'auth.welcome': 'Bienvenue, {name} !', 'auth.welcomeBack': 'Content de te revoir, {name}.',
    'auth.verifySent': 'Un lien de confirmation vient de partir vers {email}.',
    'auth.devLink': 'Ouvrir le lien (dev)',
  },
  en: {
    'auth.login.title': 'Welcome back', 'auth.login.desc': 'Sign in to your Cord account.',
    'auth.login.context': 'Sign in to continue to {app}.',
    'auth.email': 'Email address', 'auth.password': 'Password', 'auth.name': 'Your first name or nickname',
    'auth.register.context': 'One account for {app} and the whole Cord suite. Takes 30 seconds.',
    'auth.verify.title': 'Check your inbox', 'auth.verify.desc': 'We sent a 6-digit code to {email}. Type it here to activate your account.',
    'auth.verify.submit': 'Activate my account', 'auth.verify.later': 'Later', 'auth.verify.resent': 'New code sent.',
    'auth.forgot': 'Forgot password?', 'auth.submit.login': 'Sign in', 'auth.submit.register': 'Create my account',
    'auth.passkey': 'Passkey', 'auth.passcord': 'Passcord',
    'auth.noAccount': 'No account yet?', 'auth.createOne': 'Create a Cord account',
    'auth.hasAccount': 'Already have an account?', 'auth.signIn': 'Sign in',
    'auth.register.title': 'Create your Cord account', 'auth.register.desc': 'One identity for every app in the suite. Free, no ads, no tracking.',
    'auth.register.legal': 'By creating an account, you let us keep your name and email to sign you in to Cord apps. Nothing else, never sold.',
    'auth.mfa.title': 'Two-factor authentication', 'auth.mfa.desc': 'Open your authenticator app and enter the 6-digit code.',
    'auth.mfa.code': '6-digit code', 'auth.mfa.recovery': 'Recovery code', 'auth.mfa.useRecovery': 'Use a recovery code',
    'auth.mfa.useTotp': 'Use the authenticator app', 'auth.mfa.recoveryHint': 'Format xxxxx-xxxxx. Each code works once.',
    'auth.mfa.submit': 'Verify',
    'auth.forgot.title': 'Forgot password', 'auth.forgot.desc': 'Enter your email and we’ll send you a link to choose a new one.',
    'auth.forgot.submit': 'Send the link',
    'auth.forgot.sent.title': 'Check your inbox', 'auth.forgot.sent.desc': 'If a Cord account uses {email}, a reset link is on its way. It’s valid for 30 minutes.',
    'auth.forgot.sent.tip': 'Nothing? Check your spam folder, or sign in with Passcord or a passkey if you have one.',
    'auth.reset.title': 'New password', 'auth.reset.desc': 'For the account {email}. All your sessions will be signed out.',
    'auth.reset.new': 'New password', 'auth.reset.confirm': 'Confirm it', 'auth.reset.mismatch': 'The two passwords don’t match.',
    'auth.reset.submit': 'Change password', 'auth.reset.invalid': 'This link has expired or was already used. Request a new one.',
    'auth.reset.mfa': 'Two-factor code', 'auth.reset.mfaHint': 'Your account uses 2FA: 6-digit code or recovery code.',
    'auth.passcord.title': 'Sign in with Passcord', 'auth.passcord.scan': 'Get the request on your iPhone (or scan the code with the camera), then approve with Face ID in Passcord.',
    'auth.passcord.mobile': 'Open the request in Passcord on this iPhone, then come back here.',
    'auth.passcord.open': 'Open in Passcord', 'auth.passcord.copy': 'Copy link', 'auth.passcord.waiting': 'Waiting for your iPhone…',
    'auth.passcord.expired': 'The request expired.', 'auth.passcord.unpaired': 'Passcord must first be paired with your account from the Devices page.',
    'auth.passkey.cancelled': 'Passkey sign-in cancelled.', 'auth.passkey.unsupported': 'This browser doesn’t support passkeys.',
    'auth.welcome': 'Welcome, {name}!', 'auth.welcomeBack': 'Good to see you again, {name}.',
    'auth.verifySent': 'A confirmation link is on its way to {email}.',
    'auth.devLink': 'Open link (dev)',
  },
});

/**
 * Monte la carte d'authentification dans `host`.
 * options : { mode, email, resetToken, context: { appName }, onSuccess(result, meta) }
 * `email` préremplit le champ (login_hint d'une app) ; après une inscription,
 * l'étape « verify » demande le code à 6 chiffres reçu par email.
 */
/** Dernière adresse utilisée sur cet appareil : préremplie, et Passcord part tout seul. */
const REMEMBERED_EMAIL = 'cord:email';
function rememberedEmail() {
  try { return localStorage.getItem(REMEMBERED_EMAIL) ?? ''; } catch { return ''; }
}
function rememberEmail(email) {
  try { if (email) localStorage.setItem(REMEMBERED_EMAIL, email); } catch { /* stockage indisponible */ }
}

function mountAuth(host, { mode = 'login', email = '', resetToken, context, onSuccess }) {
  const local = { mode, email: String(email || (mode === 'login' ? rememberedEmail() : '') || '').slice(0, 254), password: '', recovery: false, resetInfo: null, stop: [], passkeyAbort: null };
  host.dataset.scope = 'auth';

  const cleanup = () => {
    local.stop.splice(0).forEach((fn) => fn());
    if (local.passkeyAbort) { local.passkeyAbort.abort(); local.passkeyAbort = null; }
  };
  const go = (next) => { cleanup(); local.mode = next; local.interacted = true; draw(); };
  const done = async (result, meta = {}) => {
    cleanup();
    rememberEmail(result?.user?.email ?? local.email);
    await onSuccess(result, meta);
  };

  const head = (title, desc) => html`<div class="auth-head"><h2>${title}</h2>${desc ? html`<p>${desc}</p>` : ''}</div>`;
  const emailField = (autofocus = true) => html`<div class="field"><label for="a-email">${t('auth.email')}</label>
    <input class="input" id="a-email" name="email" type="email" inputmode="email" autocomplete="username webauthn" required maxlength="254" value="${local.email}" ${autofocus ? raw('autofocus') : ''} spellcheck="false" autocapitalize="off"></div>`;

  const views = {
    login: () => html`${head(t('auth.login.title'), context?.appName ? t('auth.login.context', { app: context.appName }) : t('auth.login.desc'))}
      <form data-form="login" novalidate>
        ${emailField()}
        ${passwordField({ label: t('auth.password'), id: 'a-password' })}
        <div class="row"><span class="spacer"></span><button type="button" class="link-btn" data-go="forgot">${t('auth.forgot')}</button></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit">${t('auth.submit.login')}${icon('arrow-right')}</button>
      </form>
      <div class="divider-text">${t('common.or')}</div>
      <div class="auth-alt">
        ${passkeysSupported() ? html`<button type="button" class="btn btn-glass" data-do="passkey">${icon('fingerprint-pattern')}${t('auth.passkey')}</button>` : ''}
        <button type="button" class="btn btn-glass" data-do="passcord">${icon('smartphone')}${t('auth.passcord')}</button>
      </div>
      <p class="auth-foot">${t('auth.noAccount')} <button type="button" class="link-btn" data-go="register">${t('auth.createOne')}</button></p>`,

    register: () => html`${head(t('auth.register.title'), context?.appName ? t('auth.register.context', { app: context.appName }) : t('auth.register.desc'))}
      <form data-form="register" novalidate>
        <div class="field"><label for="a-name">${t('auth.name')}</label><input class="input" id="a-name" name="name" autocomplete="nickname" required maxlength="60" autofocus></div>
        ${emailField(false)}
        ${passwordField({ label: t('auth.password'), autocomplete: 'new-password', minlength: 12, strength: true, id: 'a-password' })}
        <button class="btn btn-primary btn-lg btn-block" type="submit">${t('auth.submit.register')}${icon('sparkles')}</button>
      </form>
      <p class="legal">${t('auth.register.legal')}</p>
      <p class="auth-foot">${t('auth.hasAccount')} <button type="button" class="link-btn" data-go="login">${t('auth.signIn')}</button></p>`,

    verify: () => html`<div class="auth-illu"><div class="icon-badge grad">${icon('mail-check')}</div></div>
      ${head(t('auth.verify.title'), t('auth.verify.desc', { email: local.email }))}
      <form data-form="verify" novalidate>
        <div class="field"><label for="a-code" class="sr-only">${t('verify.code')}</label><input class="input input-otp" id="a-code" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9 ]{6,7}" required maxlength="7" autofocus placeholder="••••••"></div>
        <button class="btn btn-primary btn-lg btn-block" type="submit">${t('auth.verify.submit')}${icon('arrow-right')}</button>
      </form>
      ${local.devUrl ? html`<a class="btn btn-glass btn-block" href="${local.devUrl}">${icon('external-link')}${t('auth.devLink')}</a>` : ''}
      <div class="row-wrap"><button type="button" class="link-btn" data-do="resend-code">${t('verify.resend')}</button><span class="spacer"></span><button type="button" class="link-btn muted" data-do="skip-verify">${t('auth.verify.later')}</button></div>`,

    mfa: () => html`<div class="auth-illu"><div class="icon-badge grad">${icon('shield-check')}</div></div>
      ${head(t('auth.mfa.title'), local.recovery ? t('auth.mfa.recoveryHint') : t('auth.mfa.desc'))}
      <form data-form="mfa" novalidate>
        ${local.recovery
          ? html`<div class="field"><label for="a-otp">${t('auth.mfa.recovery')}</label><input class="input mono" id="a-otp" name="otp" autocomplete="off" required maxlength="24" autofocus spellcheck="false" autocapitalize="off" placeholder="xxxxx-xxxxx"></div>`
          : html`<div class="field"><label for="a-otp" class="sr-only">${t('auth.mfa.code')}</label><input class="input input-otp" id="a-otp" name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9 ]{6,7}" required maxlength="7" autofocus placeholder="••••••"></div>`}
        <button class="btn btn-primary btn-lg btn-block" type="submit">${t('auth.mfa.submit')}</button>
      </form>
      <div class="row-wrap"><button type="button" class="link-btn" data-do="toggle-recovery">${local.recovery ? t('auth.mfa.useTotp') : t('auth.mfa.useRecovery')}</button><span class="spacer"></span><button type="button" class="link-btn muted" data-go="login">${icon('arrow-left')}${t('common.back')}</button></div>`,

    forgot: () => html`${head(t('auth.forgot.title'), t('auth.forgot.desc'))}
      <form data-form="forgot" novalidate>
        ${emailField()}
        <button class="btn btn-primary btn-lg btn-block" type="submit">${t('auth.forgot.submit')}${icon('send')}</button>
      </form>
      <p class="auth-foot"><button type="button" class="link-btn muted" data-go="login">${icon('arrow-left')}${t('common.back')}</button></p>`,

    'forgot-sent': () => html`<div class="auth-illu"><div class="icon-badge grad">${icon('mail-check')}</div></div>
      ${head(t('auth.forgot.sent.title'), t('auth.forgot.sent.desc', { email: local.email }))}
      <p class="small subtle">${t('auth.forgot.sent.tip')}</p>
      ${local.devUrl ? html`<a class="btn btn-glass btn-block" href="${local.devUrl}">${icon('external-link')}${t('auth.devLink')}</a>` : ''}
      <p class="auth-foot"><button type="button" class="link-btn" data-go="login">${icon('arrow-left')}${t('auth.signIn')}</button></p>`,

    reset: () => local.resetInfo === false
      ? html`<div class="auth-illu"><div class="icon-badge tone-danger">${icon('circle-x')}</div></div>
          ${head(t('auth.reset.title'), t('auth.reset.invalid'))}
          <button type="button" class="btn btn-primary btn-block" data-go="forgot">${t('auth.forgot.submit')}</button>`
      : !local.resetInfo
        ? html`<div class="stack"><div class="skeleton sk-title"></div><div class="skeleton sk-line"></div><div class="skeleton sk-block"></div></div>`
        : html`${head(t('auth.reset.title'), t('auth.reset.desc', { email: local.resetInfo.email }))}
          <form data-form="reset" novalidate>
            ${passwordField({ label: t('auth.reset.new'), autocomplete: 'new-password', minlength: 12, strength: true, autofocus: true, id: 'a-new' })}
            ${passwordField({ name: 'confirm', label: t('auth.reset.confirm'), autocomplete: 'new-password', minlength: 12, id: 'a-confirm' })}
            ${local.resetInfo.mfa ? html`<div class="field"><label for="a-otp">${t('auth.reset.mfa')}</label><input class="input mono" id="a-otp" name="otp" autocomplete="one-time-code" required maxlength="24" spellcheck="false"><p class="field-hint">${t('auth.reset.mfaHint')}</p></div>` : ''}
            <button class="btn btn-primary btn-lg btn-block" type="submit">${t('auth.reset.submit')}</button>
          </form>`,

    passcord: () => html`${head(t('auth.passcord.title'), isMobile() ? t('auth.passcord.mobile') : t('auth.passcord.scan'))}
      <div class="passcord-wait" data-passcord>
        <div class="stack"><div class="skeleton sk-block"></div></div>
      </div>
      <p class="auth-foot"><button type="button" class="link-btn muted" data-go="login">${icon('arrow-left')}${t('common.back')}</button></p>`,
  };

  function draw() {
    render(host, html`<div class="auth-view" data-mode="${local.mode}">${views[local.mode]()}</div>`);
    const focus = $('[autofocus]', host);
    if (focus && (local.interacted || !isMobile())) focus.focus({ preventScroll: true });
    if (local.mode === 'login') startConditionalPasskey();
    if (local.mode === 'passcord') startPasscord();
    if (local.mode === 'reset' && local.resetInfo === null) loadReset();
  }

  async function loadReset() {
    try {
      local.resetInfo = await api('/api/password/reset/check', { token: resetToken });
    } catch {
      local.resetInfo = false;
    }
    if (local.mode === 'reset') draw();
  }

  // ── Passkeys ────────────────────────────────────────────────────────
  async function passkeyLogin({ conditional = false } = {}) {
    if (!passkeysSupported()) throw new Error(t('auth.passkey.unsupported'));
    if (local.passkeyAbort) local.passkeyAbort.abort();
    const controller = new AbortController();
    local.passkeyAbort = controller;
    const options = await api('/api/passkeys/login/options', {});
    let credential;
    try {
      credential = await navigator.credentials.get({
        mediation: conditional ? 'conditional' : 'optional',
        signal: controller.signal,
        publicKey: { ...options.publicKey, challenge: b64uToBytes(options.publicKey.challenge), allowCredentials: [] },
      });
    } catch (e) {
      if (controller.signal.aborted) return;
      if (conditional) return;
      throw new Error(e?.name === 'NotAllowedError' ? t('auth.passkey.cancelled') : e?.message || t('auth.passkey.cancelled'));
    } finally {
      if (local.passkeyAbort === controller) local.passkeyAbort = null;
    }
    if (!credential) return;
    const result = await api('/api/passkeys/login', {
      id: options.id,
      credential: {
        id: credential.id,
        clientDataJSON: bytesToB64u(credential.response.clientDataJSON),
        authenticatorData: bytesToB64u(credential.response.authenticatorData),
        signature: bytesToB64u(credential.response.signature),
        userHandle: credential.response.userHandle ? bytesToB64u(credential.response.userHandle) : null,
      },
    });
    await done(result, { method: 'passkey' });
  }
  async function startConditionalPasskey() {
    try {
      if (!passkeysSupported() || !(await PublicKeyCredential.isConditionalMediationAvailable?.())) return;
      await passkeyLogin({ conditional: true });
    } catch (e) {
      if (local.mode === 'login') toastError(e);
    }
  }

  // ── Passcord ────────────────────────────────────────────────────────
  async function startPasscord() {
    let request;
    try {
      request = await api('/api/passcord/login', {});
    } catch (e) {
      toastError(e);
      return go('login');
    }
    if (local.mode !== 'passcord') return;
    const box = $('[data-passcord]', host);
    let active = true;
    local.stop.push(() => { active = false; });
    const mobile = isMobile();
    local.passcord = { request, code: null };
    // Ordinateur : la demande part d'abord vers l'iPhone (Passcord + notification),
    // le QR code reste là pour qui préfère scanner.
    render(box, html`${mobile
        ? html`<div class="auth-illu"><div class="icon-badge grad">${icon('smartphone')}</div></div>`
        : html`<div class="passcord-send" data-passcord-send></div>
          <div class="divider-text">${t('auth.passcord.orScan')}</div>
          <div class="qr-frame">${qrSvg(request.url)}<span class="qr-scan"></span></div>`}
      <div class="status"><span class="pulse-dot"></span><span>${t('auth.passcord.waiting')}</span><span class="countdown" data-countdown></span></div>
      <div class="row-wrap">
        <a class="btn ${mobile ? 'btn-primary' : 'btn-glass'} btn-sm" href="${request.url}">${icon('external-link')}${t('auth.passcord.open')}</a>
        <button type="button" class="btn btn-ghost btn-sm" data-do="copy-passcord" data-url="${request.url}">${icon('copy')}${t('auth.passcord.copy')}</button>
      </div>`);
    const expired = () => {
      if (!active) return;
      active = false;
      render(box, html`<div class="auth-illu"><div class="icon-badge tone-warn">${icon('clock')}</div></div><p class="muted">${t('auth.passcord.expired')}</p>
        <button type="button" class="btn btn-primary" data-do="passcord">${icon('refresh-cw')}${t('common.retry')}</button>`);
    };
    local.stop.push(startCountdown($('[data-countdown]', box), request.expiresAt, expired));
    if (!mobile) {
      drawSend();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(local.email)) sendToPhone().catch(() => {});
    }
    const poll = async () => {
      if (!active) return;
      try {
        const result = await api('/api/passcord/poll', { id: request.id, pollToken: request.pollToken });
        if (!active) return;
        if (!result.pending) {
          active = false;
          $('.qr-frame', box)?.classList.add('done');
          return done(result, { method: 'passcord' });
        }
      } catch (e) {
        if (e.reason === 'denied') {
          active = false;
          render(box, html`<div class="auth-illu"><div class="icon-badge tone-danger">${icon('circle-x')}</div></div><p class="muted">${t('auth.passcord.denied')}</p>
            <button type="button" class="btn btn-primary" data-do="passcord">${icon('refresh-cw')}${t('common.retry')}</button>`);
          return;
        }
        if (e.status === 410) return expired();
        if (!active) return;
      }
      setTimeout(poll, 2000);
    };
    setTimeout(poll, 2000);
  }

  /** Bloc « Envoyer à mon iPhone » : email, puis le nombre à retrouver dans Passcord. */
  function drawSend() {
    const slot = $('[data-passcord-send]', host);
    if (!slot || !local.passcord) return;
    const { code } = local.passcord;
    render(slot, code
      ? html`<div class="passcord-number" aria-live="polite">
          <span class="label">${icon('smartphone')}${t('auth.passcord.number')}</span>
          <strong class="digits">${code}</strong>
          <p class="small subtle">${t('auth.passcord.numberHint', { email: local.email })}</p>
          <div class="row-wrap"><button type="button" class="link-btn" data-do="passcord-resend">${icon('send')}${t('auth.passcord.resend')}</button><span class="spacer"></span><button type="button" class="link-btn muted" data-do="passcord-change">${t('auth.passcord.change')}</button></div>
        </div>`
      : html`<form data-form="passcord-send" novalidate>
          ${emailField(!local.email)}
          <button class="btn btn-primary btn-block" type="submit">${icon('send')}${t('auth.passcord.send')}</button>
          <p class="field-hint">${t('auth.passcord.sendDesc')}</p>
        </form>`);
  }
  async function sendToPhone() {
    const p = local.passcord;
    if (!p) return;
    const result = await api('/api/passcord/notify', { id: p.request.id, pollToken: p.request.pollToken, email: local.email });
    if (local.passcord !== p) return;
    p.code = result.code;
    drawSend();
  }

  // ── Soumissions ─────────────────────────────────────────────────────
  const submitters = {
    async login(form) {
      local.email = form.email.value.trim();
      local.password = form.password.value;
      try {
        const result = await api('/api/login', { email: local.email, password: local.password });
        local.password = '';
        await done(result, { method: 'password' });
      } catch (e) {
        if (e.reason === 'mfa_required') return go('mfa');
        throw e;
      }
    },
    async 'passcord-send'(form) {
      local.email = form.email.value.trim();
      await sendToPhone();
    },
    async register(form) {
      local.email = form.email.value.trim();
      const result = await api('/api/register', { name: form.name.value.trim(), email: local.email, password: form.password.value });
      let delivery = null;
      try { delivery = await api('/api/email/send', {}); } catch { /* renvoyable depuis le compte */ }
      if (!delivery) return done(result, { registered: true });
      // Code à 6 chiffres tout de suite : l'utilisateur ne quitte pas l'écran
      // (ni l'app qui l'a envoyé ici) pour aller cliquer un lien.
      local.registered = result;
      local.devUrl = delivery.devUrl;
      if (delivery.devCode) console.info('[dev] code email :', delivery.devCode);
      go('verify');
    },
    async verify(form) {
      await api('/api/email/verify-code', { code: form.code.value });
      celebrate();
      await done(local.registered, { registered: true, verified: true });
    },
    async mfa(form) {
      try {
        const result = await api('/api/login', { email: local.email, password: local.password, otp: form.otp.value.trim() });
        local.password = '';
        await done(result, { method: 'password' });
      } catch (e) {
        if (e.status === 401 && !e.reason) { local.password = ''; go('login'); }
        if (e.reason === 'mfa_unreadable' && !local.recovery) { local.recovery = true; draw(); }
        throw e;
      }
    },
    async forgot(form) {
      local.email = form.email.value.trim();
      const result = await api('/api/password/forgot', { email: local.email });
      local.devUrl = result.devUrl;
      go('forgot-sent');
    },
    async reset(form) {
      if (form.password.value !== form.confirm.value) {
        form.confirm.setAttribute('aria-invalid', 'true');
        throw new Error(t('auth.reset.mismatch'));
      }
      const result = await api('/api/password/reset', { token: resetToken, password: form.password.value, otp: form.otp?.value.trim() || undefined });
      await done(result, { method: 'reset' });
    },
  };

  host.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-form]');
    if (!form) return;
    event.preventDefault();
    if (!form.checkValidity()) {
      const invalid = $(':invalid', form);
      invalid?.focus();
      invalid?.setAttribute('aria-invalid', 'true');
      toast(invalid?.validationMessage || t('error.form'), { type: 'error' });
      return;
    }
    await busy($('[type="submit"]', form), async () => {
      try {
        await submitters[form.dataset.form](form.elements);
      } catch (e) {
        toastError(e);
        const field = form.elements.otp ?? form.elements.code ?? form.elements.password;
        if (field && e.status && e.status < 500) { field.select?.(); field.setAttribute('aria-invalid', 'true'); }
      }
    });
  });
  host.addEventListener('input', (event) => event.target.removeAttribute?.('aria-invalid'));
  host.addEventListener('click', async (event) => {
    const goTo = event.target.closest('[data-go]');
    if (goTo) {
      const email = $('#a-email', host)?.value;
      if (email) local.email = email.trim();
      local.recovery = false;
      return go(goTo.dataset.go);
    }
    const doer = event.target.closest('[data-do]');
    if (!doer) return;
    const what = doer.dataset.do;
    if (what === 'passcord') {
      // L'email déjà tapé sert à envoyer la demande directement à l'iPhone.
      const email = $('#a-email', host)?.value;
      if (email) local.email = email.trim();
      return go('passcord');
    }
    if (what === 'passcord-resend') return busy(doer, () => sendToPhone().catch(toastError));
    if (what === 'passcord-change') { local.passcord.code = null; return drawSend(); }
    if (what === 'toggle-recovery') { local.recovery = !local.recovery; local.interacted = true; return draw(); }
    if (what === 'copy-passcord') return copyText(doer.dataset.url);
    if (what === 'passkey') await busy(doer, () => passkeyLogin().catch(toastError));
    if (what === 'resend-code') await busy(doer, () => api('/api/email/send', {}).then(() => toast(t('auth.verify.resent'))).catch(toastError));
    if (what === 'skip-verify') await done(local.registered, { registered: true });
  });

  draw();
  return { go, destroy: cleanup };
}

messages({
  fr: {
    'auth.passcord.send': 'Envoyer à mon iPhone', 'auth.passcord.sendDesc': 'La demande arrive dans Passcord, et en notification si tu les as activées.',
    'auth.passcord.number': 'Dans Passcord, choisis', 'auth.passcord.numberHint': 'Demande envoyée à l’iPhone de {email}. Ouvre Passcord : elle t’attend. Rien reçu ? Scanne le QR code.',
    'auth.passcord.resend': 'Renvoyer', 'auth.passcord.change': 'Autre adresse', 'auth.passcord.orScan': 'ou scanne avec l’appareil photo',
    'auth.passcord.denied': 'Connexion refusée depuis ton iPhone.',
  },
  en: {
    'auth.passcord.send': 'Send to my iPhone', 'auth.passcord.sendDesc': 'The request shows up in Passcord, and as a notification if you turned them on.',
    'auth.passcord.number': 'In Passcord, pick', 'auth.passcord.numberHint': 'Request sent to {email}’s iPhone. Open Passcord: it’s waiting. Nothing? Scan the QR code.',
    'auth.passcord.resend': 'Send again', 'auth.passcord.change': 'Other address', 'auth.passcord.orScan': 'or scan with the camera',
    'auth.passcord.denied': 'Sign-in declined from your iPhone.',
  },
});
