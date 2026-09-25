/* Appareils : iPhone Passcord associés et sessions ouvertes. */

messages({
  fr: {
    'dev.title': 'Appareils', 'dev.desc': 'Tes iPhone Passcord et tous les appareils actuellement connectés à ton compte.',
    'dev.passcord': 'Passcord, ta clé iPhone', 'dev.passcord.desc': 'Associe ton iPhone une fois : ensuite, tes connexions se valident dans Passcord avec Face ID. La clé privée ne quitte jamais le téléphone.',
    'dev.passcord.pair': 'Associer un iPhone', 'dev.passcord.empty': 'Aucun iPhone associé', 'dev.passcord.emptyDesc': 'Passcord transforme ton iPhone en clé de connexion pour toute la suite.',
    'dev.passcord.added': 'Associé {when}', 'dev.passcord.used': 'Dernière validation {when}', 'dev.passcord.unused': 'Jamais utilisé pour se connecter',
    'dev.passcord.revokeTitle': 'Révoquer « {name} » ?', 'dev.passcord.revokeDesc': 'Cet iPhone ne pourra plus valider de connexion. Tu pourras l’associer de nouveau à tout moment.',
    'dev.passcord.revoked': 'iPhone révoqué.', 'dev.passcord.renamed': 'iPhone renommé.', 'dev.passcord.name': 'Nom de l’iPhone',
    'pair.title': 'Associer Passcord', 'pair.scan': 'Sur ton iPhone, scanne ce code avec l’appareil photo : Passcord s’ouvre. Connecte-toi avec ton compte Cord et valide avec Face ID.',
    'pair.mobile': 'Sur cet iPhone, ouvre la demande dans Passcord, connecte-toi à ton compte Cord et valide avec Face ID.',
    'pair.manual': 'Pas d’appareil photo ? Dans Passcord, ouvre Réglages › Compte Cord et colle ce lien.',
    'pair.waiting': 'En attente de ton iPhone…', 'pair.done': 'iPhone associé ! Tes prochaines connexions pourront se valider avec Face ID.',
    'pair.expired': 'La demande a expiré (3 minutes).', 'pair.server': 'Dans Passcord, le serveur doit être {server}.',
    'dev.sessions': 'Sessions actives', 'dev.sessions.desc': 'Les navigateurs et apps connectés à ton compte Cord. Ferme ceux que tu ne reconnais pas.',
    'dev.sessions.current': 'Cet appareil', 'dev.sessions.signout': 'Déconnecter', 'dev.sessions.others': 'Déconnecter les autres appareils',
    'dev.sessions.active': 'Actif {when}', 'dev.sessions.since': 'Connecté {when}', 'dev.sessions.via': 'via {method}',
    'dev.sessions.othersTitle': 'Déconnecter tous les autres appareils ?', 'dev.sessions.othersDesc': 'Tous les appareils sauf celui-ci devront se reconnecter.',
    'dev.sessions.closed': 'Session fermée.', 'dev.sessions.closedMany': '{n} session(s) fermée(s).',
    'dev.sessions.revokeTitle': 'Déconnecter {device} ?', 'dev.sessions.revokeDesc': 'Cet appareil devra se reconnecter pour accéder à ton compte.',
    'dev.sessions.tip': 'Tu ne reconnais pas un appareil ? Déconnecte-le puis change ton mot de passe.',
  },
  en: {
    'dev.title': 'Devices', 'dev.desc': 'Your Passcord iPhones and every device currently signed in to your account.',
    'dev.passcord': 'Passcord, your iPhone key', 'dev.passcord.desc': 'Pair your iPhone once: from then on, you approve sign-ins in Passcord with Face ID. The private key never leaves the phone.',
    'dev.passcord.pair': 'Pair an iPhone', 'dev.passcord.empty': 'No paired iPhone', 'dev.passcord.emptyDesc': 'Passcord turns your iPhone into a sign-in key for the whole suite.',
    'dev.passcord.added': 'Paired {when}', 'dev.passcord.used': 'Last approval {when}', 'dev.passcord.unused': 'Never used to sign in',
    'dev.passcord.revokeTitle': 'Revoke “{name}”?', 'dev.passcord.revokeDesc': 'This iPhone won’t be able to approve sign-ins anymore. You can pair it again anytime.',
    'dev.passcord.revoked': 'iPhone revoked.', 'dev.passcord.renamed': 'iPhone renamed.', 'dev.passcord.name': 'iPhone name',
    'pair.title': 'Pair Passcord', 'pair.scan': 'On your iPhone, scan this code with the camera: Passcord opens. Sign in with your Cord account and approve with Face ID.',
    'pair.mobile': 'On this iPhone, open the request in Passcord, sign in to your Cord account and approve with Face ID.',
    'pair.manual': 'No camera? In Passcord, open Settings › Cord Account and paste this link.',
    'pair.waiting': 'Waiting for your iPhone…', 'pair.done': 'iPhone paired! Your next sign-ins can be approved with Face ID.',
    'pair.expired': 'The request expired (3 minutes).', 'pair.server': 'In Passcord, the server must be {server}.',
    'dev.sessions': 'Active sessions', 'dev.sessions.desc': 'Browsers and apps signed in to your Cord account. Sign out any you don’t recognize.',
    'dev.sessions.current': 'This device', 'dev.sessions.signout': 'Sign out', 'dev.sessions.others': 'Sign out other devices',
    'dev.sessions.active': 'Active {when}', 'dev.sessions.since': 'Signed in {when}', 'dev.sessions.via': 'via {method}',
    'dev.sessions.othersTitle': 'Sign out every other device?', 'dev.sessions.othersDesc': 'All devices except this one will need to sign in again.',
    'dev.sessions.closed': 'Session signed out.', 'dev.sessions.closedMany': '{n} session(s) signed out.',
    'dev.sessions.revokeTitle': 'Sign out {device}?', 'dev.sessions.revokeDesc': 'This device will need to sign in again to access your account.',
    'dev.sessions.tip': 'Don’t recognize a device? Sign it out, then change your password.',
  },
});

