import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Production builds use the environment variable VITE_API_URL for API calls.
// The dev server proxy is no longer needed in production.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1', // default dev host
    port: 5173,
    // proxy removed for production; API URLs are absolute via VITE_API_URL
  },
})

