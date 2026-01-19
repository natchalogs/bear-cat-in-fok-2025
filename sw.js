const CACHE_NAME = 'bear-cat-trip-v12';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-icon.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  // บรรทัดนี้สำคัญ: สั่งให้ใช้ Service Worker ตัวใหม่ทันที ไม่ต้องรอ
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => {
      // บรรทัดนี้สำคัญ: สั่งให้ควบคุมหน้าเว็บทันที
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});