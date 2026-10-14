// Service worker - Ange Auto-École
// Pages : réseau d'abord (le visiteur voit toujours la dernière version),
// cache en secours hors ligne. Styles, scripts et images : cache d'abord,
// mis à jour en arrière-plan. Les vidéos ne sont jamais mises en cache.
//
// styles.css et script.js sont appelés avec ?v=N : changer N (pages + liste
// ci-dessous + CACHE_NAME) à chaque mise en ligne qui les modifie, sinon une
// page neuve tournerait avec un style ancien.

const CACHE_NAME = 'ange-auto-ecole-v9';
const APP_SHELL = [
    '/',
    '/index.html',
    '/merci.html',
    '/styles.css?v=7',
    '/script.js?v=7',
    '/manifest.json',
    '/assets/marque/roue-ailee-240.webp',
    '/assets/marque/embleme_volant.webp',
    '/assets/marque/embleme_aile_haut.webp',
    '/assets/marque/embleme_aile_bas.webp',
    '/assets/video/accueil-camion.webp',
    '/favicon.ico',
    '/assets/icons/roue-32.png',
    '/assets/icons/roue-192.png',
    '/assets/icons/roue-512.png'
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

function mettreEnCache(requete, reponse) {
    if (reponse && reponse.status === 200) {
        const copie = reponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(requete, copie));
    }
    return reponse;
}

self.addEventListener('fetch', (event) => {
    const requete = event.request;
    if (requete.method !== 'GET') return;

    // Ne pas intercepter les autres origines (polices, cartes, formulaires externes)
    if (!requete.url.startsWith(self.location.origin)) return;

    // Vidéos : lecture par plages, laissées au navigateur
    if (requete.destination === 'video' || /\.(mp4|webm)$/.test(new URL(requete.url).pathname)) return;

    if (requete.mode === 'navigate') {
        event.respondWith(
            fetch(requete)
                .then((reponse) => mettreEnCache(requete, reponse))
                .catch(() => caches.match(requete).then((r) => r || caches.match('/index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(requete).then((enCache) => {
            const reseau = fetch(requete)
                .then((reponse) => mettreEnCache(requete, reponse))
                .catch(() => enCache);
            return enCache || reseau;
        })
    );
});
