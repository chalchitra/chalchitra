var urlsToCache = [
  'assets/background.png',
  'assets/common-fb.js',
  'assets/home.js',
  'assets/common.css',
  'assets/i128.png',
  'assets/IMDb.png',
  'assets/play-min.png',
  'assets/player.css',
  'assets/player.js',
  'assets/search.css',
  'assets/dev.jpg',
  'assets/star.png',
  'assets/torrent.png',
  'assets/account.js',
  'assets/account.css',
  'assets/download.png',
  'assets/tv.css',
  'assets/tv.js',
  'assets/videosub-0.9.9.js',
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
  'https://rawgit.com/DevSaurabhcb/sp.css/master/min/sp.min.css',
  'https://rawgit.com/DevSaurabhcb/sp.css/master/min/sp.min.js'
];
var CACHE_NAME = "files_v1";
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