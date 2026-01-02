// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Sandile's",
        short_name: "Sandile's Swiper",
        description: "A React PWA for personal media cards",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/1.png",
            sizes: "636x1438",
            type: "image/png",
            label: "Home screen view",
          },
          {
            src: "/screenshots/2.png",
            sizes: "670x1438",
            type: "image/png",
            label: "Media card view",
          },
          {
            src: "/screenshots/3.png",
            sizes: "674x1466",
            type: "image/png",
            label: "Media card view",
          },
        ],
      },
    }),
  ],
  base: '/',
  optimizeDeps: {
    include: ["prop-types"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "prop-types": "prop-types/index.js",
    },
  },
})
