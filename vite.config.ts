import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  // GitHub Pages de projeto serve em usuario.github.io/nome-do-repo/, não na raiz.
  // O workflow do GitHub Actions define VITE_BASE_PATH com o nome real do repositório;
  // localmente (e em Vercel/Netlify, que servem na raiz) cai no padrão "/".
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separa bibliotecas de terceiros do código da aplicação para melhor cache
        // entre deploys (vendor chunks mudam com muito menos frequência).
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) {
              return 'vendor-charts';
            }
            if (id.includes('react-router-dom') || id.includes('/react/') || id.includes('/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('@tanstack') || id.includes('zustand')) return 'vendor-data';
            if (id.includes('lucide-react')) return 'vendor-icons';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
