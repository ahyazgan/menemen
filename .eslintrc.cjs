/** ESLint yapılandırması — TypeScript + Prettier uyumlu, makul katılıkta. */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: { node: true, es2021: true },
  ignorePatterns: ['node_modules', '.test-build', '.expo', 'dist', 'package-lock.json'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // Sessiz yedek (catch) bloklarına izin ver — bilinçli kullanım.
    'no-empty': ['error', { allowEmptyCatch: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
