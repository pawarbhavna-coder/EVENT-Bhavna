import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // You need to import 'path'

export default defineConfig({
  plugins: [react()],
  // This section creates the '@' alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 5000,
    },
    allowedHosts: true,
  },
})
