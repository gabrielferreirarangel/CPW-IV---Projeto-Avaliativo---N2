// nome do cache e arquivos que ficam salvos offline

const CACHE_NAME = 'certirecupera-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/styles/global.scss',
  '/src/styles/_variables.scss',
  '/src/styles/_mixins.scss'
];

// add arquivos principais no cache quando instala

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell and core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// rmv caches antigos quando uma nova versao entra

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// tenta buscar da internet primeiro

self.addEventListener('fetch', (event) => {

  // ignora requisicoes externas

  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {

        // atualiza o cache com a resposta mais recente

        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {

        // se der erro tenta servir algo do cache

        console.log('[Service Worker] Fetch failed, serving from cache:', event.request.url);

        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // fallback para navegacao offline

          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // resposta padrao quando nao acha nada

          return new Response('Recurso não disponível offline.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
          });
        });
      })
  );
});