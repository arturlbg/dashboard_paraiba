import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react()
      // Tailwind CSS is now configured via postcss.config.js and imported in main.tsx/index.css
      // Remove tailwindcss() from here if using postcss config
    ],
   // Optional: Configure CSS options if needed (e.g., PostCSS plugins)
   css: {
    postcss: './postcss.config.js', // Point to PostCSS config if using Tailwind v3+ standard setup
  },
  // Optional: Define aliases for cleaner imports
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //     '@components': path.resolve(__dirname, './src/components'),
  //     '@features': path.resolve(__dirname, './src/features'),
  //     // Add other aliases as needed
  //   },
  // },
  server: {
      port: 5173, // Keep default or change if needed
      open: true, // Automatically open in browser
  },
   build: {
     outDir: 'dist', // Ensure output directory is 'dist'
     sourcemap: true, // Generate source maps for production build
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

// Create tailwind.config.js (as provided in the refactored files section)
