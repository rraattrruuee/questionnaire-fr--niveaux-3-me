const CACHE_NAME = "questionnaire-cache-v3";

const STATIC_ASSETS = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Precache static assets first
      try {
        await cache.addAll(STATIC_ASSETS);
      } catch (e) {
        console.warn("SW precache static assets failed", e);
      }

      await Promise.all(
        STATIC_ASSETS.map(async (path) => {
          try {
            const r = await fetch(path, { cache: "no-store" });
            if (r.ok) await cache.put(path, r.clone());
          } catch (err) {
            // ignore per-item errors to avoid failing install entirely
            console.warn("SW failed to cache", path, err);
          }
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Navigation requests -> Network first, fallback to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Put a copy in cache
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("/offline.html")),
    );
    return;
  }

  // Other requests -> Cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200 || response.type !== "basic")
            return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Optional: return an image placeholder for images when offline
          if (request.destination === "image") {
            return new Response("", { status: 503, statusText: "Offline" });
          }
          return caches.match("/offline.html");
        });
    }),
  );
});
