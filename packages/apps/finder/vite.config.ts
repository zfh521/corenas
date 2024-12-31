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
      '@corenas/core': path.resolve(__dirname, '../../core/src'),
      '@corenas/services': path.resolve(__dirname, '../../services/src'),
      '@corenas/app-framework/base/BaseApp': path.resolve(__dirname, '../../app-framework/src/base/BaseApp'),
      '@corenas/app-framework/base/BaseCore': path.resolve(__dirname, '../../app-framework/src/base/BaseCore')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FinderApp',
      formats: ['es'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        '@corenas/core',
        '@corenas/services',
        '@corenas/app-framework'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@corenas/core': 'CorenasCore',
          '@corenas/services': 'CorenasServices',
          '@corenas/app-framework': 'CorenasAppFramework'
        }
      }
    }
  }
}) 