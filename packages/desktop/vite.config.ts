import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@corenas/core': path.resolve(__dirname, '../core/src'),
      '@corenas/services': path.resolve(__dirname, '../services/src'),
      '@corenas/app-framework': path.resolve(__dirname, '../app-framework/src'),
      '@corenas/calculator': path.resolve(__dirname, '../apps/calculator/src'),
      '@corenas/notepad': path.resolve(__dirname, '../apps/notepad/src'),
      '@corenas/settings': path.resolve(__dirname, '../apps/settings/src'),
      '@corenas/finder': path.resolve(__dirname, '../apps/finder/src')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    rollupOptions: {
      external: [
        'vue',
        '@corenas/core',
        '@corenas/services',
        '@corenas/app-framework',
        '@corenas/calculator',
        '@corenas/notepad',
        '@corenas/settings',
        '@corenas/finder'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@corenas/core': 'CorenasCore',
          '@corenas/services': 'CorenasServices',
          '@corenas/app-framework': 'CorenasAppFramework',
          '@corenas/calculator': 'Calculator',
          '@corenas/notepad': 'Notepad',
          '@corenas/settings': 'Settings',
          '@corenas/finder': 'Finder'
        }
      }
    }
  }
}) 