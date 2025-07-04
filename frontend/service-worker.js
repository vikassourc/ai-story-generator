const CACHE_NAME = 'ai-story-generator-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './App.js',
  './manifest.json'
  // Removed external CDN URLs from here as they cannot be cached directly by the service worker
  // 'https://cdn.tailwindcss.com',
  // 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
  // 'https://unpkg.com/react@18/umd/react.production.min.js',
  // 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  // 'https://unpkg.com/@babel/standalone/babel.min.js'
  // Add your icon URLs here if you replace the placeholders
  // 'icons/icon-192x192.png',
  // 'icons/icon-512x512.png'
];

// Install event: caches all the necessary assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // Only cache local assets
      })
      .catch(error => {
        console.error('Failed to open cache or add URLs during install:', error);
      })
  );
});

// Fetch event: serves cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // For network requests, clone the request as it's a stream
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).catch(() => {
            // If network fails, try to return a fallback for navigation requests
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html'); // Fallback to index.html for offline navigation
            }
        });
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
