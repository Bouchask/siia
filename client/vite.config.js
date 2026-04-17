import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import JavaScriptObfuscator from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Advanced Obfuscation for production security
    JavaScriptObfuscator({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArrayEncoding: ['rc4'],
      splitStrings: true,
      unicodeEscapeSequence: true,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: 4000,
      disableConsoleOutput: true,
      selfDefending: true,
      splitStrings: true,
      stringArray: true,
      stringArrayThreshold: 0.75,
      transformObjectKeys: true
    })
  ],
  optimizeDeps: {
    include: ['quill']
  },
  build: {
    // Disable source maps to protect source code
    sourcemap: false,
    // Maximize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Obfuscate chunk names
        chunkFileNames: 'assets/js/[hash].js',
        entryFileNames: 'assets/js/[hash].js',
        assetFileNames: 'assets/[ext]/[hash].[ext]',
        // Advanced Code Splitting
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tiptap') || id.includes('prosemirror')) {
              return 'vendor-editor';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('lucide')) {
              return 'vendor-icons';
            }
            return 'vendor-others';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
