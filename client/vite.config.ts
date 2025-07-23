import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  // ensure that the vite is run on 5173
  // if port is user throw error
  server: {
    port: 5173,
    strictPort: true,
  },
})
