const CACHE_NAME = "Broud-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/script.js",
  "/data/img/favicon/favicon/web-app-manifest-192x192.png",
  "/data/img/favicon/favicon/web-app-manifest-512x512.png",
  "/data/img/favicon/broudFORpwa.png",
  "/data/img/favicon/broudFORpwaNightMode.png"
];

// Instalar el Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Intercepta las solicitudes y sirve desde el caché si está disponible
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});