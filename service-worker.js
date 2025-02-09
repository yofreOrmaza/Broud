const CACHE_NAME = "Broud-v1.13"; // Cambia este número en cada nueva versión
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

// Instalar y guardar archivos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activa la nueva versión inmediatamente
});

// Activar y eliminar caché antiguo
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Eliminando caché antiguo:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Activa la nueva versión para todas las pestañas abiertas
});

// Interceptar solicitudes y aplicar "cache-first"
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});