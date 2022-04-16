var CACHE_NAME = 'my-blog-cache-v1';
var urlsToCache = [
    '/',
    '/follback.json',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/img/hero.png',
    '/img/foto.avif',
    '/detail.html',
    '/daftar-blog.html',
    "/js/bootstrap.bundle.min.js",
    "/js/jquery.min.js",
    "/css/bootstrap.min.css",
];

// Listen for install event, set callback
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('in install service worker..... cache opened!');
            return cache.addAll(urlsToCache);
        })
    );
});

// fetch event
self.addEventListener('fetch', function (event) {
    var request = event.request;
    var url = new URL(request.url);

    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then(function (response) {
                return response || fetch(request);
            })
        );
    } else {
        event.respondWith(
            caches.open('blogs-cache').then(function (cache) {
                return fetch(request).then(function (liveResponse) {
                    cache.put(request, liveResponse.clone());
                    return liveResponse;
                });
            }).catch(function () {
                return caches.match(request).then(function (response) {
                    if(response) return response;
                    return caches.match('/follback.json');
                });
            })
        );
    }
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName != CACHE_NAME
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

