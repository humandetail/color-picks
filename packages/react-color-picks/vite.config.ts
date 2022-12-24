import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: './src/main.tsx',
      name: 'ReactColorPicks',
      fileName: 'react-color-picks',
      formats: ['es', 'iife']
    },
    rollupOptions: {
      external: ['react']
    }
  }
})
