var staticCacheName = 'converter-static-v1';
var contentImgsCache = 'converter-content-imgs';
var allCaches = [
  staticCacheName,
  contentImgsCache
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/main.css',
        '/convert.js',
        '/js/idb.js',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('hello-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('[service worker] Fetching!!!', event.request.url)
  event.respondWith(
      caches.match(event.request).then(
          (response) => {
              if(response) {
                  console.log('[Service Worker] found in Cache', event.request.url);
                  return response  
              }
              let requestClone = event.request.clone();
              fetch(requestClone)
              .then((response) => {
                  if(!response){
                      console.log('[Service Worker] No response from fetch');
                      return response;
                  }
                  let responseClone = response.clone();
                  caches.open(cacheName).then((cache) => {
                      console.log('Service worker caching cached files!!');
                      cache.put(event.request, responseClone);
                      return response;
                  })

              })
              .catch((err) => console.log('[ServiceWorker] Error fetching and caching new data', err))
          }
      )
  )
})