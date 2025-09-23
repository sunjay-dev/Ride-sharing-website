const CACHE_NAME = "uniride-cache-v1.2";
const FONT_CACHE = "uniride-fonts-v1.2";

const PRECACHE_URLS = [
  "/style.css",
  "/login/script.js",
  "/register/script.js",
  "/index/script.js",
  "/logo.webp",
  "/uniRide.webp",
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
  "/home/search.webp",
  "/offline.html",
];

// Install: Precache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (err) {
        console.warn("Some precache resources failed:", err);
      }
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== FONT_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener("fetch", (event) => {

  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/socket.io/")) {
    event.respondWith(fetch(event.request));
    return; 
  }

  if (event.request.method !== "GET") return;

  // Navigation (HTML pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // Fonts (cache separately)
  if (
    event.request.url.includes("fonts.googleapis.com") ||
    event.request.url.includes("fonts.gstatic.com")
  ) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const network = fetch(event.request)
          .then((response) => {
            if (response && response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Static assets (stale-while-revalidate)
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
