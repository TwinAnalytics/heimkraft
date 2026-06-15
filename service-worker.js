const CACHE_NAME = 'heimkraft-v8';
const IMG_CACHE  = 'heimkraft-img-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/main.js',
  '/js/data.js',
  '/js/storage.js',
  '/js/planner.js',
  '/js/logbook.js',
  '/js/wizard.js',
  '/js/player.js',
  '/js/plan-view.js',
  '/js/today.js',
  '/js/retest.js',
  '/js/settings.js',
  '/js/pwa.js',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== IMG_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Übungsbilder: cache-first, damit Workouts offline funktionieren
  if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(IMG_CACHE).then(cache => cache.put(request, clone));
        }
        return res;
      }))
    );
    return;
  }

  // Cache-first für Icon und Fonts
  if (url.pathname.endsWith('.svg') || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return res;
      }))
    );
    return;
  }

  // Network-first für HTML und JS (zieht Updates)
  event.respondWith(
    fetch(request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      return res;
    }).catch(() => caches.match(request))
  );
});
