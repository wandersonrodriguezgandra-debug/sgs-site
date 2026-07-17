import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion'
          }
          if (id.includes('node_modules/three') && !id.includes('@react-three')) {
            return 'three-core'
          }
          if (id.includes('node_modules/@react-three/fiber')) {
            return 'three-fiber'
          }
          if (id.includes('node_modules/@react-three/drei')) {
            return 'three-drei'
          }
          if (id.includes('node_modules/@react-three/postprocessing')) {
            return 'three-effects'
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap'
          }
        },
      },
    },
  },
})
