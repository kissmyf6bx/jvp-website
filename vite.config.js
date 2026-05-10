import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split heavy libraries into their own chunks
            if (id.includes('firebase')) return 'chunk-firebase';
            if (id.includes('framer-motion')) return 'chunk-framer-motion';
            if (id.includes('jspdf')) return 'chunk-jspdf';
            if (id.includes('swiper')) return 'chunk-swiper';
            
            // Put React and everything else in a general vendor chunk
            if (id.includes('react')) return 'chunk-react';
            return 'chunk-vendor';
          }
        }
      }
    }
  }
})