import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://swiper-backend-production.up.railway.app:8080', // backend port
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/nothing/, '') // Strip '/api' prefix
      }
    }
  }
})