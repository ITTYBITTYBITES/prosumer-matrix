// ============================================================================
// Prosumer Matrix Service Worker
// ============================================================================
// Handles caching and offline support for the prosumer-matrix site
// This service worker has scope /prosumer-matrix/ and takes precedence
// over the root site's service worker for this subdirectory.
// ============================================================================

// Bump these names when the application shell changes so an existing client
// cannot remain pinned to an HTML file that references removed hashed assets.
const STATIC_CACHE = 'prosumer-matrix-static-v2';
const DYNAMIC_CACHE = 'prosumer-matrix-dynamic-v2';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/prosumer-matrix/',
  '/prosumer-matrix/index.html',
  '/prosumer-matrix/favicon.svg',
  '/prosumer-matrix/404.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ProsumerMatrix SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ProsumerMatrix SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ProsumerMatrix SW] Install complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ProsumerMatrix SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log(`[ProsumerMatrix SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    })
    .then(() => {
      console.log('[ProsumerMatrix SW] Activate complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle requests for this site
  if (!url.origin.includes('ittybittybites.github.io')) {
    return;
  }
  
  // Skip API calls, external resources, etc.
  if (url.pathname.startsWith('/api/') ||
      url.hostname !== 'ittybittybites.github.io') {
    return;
  }
  
  // For prosumer-matrix paths, use network-first strategy
  // This ensures we always get fresh content from GitHub Pages
  if (url.pathname.startsWith('/prosumer-matrix/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // A document is not a valid fallback for a failed JS/CSS/image
          // request. Returning index.html for an asset makes the browser try
          // to parse HTML as a module and leaves the initial loader visible.
          // Only navigation requests may use the cached application shell.
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            if (request.mode === 'navigate') {
              return caches.match('/prosumer-matrix/').then((appShell) => {
                return appShell || new Response('Offline', {
                  status: 503,
                  statusText: 'Offline'
                });
              });
            }

            return new Response('Offline', {
              status: 503,
              statusText: 'Offline'
            });
          });
        })
    );
    return;
  }
  
  // For root site paths, use cache-first strategy with network update
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version while fetching fresh version in background
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        
        // No cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Message handler for cache clearing
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEAR') {
    console.log('[ProsumerMatrix SW] Clearing caches...');
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          console.log(`[ProsumerMatrix SW] Deleting: ${name}`);
          return caches.delete(name);
        })
      );
    });
  }
});
