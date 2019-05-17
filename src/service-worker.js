importScripts("https://unpkg.com/dexie@2.0.3/dist/dexie.js");

workbox.setConfig({
    debug: false,
  });
  
  
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );

  workbox.precaching.precacheAndRoute(
    // { url: '/index.html', revision: '383676' },
    self.__precacheManifest || []
    );


  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    workbox.strategies.cacheFirst(),
  ); 
    
  // workbox.routing.registerRoute(
  //   workbox.strategies.networkFirst({
  //     cacheName: 'mapbox',
  //     plugins: [
  //       new workbox.expiration.Plugin({
  //         maxAgeSeconds: 30 // * 24 * 60 * 60,
  //       }),
  //     ],
  //   }),
  // );

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  if (url.startsWith('https://') && (url.includes('tiles.mapbox.com') || url.includes('api.mapbox.com'))) {
    event.respondWith(
      caches.match(event.request).then(function(resp) {
        return resp || fetch(event.request).then(function(response) {
          var cacheResponse = response.clone();
          caches.open('mapbox').then(function(cache) {
            cache.put(event.request, cacheResponse);
          });
          return response;
        });
      })
    );
  }  

  if (url.includes('localhost:4000/graphql')) {
    event.respondWith(
      // cache.match(event.request).then(function (response) {
      //   return response || fetch(event.request).then(function(response) {
      //     caches.open('local-graphql').then(function(cache) {
      //       cache.put(event.request, response.clone());
      //     });
      //     return response;
      //   });
      // })
    )
  }
})
