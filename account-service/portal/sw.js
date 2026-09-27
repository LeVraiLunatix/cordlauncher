// Service worker du Compte Cord : uniquement les notifications push (aucun
// cache hors ligne). Servi à /sw.js par la fonction (voir gen-portal.cjs).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let message = {};
  try {
    message = event.data ? event.data.json() : {};
  } catch {
    message = { title: 'Compte Cord', body: event.data ? event.data.text() : '' };
  }
  const url = typeof message.url === 'string' && message.url.startsWith('/') ? message.url : '/';
  event.waitUntil(
    self.registration.showNotification(message.title || 'Compte Cord', {
      body: message.body || '',
      icon: '/assets/icon-180.png',
      badge: '/assets/icon-32.png',
      tag: message.tag || undefined,
      renotify: Boolean(message.tag),
      data: { url },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of windows) {
        if (new URL(client.url).origin === self.location.origin && 'navigate' in client) {
          await client.focus();
          return client.navigate(target);
        }
      }
      return self.clients.openWindow(target);
    })(),
  );
});