VIEWS.appareils = {
  render(a) {
    const others = a.sessions.filter((s) => !s.current).length;
    return html`<div class="view">
      ${pageHead({ eyebrow: t('nav.section.account'), title: t('dev.title'), desc: t('dev.desc') })}
      <section class="card glass">
        <div class="card-head">
          <span class="icon-badge grad">${icon('smartphone')}</span>
          <div class="grow"><h2 class="card-title">${t('dev.passcord')}</h2><p class="card-desc">${t('dev.passcord.desc')}</p></div>
        </div>
        <div class="card-body">
          ${a.passcord.length
            ? html`<ul class="list">${a.passcord.map((k) => html`<li class="list-item">
                <span class="icon-badge tone-ok">${icon('smartphone')}</span>
                <div class="body"><div class="title">${k.name}</div>
                  <div class="meta"><span>${t('dev.passcord.added', { when: fmtDateShort(k.createdAt) })}</span><span>${k.lastUsedAt ? t('dev.passcord.used', { when: fmtRelative(k.lastUsedAt) }) : t('dev.passcord.unused')}</span></div></div>
                <div class="actions compact">
                  <button class="btn btn-ghost btn-icon btn-sm" data-action="passcord-rename" data-id="${k.id}" data-name="${k.name}" aria-label="${t('common.rename')} ${k.name}">${icon('pencil')}</button>
                  <button class="btn btn-danger btn-sm" data-action="passcord-revoke" data-id="${k.id}" data-name="${k.name}">${t('common.revoke')}</button>
                </div></li>`)}</ul>`
            : emptyState({ iconName: 'smartphone', title: t('dev.passcord.empty'), desc: t('dev.passcord.emptyDesc') })}
        </div>
        <div class="card-foot"><button class="btn btn-primary" data-action="passcord-pair">${icon('qr-code')}${t('dev.passcord.pair')}</button></div>
      </section>

      <section class="card glass">
        <div class="card-head">
          <span class="icon-badge tone-info">${icon('monitor-smartphone')}</span>
          <div class="grow"><h2 class="card-title">${t('dev.sessions')}</h2><p class="card-desc">${t('dev.sessions.desc')}</p></div>
        </div>
        <ul class="list card-body">
          ${a.sessions.map((s) => html`<li class="list-item">
            ${s.device.logo ? html`<img class="device-logo" src="${s.device.logo}" alt="" width="42" height="42">` : html`<span class="icon-badge ${s.current ? 'grad' : 'tone-muted'}">${icon(deviceIcon(s.device.kind))}</span>`}
            <div class="body">
              <div class="title">${s.device.label}${s.current ? html`<span class="badge tone-ok"><span class="dot"></span>${t('dev.sessions.current')}</span>` : ''}</div>
              <div class="meta">
                <span>${icon('clock')}${t('dev.sessions.active', { when: fmtRelative(s.lastSeenAt || s.createdAt) })}</span>
                ${s.method ? html`<span>${icon('log-in')}${t('dev.sessions.via', { method: t(`via.${s.method === 'register' ? 'password' : s.method}`) })}</span>` : ''}
                ${s.ip ? html`<span class="mono">${icon('globe')}${s.ip}</span>` : ''}
                <span title="${fmtDateTime(s.createdAt)}">${t('dev.sessions.since', { when: fmtRelative(s.createdAt) })}</span>
              </div>
            </div>
            ${s.current ? '' : html`<div class="actions compact"><button class="btn btn-ghost btn-sm" data-action="session-revoke" data-id="${s.id}" data-device="${s.device.label}">${icon('log-out')}${t('dev.sessions.signout')}</button></div>`}
          </li>`)}
        </ul>
        <div class="card-foot">
          ${others ? html`<button class="btn btn-danger" data-action="sessions-revoke-others">${icon('log-out')}${t('dev.sessions.others')}</button>` : ''}
          <p class="tiny subtle">${t('dev.sessions.tip')}</p>
        </div>
      </section>
    </div>`;
  },
};

