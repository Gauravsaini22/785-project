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

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching all: app shell and content');
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("install", (event) => {
  event.waitUntil(
  caches.open(CACHE_NAME).then((cache) => {
  console.log("Caching assets");
  return cache.addAll(urlsToCache);
  })
  );
  });

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
  caches.keys().then((cacheNames) => {
  return Promise.all(
  cacheNames.map((cache) => {
  if (cache !== CACHE_NAME) {
  console.log("Deleting old cache:", cache);
  return caches.delete(cache);
  }
  })
  );
  })
  );
  });
