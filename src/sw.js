const CACHE_NAME = "battleship-v2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./main.js",
  "./manifest.json",
  "./favicon/favicon.ico",
  "./favicon/favicon-16x16.png",
  "./favicon/favicon-32x32.png",
  "./favicon/apple-touch-icon.png",
  "./favicon/android-chrome-192x192.png",
  "./favicon/android-chrome-512x512.png",
  "./background.webp",
  "./ship.webp",
  "./battleship.webp",
  "./carrier.webp",
  "./cruiser.webp",
  "./destroyer.webp",
  "./submarine.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((response) => {
          if (!response || (response.status !== 200 && response.type !== "opaque")) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return Response.error();
        });
    })
  );
});
