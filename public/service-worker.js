const CACHE_NAME = "uniride-cache-v1";
const urlsToCache = [
  "/",
  "/style.css",
  "/login/script.js",
  "/register/script.js",
  "/index/script.js",
  "/logo.webp",
  "/uniRide.webp",
  "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  "/map_moblie.webp",
  "/eye-svgrepo-com.svg",
  "/eye-password-hide-svgrepo-com.svg",
  "/circle-dashed-svgrepo-com.svg",
  "/map_desktop.webp",
  "/Microsoft_logo.webp",
  "/car.webp",
  "/bike.webp",
  "/home/history.webp",
  "/home/motorcycle.webp",
  "/home/plus.webp",
  "/home/search.webp"
];

// Precache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

// Fetch: return cached or fetch & cache dynamically
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (
          event.request.url.startsWith(self.location.origin) &&
          event.request.method === "GET"
        ) {
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(event.request, response.clone())
          );
        }
        return response;
      });
    })
  );
});
