import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Serve assets from the root so the site works at a custom domain (CNAME)
  base: '/',
  plugins: [react()],
})
