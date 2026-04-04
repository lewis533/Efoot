/* service-worker.js */
const CACHE = 'efootball-2026-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/screens.css',
  '/css/match.css',
  '/css/squad.css',
  '/css/store.css',
  '/css/components.css',
  '/js/app.js',
  '/js/home.js',
  '/js/match.js',
  '/js/squad.js',
  '/js/store.js',
  '/data/players.js',
  '/data/events.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
