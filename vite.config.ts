import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+2-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+2.pem')),
    },
    host: 'localhost',
    port: 5173,

    proxy: {
      '/api': {
        target: 'https://localhost:3501',   // or your NestJS port
        changeOrigin: true,
        secure: false,                      // ← important: accept self-signed in dev proxy
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
