import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const MENU_API = 'https://round-voice-068e.dannymariano869.workers.dev'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/menu': {
        target: MENU_API,
        changeOrigin: true,
        secure: true,
        rewrite: () => '/',
      },
    },
  },
})
