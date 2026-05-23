import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || (command === 'build' ? '/portfolio-v2/' : '/'),
  server: {
    allowedHosts: ['joshuaopria.dev'],
    proxy: {
      '/api/chat': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
        rewrite: () => '/',
      },
    },
  },
}))
