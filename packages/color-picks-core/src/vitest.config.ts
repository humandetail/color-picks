import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    include: ['/test/*.test.ts'],
    environment: 'happy-dom',
    coverage: {
      provider: 'c8'
    }
  }
})
