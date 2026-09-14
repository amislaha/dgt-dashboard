/* Geomapping service worker — offline app shell for the PWA.
   Prototype-grade: cache-first for CDN libs + map tiles, stale-while-revalidate
   for our own files so a reload always picks up new deploys. Bump CACHE to force
   a clean refresh. Anything that fails here must not break the page. */
"use strict";

var CACHE = "geomapping-v1";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/logo-emblem.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (u) {
        return c.add(new Request(u, { mode: "no-cors" })).catch(function () {});
      }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isTile(url) {
  return /tile\.openstreetmap\.org|tile\.opentopomap\.org|basemaps\.cartocdn\.com|server\.arcgisonline\.com|tile\.stadiamaps\.com/.test(url);
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // Never cache API-style calls (geocode / routing) — let them hit the network and fail gracefully.
  if (/nominatim\.openstreetmap\.org|router\.project-osrm\.org/.test(url.href)) return;

  // Map tiles + CDN libs/fonts: cache-first, then network, then whatever we have.
  if (isTile(url.href) || url.origin === "https://unpkg.com" || url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
          return res;
        }).catch(function () { return hit; });
      })
    );
    return;
  }

  // Same-origin (our own files): stale-while-revalidate.
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(function (c) {
        return c.match(req).then(function (hit) {
          var net = fetch(req).then(function (res) {
            if (res && res.status === 200) c.put(req, res.clone());
            return res;
          }).catch(function () { return null; });
          return hit || net || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // Navigations while offline -> app shell.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(function () { return caches.match("./index.html"); }));
  }
});
