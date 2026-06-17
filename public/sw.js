const CACHE = 'freshmart-v1';
const OFFLINE_URL = '/';

// Assets to cache immediately on install
const PRECACHE = [
  '/',
  '/categories',
  '/cart',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  // Skip Supabase API calls — always go to network
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        // Offline fallback
        caches.match(event.request).then(cached => cached || caches.match(OFFLINE_URL))
      )
  );
});
