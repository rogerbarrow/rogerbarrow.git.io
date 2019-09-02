const cacheName = 'v2';


// Call INstall Event
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');

});

//Call Activate Event

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
  //remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.responseWith(
    fetch(e.request)
    .then(res => {
      //Make Copy/Clone of response

      const resClone = res.clone();
      //open Cache
      caches
        .open(cacheName)
        .then(cache => {
          //add response to cache
          cache.put(e.request, resClone);
        });
      return res;
    }).catch(err => caches.match(e.request).then(res => res))
  );
});