import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'], 
      reactRefresh.configs.vite,
    ],
    settings: {
      react: { version: 'detect' },            // added react version detection
    },
    plugins: [
      'react',                                // added react plugin
      'react-hooks',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      rules: {
        //...other rules
        'no-unused-vars': 'warn', //this changes the error to a warning
        'react/prop-types': 'off', //this suppresses warnings about not using prop-types
        //other rules...
}
    },
  },
])
