import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   resolve: {
    alias: {
      '@ui': path.resolve(__dirname, './src/comp/ui'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@comp': path.resolve(__dirname, './src/comp'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
