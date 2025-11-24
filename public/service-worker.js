const cacheName = 'podcast-player-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/podcast-icon-192.png',
  '/podcast-icon-512.png',
  '/podcast-icon.png',
  '/favicon.png',
]

// install event - caching assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(assetsToCache);
      })
  )
})

// fetch event - serving cached content
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
      })
  )
})

//  activate event -clean up old caches
self.addEventListener('activate', event => {
  const cacheWhiteList = [cacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(!cacheWhiteList.includes(cache)) return caches.delete(cache);
        })
      )
    })
  )
})