Object.assign(ACTIONS, {
  async 'passcord-pair'(button) {
    const request = await busy(button, () => api('/api/passcord/pair', {}));
    if (!request) return;
    const mobile = isMobile();
    let active = true;
    let stopCountdown = () => {};
    const before = state.account.passcord.length;
    await modal({
      title: t('pair.title'),
      desc: mobile ? t('pair.mobile') : t('pair.scan'),
      iconName: 'smartphone',
      tone: 'grad',
      body: html`${mobile ? '' : html`<div class="qr-frame" data-qr>${qrSvg(request.url)}<span class="qr-scan"></span></div>`}
        <div class="row"><span class="pulse-dot"></span><span class="muted small" data-pair-status>${t('pair.waiting')}</span><span class="spacer"></span><span class="countdown" data-countdown></span></div>
        <a class="btn ${mobile ? 'btn-primary btn-lg' : 'btn-glass'} btn-block" href="${request.url}">${icon('external-link')}${t('auth.passcord.open')}</a>
        <details><summary class="link-btn muted">${t('pair.manual')}</summary>
          <div class="stack-sm"><div class="copyable"><code>${request.url}</code><button type="button" class="btn btn-ghost btn-icon btn-sm" data-pair-copy aria-label="${t('common.copy')}">${icon('copy')}</button></div>
          <p class="tiny subtle">${t('pair.server', { server: location.origin })}</p></div>
        </details>`,
      onOpen(ctx) {
        $('[data-pair-copy]', ctx.dialog).addEventListener('click', () => copyText(request.url));
        stopCountdown = startCountdown($('[data-countdown]', ctx.dialog), request.expiresAt, () => {
          if (!active) return;
          active = false;
          ctx.error(t('pair.expired'));
          $('[data-qr]', ctx.dialog)?.classList.add('done');
        });
        const poll = async () => {
          if (!active || !ctx.dialog.open) return;
          try {
            const status = await api('/api/passcord/pair/status', { id: request.id });
            if (!status.pending && active) {
              active = false;
              await loadAccount();
              if (state.account.passcord.length > before) {
                ctx.close(true);
                celebrate();
                toast(t('pair.done'));
                renderShell();
              } else {
                ctx.error(t('pair.expired'));
              }
              return;
            }
          } catch { /* réessaie */ }
          setTimeout(poll, 2500);
        };
        setTimeout(poll, 2500);
      },
    });
    active = false;
    stopCountdown();
  },
  'passcord-rename'(button) {
    return modal({
      title: t('common.rename'),
      iconName: 'pencil',
      body: html`<div class="field"><label for="m-pc">${t('dev.passcord.name')}</label><input class="input" id="m-pc" name="name" maxlength="60" required value="${button.dataset.name}" autofocus></div>`,
      actions: html`<button type="button" class="btn btn-ghost" data-close>${t('common.cancel')}</button><button type="submit" class="btn btn-primary">${t('common.save')}</button>`,
      async onSubmit(data, ctx) {
        await api('/api/passcord/keys', { id: button.dataset.id, name: String(data.get('name')).trim() }, 'PATCH');
        ctx.close();
        toast(t('dev.passcord.renamed'));
        refresh();
      },
    });
  },
  async 'passcord-revoke'(button) {
    const ok = await confirmDialog({ title: t('dev.passcord.revokeTitle', { name: button.dataset.name }), desc: t('dev.passcord.revokeDesc'), confirm: t('common.revoke') });
    if (!ok) return;
    await api('/api/passcord/keys', { id: button.dataset.id }, 'DELETE');
    toast(t('dev.passcord.revoked'), { type: 'info' });
    refresh();
  },
  async 'session-revoke'(button) {
    const ok = await confirmDialog({ title: t('dev.sessions.revokeTitle', { device: button.dataset.device }), desc: t('dev.sessions.revokeDesc'), confirm: t('dev.sessions.signout'), iconName: 'log-out' });
    if (!ok) return;
    await api('/api/sessions', { id: button.dataset.id }, 'DELETE');
    toast(t('dev.sessions.closed'), { type: 'info' });
    refresh();
  },
  async 'sessions-revoke-others'() {
    const ok = await confirmDialog({ title: t('dev.sessions.othersTitle'), desc: t('dev.sessions.othersDesc'), confirm: t('dev.sessions.others'), iconName: 'log-out' });
    if (!ok) return;
    const result = await api('/api/sessions/revoke-others', {});
    toast(t('dev.sessions.closedMany', { n: result.closed }), { type: 'info' });
    refresh();
  },
});
