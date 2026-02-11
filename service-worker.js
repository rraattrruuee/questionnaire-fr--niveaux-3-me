const CACHE_NAME = "questionnaire-cache-v3";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/quiz_icon.svg",
  "/offline.html",
];

// Helper: check same-origin and normalize to pathname
function toPathname(href) {
  try {
    const url = new URL(href, self.location.origin);
    if (url.origin !== self.location.origin) return null;
    return url.pathname + url.search;
  } catch (e) {
    return null;
  }
}

// Extract candidate resource URLs from an HTML string
function extractUrlsFromHtml(html) {
  const urls = new Set();
  // href and src attributes
  const attrRegex = /(?:href|src)\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = attrRegex.exec(html)) !== null) {
    const path = toPathname(m[1]);
    if (!path) continue;
    // ignore fragments and mailto/tel/javascript
    if (
      path.startsWith("mailto:") ||
      path.startsWith("tel:") ||
      path.startsWith("javascript:")
    )
      continue;
    urls.add(path);
  }
  // Also look for <link rel="icon" href=...> or icons inside manifest (manifest handled separately)
  return Array.from(urls);
}

// Crawl starting from '/' and index.html, up to a reasonable limit
async function crawlAndCollect(
  startUrls = ["/", "/index.html"],
  maxPages = 100,
) {
  const toVisit = [...startUrls];
  const visited = new Set();
  const found = new Set();

  while (toVisit.length && visited.size < maxPages) {
    const u = toVisit.shift();
    if (!u || visited.has(u)) continue;
    visited.add(u);
    try {
      const res = await fetch(u, { cache: "no-store" });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("text/html")) {
        const text = await res.text();
        const urls = extractUrlsFromHtml(text);
        urls.forEach((path) => {
          // Keep html pages and assets of common types
          if (
            /\.(html?)$/i.test(path) ||
            /\.(css|js|svg|png|jpg|jpeg|webp|ico|json)$/i.test(path)
          ) {
            if (!found.has(path)) {
              found.add(path);
              if (/\.html?$/i.test(path) && !visited.has(path))
                toVisit.push(path);
            }
          }
        });
      }
    } catch (e) {
      // ignore errors while crawling one page
      console.warn("SW crawl error for", u, e);
    }
  }

  return Array.from(found);
}

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

      // Crawl site links to discover all HTML and common assets, then cache them
      try {
        const discovered = await crawlAndCollect(["/", "/index.html"], 500);
        // Merge static + discovered unique
        const toCache = Array.from(new Set([...STATIC_ASSETS, ...discovered]));
        await Promise.all(
          toCache.map(async (path) => {
            try {
              const r = await fetch(path, { cache: "no-store" });
              if (r.ok) await cache.put(path, r.clone());
            } catch (err) {
              // ignore per-item errors to avoid failing install entirely
              console.warn("SW failed to cache", path, err);
            }
          }),
        );
      } catch (e) {
        console.warn("SW crawling failed", e);
      }
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
