import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PHASE 1: basic dev server config
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
