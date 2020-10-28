const CACHE_NAME = "submissionpwa2"
var urlToCache = [
    "/",
    "/navigation.html",
    "/index.html",
    "/teamDetail.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/api.js",
    "/manifest.json",
    "/dom.js",
    "/assets/icon.png",
    "/assets/icon-192x192.png",
    "/assets/icon-256x256.png",
    "/assets/icon-384x384.png",
    "/assets/icon-512x512.png",
    "/pages/klasemen.html",
    "/pages/pertandingan.html",
    "/pages/saved.html",
]

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlToCache)
        })
    )
})

self.addEventListener("fetch", function (event) {
    const BASEURL = "https://api.football-data.org/v2";
    if (event.request.url.indexOf(BASEURL) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    return fetch(event.request)
                        .then(function (response) {
                            cache.put(event.request.url, response.clone())
                            return response;
                        })
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request, {ignoreSearch : true})
                .then(function (response) {
                    return response || fetch(event.request);
                })
        )
    }
})

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("SW: Cache ", cacheName, " dihapus");
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})
