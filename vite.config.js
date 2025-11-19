import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './',
  build: {
    outDir: 'dist/ui',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
  },
})
