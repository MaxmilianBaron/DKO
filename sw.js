const CACHE = 'dso-ui-preview-v102-verified';
const CORE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './app/',
  './app/index.html',
  './app/styles.css',
  './app/app.js',
  './app/core.js',
  './app/screens.js',
  './app/runtime.js',
  './assets/app-icon.svg',
  './assets/photos/entrance-door.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  })));
});
