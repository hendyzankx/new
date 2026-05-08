const CACHE_NAME = "kasir-pro-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Courier+Prime:wght@400;700&display=swap",
  "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch dengan strategi Cache First, lalu Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }),
  );
});

// Update cache
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Background sync untuk offline transactions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-transactions") {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  // Logic untuk sync transaksi offline ke server (jika ada)
  console.log("Syncing transactions...");
}
