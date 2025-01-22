// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import rules from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // This disables the rule completely
  }
);