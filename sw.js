var urlsToCache = [
  'assets/common-fb.js',
  'assets/home.js',
  'assets/common.css',
  'assets/IMDb.png',
  'assets/player.css',
  'assets/player.js',
  'assets/search.css',
  'assets/DEV.jpg',
  'assets/star.png',
  'assets/torrent.png',
  'assets/account.js',
  'assets/account.css',
  'assets/download.png',
  'assets/tv.css',
  'assets/tv.js',
  'assets/writer.js',
  'assets/main.css',
  'assets/main.js',
  'contact/index.html',
  'login/index.html',
  'logout/index.html',
  'search/index.html',
  'tv/index.html',
  'watch/index.html',
  'index.html',
  'favicon.ico',
  'https://cdn.jsdelivr.net/gh/DevSaurabhcb/sp.css@1.0.2/min/sp.min.css',
  'https://cdn.jsdelivr.net/gh/DevSaurabhcb/sp.css@1.0.2/min/sp.min.js'
];
var CACHE_NAME = "files_v2";
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
});