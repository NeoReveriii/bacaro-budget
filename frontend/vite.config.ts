import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      // Proxy /api requests to the deployed Vercel backend for local dev
      '/api': {
        target: 'https://bacaro-budget.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
