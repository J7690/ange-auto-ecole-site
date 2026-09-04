// Service worker - Ange Auto-École
// Met le site en cache pour un chargement rapide et un usage hors-ligne basique (app shell).

const CACHE_NAME = 'ange-auto-ecole-v1';
const APP_SHELL = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/assets/logo/LOGO_ANGE.png',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .catch(() => {}) // ne bloque pas l'installation si une ressource manque
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Ne pas intercepter les requêtes vers d'autres origines (ex: formulaires externes)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const network = fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});
