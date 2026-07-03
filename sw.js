/* Bump CACHE (e.g. forge-v2) whenever you change icons or the manifest. */
const CACHE = 'forge-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  // App shell: network-first so a fresh deploy shows up, offline falls back to cache.
  if(req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('.html'))){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone(); caches.open(CACHE).then(function(c){ c.put('./index.html', copy); });
        return res;
      }).catch(function(){ return caches.match('./index.html').then(function(r){ return r || caches.match('./'); }); })
    );
    return;
  }
  // Same-origin static: cache-first.
  if(url.origin === location.origin){
    e.respondWith(caches.match(req).then(function(r){
      return r || fetch(req).then(function(res){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); return res; });
    }));
    return;
  }
  // Cross-origin (e.g. Google Fonts): cache-first, network fallback.
  e.respondWith(caches.match(req).then(function(r){
    return r || fetch(req).then(function(res){ try{ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }catch(_){ } return res; }).catch(function(){ return r; });
  }));
});
