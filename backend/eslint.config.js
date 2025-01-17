import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier'; // Import prettier plugin

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      prettier: pluginPrettier, // Define the prettier plugin as an object
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      eqeqeq: 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': 'error', // Ensure Prettier formatting is checked
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-namespace': 'off', // Disable the namespace rule
    },
  },
  {
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
    },
  },
];
