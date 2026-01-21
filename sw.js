const CACHE_NAME = 'bik-order-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/menu.html',
  '/search-labels.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/nav.js',
  '/js/app.js',
  '/manifest.json'
];

// התקנת Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// הפעלת Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// אסטרטגיית Network First - תמיד מנסה לקבל מהשרת קודם
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // אם קיבלנו תשובה תקינה, שומרים ב-cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // אם אין אינטרנט, מחזירים מה-cache
        return caches.match(event.request);
      })
  );
});
