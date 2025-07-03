// This is a very basic service worker for PWA installability.
// For offline capabilities, you would cache more assets.

const CACHE_NAME = 'fd-calculator-v1';
const urlsToCache = [
    '/', // The root URL of your app
    '/index.html', // Your main HTML file
    '/fd-calculator-manifest.json', // Your manifest file
    // You might want to cache Tailwind CSS if you expect offline use,
    // but for simplicity, we're not caching external CDN resources here.
    // 'https://cdn.tailwindcss.com' // Uncomment if you want to cache external CSS
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
