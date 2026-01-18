import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'BYEONGUK Portfolio',
        short_name: 'BYEONGUK',
        description: 'Portfolio website of BYEONGUK, a localization specialist and gamer',
        theme_color: '#60a5fa',
        background_color: '#2a2a2a',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'components': [
            './src/components/ThemeToggle',
            './src/components/LanguageToggle',
            './src/components/ShareButton',
            './src/components/ImageGallery'
          ]
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})

