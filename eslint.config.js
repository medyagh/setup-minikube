import { ESLint } from 'eslint';

export default new ESLint({
  baseConfig: {
    // Add your existing .eslintrc configuration here
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      "comma-dangle": ["error", {
        "arrays": "only-multiline",
        "objects": "only-multiline",
        "imports": "only-multiline",
        "exports": "only-multiline",
        "functions": "never"
      }],
      "indent": ["error", 2, {
        "SwitchCase": 1
      }],
      "require-jsdoc" : 0,
      "semi": 0
    },
  },
  ignorePatterns: ['node_modules/*','dist/*', 'lib/*'],
});
