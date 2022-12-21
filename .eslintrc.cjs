module.exports = {
  root: true,

  extends: [
    '@vue/eslint-config-standard-with-typescript',
    'plugin:vue/vue3-essential'
  ],

  ignorePatterns: [
    'index.html',
    'node_modules',
    'dist',
    'vite.config.ts',
    '*.cjs'
  ],

  rules: {
    'vue/multi-word-component-names': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    '@typescript-eslint/consistent-type-assertions': 0,
    '@typescript-eslint/strict-boolean-expressions': 0
  }
}
