import readableSpacing from './eslint-rules/readableSpacing.js';

import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'public/**', '*.tsbuildinfo'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: {
      'react-hooks': reactHooks,
      local: { rules: { 'readable-spacing': readableSpacing } },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      eqeqeq: ['error', 'always'],
      'local/readable-spacing': 'error',
    },
  },
  {
    files: ['*.{js,ts}', 'eslint-rules/**/*.js'],
    languageOptions: { globals: globals.node },
  },
  prettier,
);
