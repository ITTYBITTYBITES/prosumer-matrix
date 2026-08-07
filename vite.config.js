// ============================================================================
// Vite Configuration - Production-optimized with cache-busting
// ============================================================================

import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Copy service worker to dist folder
    copyPublicDir: true,
    // Enable asset hashing for cache-busting
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Generate hashed filenames for all assets
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Minify for production
    minify: 'default',
    // Sourcemaps for debugging (disable in production if needed)
    sourcemap: false
  },
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
