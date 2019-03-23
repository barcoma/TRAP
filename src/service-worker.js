const MAPBOX_API_KEY = "pk.eyJ1IjoiYmFyY29tYSIsImEiOiJjam9xM3gwYWYwMHlpM3ZrZmY4NWNwam9kIn0.TE3Zma1nEd5mbbdVCfQGMA" ;
const MapBoxDomain     = "mapbox.com/";

workbox.setConfig({
    debug: false,
  });
  
  // workbox.precaching.precacheAndRoute([]);
  
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
    
  workbox.routing.registerRoute(
    new RegExp('mapbox'),
    workbox.strategies.networkFirst({
      cacheName: 'mapbox',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
        }),
      ],
    }),
  );

self.addEventListener('fetch', function(event) {
    var url = event.request.url;

    if(url.startsWith('https://') && (url.includes('tiles.mapbox.com') || url.includes('api.mapbox.com'))) {
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
})