/* ONG Marhaba · service worker (application installable et consultation hors ligne) */
const VERSION = "marhaba-v1";
const SHELL = [
  "./", "index.html", "manifest.webmanifest",
  "assets/css/style.css", "assets/js/main.js",
  "assets/img/logo-160.png", "assets/img/logo-160.webp", "assets/img/icon-192.png",
  "data/chiffres.json", "data/galerie.json", "data/actualites.json", "data/partenaires.json", "data/contact.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.includes("/admin/")) return; // l'espace admin n'est jamais mis en cache

  const fresh = req.mode === "navigate" || url.pathname.endsWith(".json") ||
    url.pathname.endsWith(".js") || url.pathname.endsWith(".css") || url.pathname.endsWith(".html");

  if (fresh) {
    // Réseau d'abord : les modifications faites dans l'admin apparaissent tout de suite
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match("index.html")))
    );
  } else {
    // Images, PDF : cache d'abord, mise à jour en arrière-plan
    e.respondWith(
      caches.match(req).then((cached) => {
        const net = fetch(req).then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        }).catch(() => cached);
        return cached || net;
      })
    );
  }
});
