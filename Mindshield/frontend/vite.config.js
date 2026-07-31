import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    hmr: {
      host: '127.0.0.1',
      port: 5173,
      clientPort: 5173,
    },
  },
})
