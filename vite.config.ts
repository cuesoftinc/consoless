
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  define: {
    // This allows the code to access process.env.API_KEY without crashing.
    // It will prioritize the environment variable if set during build/dev, 
    // or fall back to an empty string.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env': {}
  }
})
