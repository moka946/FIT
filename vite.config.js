import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Use root base locally to avoid blank page issues in dev.
  // Keep /FIT/ for GitHub Pages production deploys.
  base: mode === 'production' ? '/FIT/' : '/',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  }
}));
