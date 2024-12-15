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
      '@corenas/app-framework': path.resolve(__dirname, '../../app-framework/src')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'CalculatorApp',
      formats: ['es'],
      fileName: (format) => `calculator.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@corenas/core', '@corenas/services', '@corenas/app-framework'],
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