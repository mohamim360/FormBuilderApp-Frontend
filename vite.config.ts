import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api/odoo': {
        target: 'https://formbuilder1.odoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/odoo/, '/api'),
      },
    },
  },
})
