import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Generate gzipped bundles (significantly reduces file size)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files larger than 10kb
    }),
    // Brotli compression (more efficient than gzip but less supported)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
    // Generate bundle size visualization in stats.html (for analysis)
    visualizer({
      filename: 'stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    // Generate sourcemaps for production build
    sourcemap: false, // Set to true when debugging production build issues
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.* calls
        drop_debugger: true, // Remove debugger statements
      },
    },
    
    // Optimize dependencies and improve HMR performance
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-core': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          'vue-icons': ['@heroicons/vue/24/solid', '@heroicons/vue/24/outline'],
          'vue-core-libs': ['@vueuse/core'],
        },
      },
    },
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000, // Increased to avoid unnecessary warnings
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Asset inlining size limit
    assetsInlineLimit: 4096, // 4kb
  },
  // Add CSS optimization
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: ['default', { discardComments: { removeAll: true } }],
        }),
      ],
    },
    preprocessorOptions: {
      // Add global SCSS variables/mixins if needed
    },
  },
  // Enable Vue's runtime compiler for enhanced performance
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@heroicons/vue/24/solid',
      '@heroicons/vue/24/outline',
      '@vueuse/core',
    ],
    exclude: [],
  },
  // JSON optimization
  json: {
    stringify: true, // Convert json to export values for smaller bundles
  },
})
