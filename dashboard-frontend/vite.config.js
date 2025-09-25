import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react()
    ],
   css: {
    postcss: './postcss.config.js',
  },
  server: {
      port: 5173,
      open: true,
  },
   build: {
     outDir: 'dist',
     sourcemap: true,
   }
})

// Create postcss.config.js in the root if it doesn't exist:
/* postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
*/