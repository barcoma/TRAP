workbox.setConfig({
    debug: false,
  });
  
  workbox.precaching.precacheAndRoute([]);
  
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

  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '383676' },
]);


  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    workbox.strategies.cacheFirst(),
  ); 
    
  workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
      cacheName: 'googleapis',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 30,
        }),
      ],
    }),
  );