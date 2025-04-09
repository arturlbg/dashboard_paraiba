import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    // Global ignores
    ignores: ['dist', 'node_modules'],
  },
  // Base JS rules
  js.configs.recommended,
  // TypeScript rules
  ...tseslint.configs.recommended,
  {
    // Settings specific to TS/TSX files
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json', // Point to your tsconfig
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' }, // Auto-detect React version
    },
    rules: {
      // Base ESLint rules override/additions
      'no-unused-vars': 'off', // Use TypeScript version
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn', // Warn about 'any' type

      // React specific rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules, // If using new JSX transform
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Settings specific to JS/JSX files (if any remain)
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);