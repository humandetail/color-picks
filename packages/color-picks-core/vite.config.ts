import { defineConfig, configDefaults } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    environment: 'happy-dom',
    coverage: {
      provider: 'c8'
    }
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ColorPicks',
      fileName: 'color-picks',
      formats: ['es', 'iife']
    }
  },
  plugins: [
    dts()
  ]
})
