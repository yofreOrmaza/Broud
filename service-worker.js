const CACHE_NAME = "OFF-2R-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/script.js",
  "/data/img/iconsAPP/Android/OFF2RFAVICON-192x192.jpg",
  "/data/img/iconsAPP/Android&Browser/OFF2RFAVICON-512x512.jpg",
  "/data/img/iconsAPP/iOS/OFF2RFAVICON-180x180.jpg"
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