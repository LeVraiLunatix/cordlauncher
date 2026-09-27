/* Démarrage : thème, langue, liens reçus par email, puis vitrine ou compte. */

messages({
  fr: {
    'boot.verified': 'Adresse email confirmée. Tu peux utiliser ton compte Cord dans toutes les apps.',
    'boot.verifyFailed': 'Ce lien de confirmation a expiré ou a déjà servi.',
    'boot.emailChanged': 'Ta nouvelle adresse est confirmée : {email}.',
    'boot.emailChangeFailed': 'Ce lien de changement d’adresse a expiré ou a déjà servi.',
    'boot.passwordReset': 'Mot de passe changé. Toutes tes autres sessions ont été fermées.',
  },
  en: {
    'boot.verified': 'Email address confirmed. You can use your Cord account in every app.',
    'boot.verifyFailed': 'This confirmation link has expired or was already used.',
    'boot.emailChanged': 'Your new address is confirmed: {email}.',
    'boot.emailChangeFailed': 'This email change link has expired or was already used.',
    'boot.passwordReset': 'Password changed. All your other sessions were signed out.',
  },
});

async function boot() {
  setLocale(initialLocale());
  applyTheme(savedTheme());
  const suiteReady = api('/api/suite').then((s) => { state.suite = s.apps; state.features = s.features; }).catch(() => {});

  if (location.pathname === '/authorize') {
    await suiteReady;
    return showConsent();
  }

  const params = new URLSearchParams(location.search);
  // Notification « Demande de connexion » : ouvrir Passcord d'un geste.
  const passcordLink = params.get('passcord');
  if (passcordLink && /^passcord:\/\/cord\/login\?/.test(passcordLink)) {
    history.replaceState(null, '', '/');
    await suiteReady;
    return showPasscordRequest(passcordLink);
  }
  const verify = params.get('verify');
  const reset = params.get('reset');
  const emailChange = params.get('email-change');
  if (verify || reset || emailChange) history.replaceState(null, '', `/${location.hash}`);

  const notices = [];
  if (verify) {
    try {
      await api('/api/email/verify', { token: verify });
      notices.push(() => { celebrate(); toast(t('boot.verified'), { duration: 7000 }); });
    } catch {
      notices.push(() => toast(t('boot.verifyFailed'), { type: 'error' }));
    }
  }
  if (emailChange) {
    try {
      const result = await api('/api/email/change/confirm', { token: emailChange });
      notices.push(() => toast(t('boot.emailChanged', { email: result.email }), { duration: 7000 }));
    } catch (e) {
      notices.push(() => toast(e.status === 409 ? e.message : t('boot.emailChangeFailed'), { type: 'error' }));
    }
  }

  await suiteReady;
  if (reset) {
    showLanding({ mode: 'reset', resetToken: reset });
    // Le succès de la réinitialisation passe par afterLogin() : message dédié.
    return;
  }
  try {
    await loadAccount();
    renderShell();
  } catch (e) {
    if (e.status !== 401 && e.status !== undefined) toastError(e);
    showLanding();
  }
  notices.forEach((fn) => fn());
}

boot();
