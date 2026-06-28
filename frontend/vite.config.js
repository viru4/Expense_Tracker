import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/register': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/profile': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/expenses': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/delete-account': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})

