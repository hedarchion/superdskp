import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/superdskp/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          'icons': ['lucide-react'],
        },
        // Optimize chunk file naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          if (/\.(css)$/i.test(info)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
  },
  // Optimize dev server
  server: {
    open: true,
    cors: true,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
  },
})
