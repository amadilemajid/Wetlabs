/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'WETLABS Field Reporter',
        short_name: 'WETLABS',
        description: 'SMS-Based Wetland Monitoring',
        theme_color: '#0D3B2E',
        background_color: '#0A1628',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@':                     path.resolve(__dirname, 'src'),
      '@api':                  path.resolve(__dirname, 'src/api'),
      '@components':           path.resolve(__dirname, 'src/components'),
      '@features':             path.resolve(__dirname, 'src/features'),
      '@hooks':                path.resolve(__dirname, 'src/hooks'),
      '@stores':               path.resolve(__dirname, 'src/stores'),
      '@types':                path.resolve(__dirname, 'src/types'),
      '@utils':                path.resolve(__dirname, 'src/utils'),
      '@assets':               path.resolve(__dirname, 'src/assets'),
      '@pages':                 path.resolve(__dirname, 'src/pages'),
      '@wetlabs/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3100', changeOrigin: true },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e/**/*'],
  },
});
