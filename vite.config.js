import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script', // <--- ADD THIS LINE
      includeAssets: ['logo.png'],
      manifest: {
        name: 'Velankanni Admin',
        short_name: 'Admin',
        start_url: '/admin',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'chunk-firebase';
            if (id.includes('framer-motion')) return 'chunk-framer-motion';
            if (id.includes('react')) return 'chunk-react';
            return 'chunk-vendor';
          }
        }
      }
    }
  }
})