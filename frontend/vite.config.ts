import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@': fileURLToPath(new URL('./src/components', import.meta.url)),
      '%': fileURLToPath(new URL('./src/views', import.meta.url)),
      '~': fileURLToPath(new URL('./node_modules/', import.meta.url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 80,
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/_variables.sass"
          @import "@/assets/styles/_mixins.sass"
        `
      }
    }
  }
})
