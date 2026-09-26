/* Notifications : ce que les apps de la suite envoient au compte (cloche du haut). */

messages({
  fr: {
    'inbox.title': 'Notifications', 'inbox.desc': 'Envoyées par les apps reliées à ton compte Cord.',
    'inbox.readAll': 'Tout marquer comme lu', 'inbox.empty': 'Aucune notification', 'inbox.emptyDesc': 'Quand une app de la suite a du nouveau pour toi, ça s’affiche ici.',
    'inbox.more': 'Plus anciennes', 'inbox.delete': 'Supprimer', 'inbox.open': 'Ouvrir',
  },
  en: {
    'inbox.title': 'Notifications', 'inbox.desc': 'Sent by the apps linked to your Cord account.',
    'inbox.readAll': 'Mark all as read', 'inbox.empty': 'No notifications', 'inbox.emptyDesc': 'When a suite app has news for you, it shows up here.',
    'inbox.more': 'Older', 'inbox.delete': 'Delete', 'inbox.open': 'Open',
  },
});

const inboxState = { items: null, unread: 0, more: false, loading: false };

async function loadInbox(before) {
  inboxState.loading = true;
  try {
    const page = await api(`/api/notifications${before ? `?before=${before}` : ''}`);
    inboxState.items = before ? [...(inboxState.items ?? []), ...page.items] : page.items;
    inboxState.unread = page.unread;
    inboxState.more = page.more;
    if (state.hub) state.hub.unread = page.unread;
  } catch (e) {
    toastError(e);
  } finally {
    inboxState.loading = false;
  }
}

function inboxList() {
  const items = inboxState.items;
  if (!items) return html`<div class="stack-sm">${[1, 2, 3].map(() => html`<div class="skeleton sk-line"></div>`)}</div>`;
  if (!items.length) return emptyState({ iconName: 'inbox', title: t('inbox.empty'), desc: t('inbox.emptyDesc') });
  return html`<ol class="inbox-list">${items.map((n) => html`<li class="${n.readAt ? '' : 'unread'}" data-id="${n.id}">
      <img class="feed-logo" src="${n.logo ?? '/assets/icon-180.png'}" alt="" width="36" height="36">
      <div class="grow"><p class="what"><strong>${n.name}</strong><time>${fmtRelative(n.createdAt)}</time></p><p class="title">${n.title}</p>${n.body ? html`<p class="more">${n.body}</p>` : ''}</div>
      <div class="inbox-actions">
        ${n.url ? html`<a class="btn btn-glass btn-icon btn-sm" href="${n.url}" target="_blank" rel="noopener" data-open="${n.id}" aria-label="${t('inbox.open')}">${icon('arrow-up-right')}</a>` : ''}
        <button type="button" class="btn btn-ghost btn-icon btn-sm" data-remove="${n.id}" aria-label="${t('inbox.delete')}">${icon('trash-2')}</button>
      </div>
    </li>`)}</ol>
    ${inboxState.more ? html`<button type="button" class="btn btn-ghost btn-sm btn-block" data-older>${t('inbox.more')}</button>` : ''}`;
}

Object.assign(ACTIONS, {
  async inbox() {
    const body = () => html`<div data-inbox>${inboxList()}</div>`;
    modal({
      title: t('inbox.title'),
      desc: t('inbox.desc'),
      iconName: 'bell',
      body,
      actions: html`<button type="button" class="btn btn-ghost" data-read-all>${icon('check-check')}${t('inbox.readAll')}</button>`,
      onOpen(ctx) {
        ctx.dialog.classList.add('inbox-sheet');
        const redraw = () => ctx.setBody(body);
        const markRead = async (ids) => {
          await api('/api/notifications/read', ids ? { ids } : { all: true }).catch(toastError);
          for (const n of inboxState.items ?? []) if (!ids || ids.includes(n.id)) n.readAt = n.readAt ?? Date.now();
          inboxState.unread = (inboxState.items ?? []).filter((n) => !n.readAt).length;
          if (state.hub) state.hub.unread = inboxState.unread;
        };
        ctx.dialog.addEventListener('click', async (event) => {
          const open = event.target.closest('[data-open]');
          if (open) return void markRead([open.dataset.open]).then(redraw);
          const remove = event.target.closest('[data-remove]');
          if (remove) {
            await api('/api/notifications', { id: remove.dataset.remove }, 'DELETE').catch(toastError);
            inboxState.items = inboxState.items.filter((n) => n.id !== remove.dataset.remove);
            return redraw();
          }
          if (event.target.closest('[data-older]')) {
            await loadInbox(inboxState.items.at(-1)?.createdAt);
            return redraw();
          }
          if (event.target.closest('[data-read-all]')) {
            event.preventDefault();
            await markRead();
            redraw();
          }
        });
        (inboxState.items ? Promise.resolve() : loadInbox()).then(redraw);
      },
    }).then(() => renderShell());
  },
});
