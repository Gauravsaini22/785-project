const CACHE_NAME = 'tour-travel-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',

  // Images
  '/Images/pic1.png',
  '/Images/pic2.png',
  '/Images/pic3.png',
  '/Images/pic4.png',

  '/images/g-1.jpg',
  '/images/g-2.jpg',
  '/images/g-3.jpg',
  '/images/g-4.jpg',
  '/images/g-5.jpg',
  '/images/g-6.jpg',
  '/images/g-7.jpg',
  '/images/g-8.jpg',
  '/images/g-9.jpg',



//   '/Images/g-1.jpg',
//   '/Images/g-2.jpg',
//   '/Images/g-3.jpg',
//   '/Images/g-4.jpg',
//   '/Images/g-5.jpg',
//   '/Images/g-6.jpg',
//   '/Images/g-7.jpg',
//   '/Images/g-8.jpg',

  '/Images/p-2.jpg',
  '/Images/p-3.jpg',
  '/Images/p-4.jpg',
  '/Images/p-5.jpg',
  '/Images/p-6.jpg',

//   Videos (optional, consider size and bandwidth)
  '/Images/vid-1.mp4',
  '/Images/vid-2.mp4',
  '/Images/vid-3.mp4',
  '/Images/vid-4.mp4',
  '/Images/vid-5.mp4',
];



// Install event: Caches the assets
self.addEventListener("install", (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching assets');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: All assets cached');
                return self.skipWaiting(); // Force activation
            })
            .catch((error) => {
                console.error('Service Worker: Caching failed', error);
            })
    );
});

// Fetch event: Serve cached or fetch from network
self.addEventListener("fetch", (event) => {
    if (event.request.method !== 'GET') return;

    const requestURL = new URL(event.request.url);

    // Ignore non-HTTP(s) requests like chrome-extension://
    if (!requestURL.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return response;
                }

                console.log('Service Worker: Fetching from network', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (
                            !networkResponse ||
                            networkResponse.status !== 200 ||
                            networkResponse.type !== 'basic'
                        ) {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // Only cache HTTP(S) requests from your domain
                                if (event.request.url.startsWith(self.location.origin)) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Fetch failed', error);
                        // Optional: return custom offline response
                    });
            })
    );
});


// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim(); // Take control immediately
            })
    );
});