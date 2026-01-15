self.addEventListener('install', (e) => {
  console.log('Service Worker instalado!');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker ativado!');
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Isso permite que o app carregue conteúdo
  e.respondWith(fetch(e.request));
});

self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : {};
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'jesystem-notif',
    requireInteraction: false,
    silent: false
  };

  e.waitUntil(
    self.registration.showNotification(data.title || 'JeSystem Pro', options)
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === self.location.origin && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
