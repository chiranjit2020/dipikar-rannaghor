import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Repo name — used as the base path for GitHub Pages project sites.
const REPO = 'dipikar-rannaghor';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${REPO}/` : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Dipikar Rannghor',
        short_name: 'Rannghor',
        description:
          'Hands-on Cloud Kitchen documentation, checklists and TODO tracker — Learn → Do → Verify → Document.',
        lang: 'bn',
        theme_color: '#0b0b0f',
        background_color: '#0b0b0f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: `/${REPO}/`,
        scope: `/${REPO}/`,
        categories: ['business', 'productivity', 'food'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
}));
