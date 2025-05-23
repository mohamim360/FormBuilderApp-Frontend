import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      '/api/odoo': {
        target: 'https://formbuilder1.odoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/odoo/, '/api')
      }
    }
  }
})
