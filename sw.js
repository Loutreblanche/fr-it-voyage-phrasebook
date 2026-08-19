'use strict';

// Incrémenter ce numéro de version à chaque déploiement pour invalider l'ancien cache.
const CACHE_NAME = 'fr-it-voyage-v11';

const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './phrases.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192-maskable.png',
  './icons/icon-512-maskable.png',
];

self.addEventListener('install', (event) => {
  // On force le contournement du cache HTTP du navigateur (cache: 'reload') :
  // sans ça, le précache pouvait récupérer une version d'index.html/app.js
  // encore fraîche dans le cache du navigateur mais déjà obsolète côté déploiement.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(
        PRECACHE_URLS.map((url) =>
          fetch(url, { cache: 'reload' }).then((response) => cache.put(url, response))
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Stratégie "cache d'abord, réseau en secours" : garantit un fonctionnement
// hors-ligne complet une fois le premier chargement effectué.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return undefined;
        });
    })
  );
});
