importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
BASEURL = "https://api.football-data.org/v2";
if (workbox) {
    console.log(`Workbox berhasil dimuat`);
    workbox.precaching.precacheAndRoute([
        "/",
        { url: '/manifest.json', revision: '1' },
        { url: '/index.html', revision: '1' },
        { url: "/assets/icon.png", revision: '1' },
        { url: "/assets/icon-192x192.png", revision: '1' },
        { url: "/assets/icon-256x256.png", revision: '1' },
        { url: "/assets/icon-384x384.png", revision: '1' },
        { url: "/assets/icon-512x512.png", revision: '1' },
        { url: "/assets/maskable_icon.png", revision: '1' },
        { url: '/teamDetail.html', revision: '1' },
        { url: '/teamDetail.js', revision: '1' },
        { url: '/navigation.html', revision: '1' },
        { url: '/dom.js', revision: '1' },
        { url: '/css/materialize.min.css', revision: '1' },
        { url: '/css/style.css', revision: '1' },
        { url: '/js/materialize.min.js', revision: '1' },
        { url: '/js/nav.js', revision: '1' },
        { url: '/js/api.js', revision: '1' },
        { url: '/js/db.js', revision: '1' },
        { url: '/js/idb.js', revision: '1' },
    ]);
    workbox.routing.registerRoute(
        new RegExp('/pages/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'pages'
        })
    );
    workbox.routing.registerRoute(
        new RegExp('/teamDetail.html'),
        workbox.strategies.networkFirst({
            cacheName: 'detail'
        })
    );
    workbox.routing.registerRoute(
        new RegExp(BASEURL),
        workbox.strategies.networkFirst({
            cacheName: 'api',
            networkTimeoutSeconds: 3,
        })
    );
    // Menyimpan cache dari CSS Google Fonts
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        })
    );

    // Menyimpan cache untuk file font selama 1 tahun
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        workbox.strategies.cacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );
}
else {
    console.log(`Workbox gagal dimuat`);
}

self.addEventListener("push", function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    var options = {
        body: body,
        icon: "assets/icon.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});