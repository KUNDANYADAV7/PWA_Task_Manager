import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // devOptions: {
      //   enabled: true,
      //   type: 'module',
      // },
      manifest: {
        name: 'Task Manager PWA',
        short_name: 'Tasks',
        theme_color: '#ffffff',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      // workbox: {
      //   runtimeCaching: [
      //     {
      //       // Cache GET requests to your API for offline reading
      //       urlPattern: /^http:\/\/localhost:5000\/api\/tasks/,
      //       handler: 'NetworkFirst',
      //       options: {
      //         cacheName: 'api-cache',
      //         expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }, // 1 day
      //         backgroundSync: {
      //           name: 'offline-mutations-queue',
      //           options: { maxRetentionTime: 24 * 60 } // Retry failed POSTs for up to 24 hours
      //         }
      //       }
      //     }
      //   ]
      // }
workbox: {
        runtimeCaching: [
          // 1. Handle GET requests (Reading data)
          {
            // Use a function to check the path, ignoring the domain/port!
            urlPattern: ({ url }) => url.pathname.startsWith('/api/tasks'),
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
            }
          },
          // 2. Handle POST requests (Adding data offline)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/tasks'),
            handler: 'NetworkOnly',
            method: 'POST',
            options: {
              backgroundSync: {
                name: 'offline-add-queue',
                options: { maxRetentionTime: 24 * 60 } // Keep for 24 hours
              }
            }
          },
          // 3. Handle PUT requests (Updating data offline)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/tasks'),
            handler: 'NetworkOnly',
            method: 'PUT',
            options: {
              backgroundSync: { name: 'offline-update-queue' }
            }
          },
          // 4. Handle DELETE requests (Deleting data offline)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/tasks'),
            handler: 'NetworkOnly',
            method: 'DELETE',
            options: {
              backgroundSync: { name: 'offline-delete-queue' }
            }
          }
        ]
      }
    })
  ]
});