const STATIC_ASSETS = ["/", "/index.html"];
const CACHE_NAME = "questionnaire-cache-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((url) =>
          fetch(url, { cache: "reload" })
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch((err) => console.warn(`Échec du cache pour ${url}:`, err)),
        ),
      );
    }),
  );
});

// Activation : Nettoyage des vieux caches
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

// Stratégie de Fetch
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 1. Pages HTML : Réseau d'abord, puis Cache (pour avoir tjs la version fraîche)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request) || caches.match("/index.html")),
    );
    return;
  }

  // 2. Assets (JS, CSS, Images) : Cache d'abord, puis Réseau
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // On ne cache que les requêtes valides (pas les extensions chrome, etc)
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
