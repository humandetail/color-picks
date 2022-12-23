import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: './src/VueColorPicks.vue',
      name: '[name]',
      formats: ['cjs', 'es']
    },
    rollupOptions: {
      external: ['vue']
    }
  }
})
