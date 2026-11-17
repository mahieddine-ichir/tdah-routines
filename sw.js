/* Service worker : l'appli fonctionne hors ligne.
   Stratégie « stale-while-revalidate » : on répond tout de suite depuis le cache,
   puis on met le cache à jour en arrière-plan (la nouvelle version s'affiche au lancement suivant).
   Changer VERSION force le rechargement complet des fichiers. */
var VERSION = "v1";
var CACHE = "routines-" + VERSION;
var FILES = [
  "./", "index.html", "routine.html", "fiche.html", "reglages.html", "common.js",
  "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png",
  "icons/apple-touch-icon.png", "icons/favicon-32.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("routines-") === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") { return; }
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) { return; }

  e.respondWith(caches.open(CACHE).then(function (cache) {
    /* routine.html?r=soir et routine.html?r=matin partagent la même entrée de cache. */
    return cache.match(req, { ignoreSearch: sameOrigin }).then(function (cached) {
      var network = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) {
          var key = sameOrigin ? url.origin + url.pathname : req;
          cache.put(key, res.clone());
        }
        return res;
      }).catch(function () {
        if (cached) { return cached; }
        return req.mode === "navigate" ? cache.match("index.html") : Response.error();
      });
      return cached || network;
    });
  }));
});
