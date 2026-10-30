import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/core/*', '@/vitrine/*', '@/modules/*'],
              message: 'shared/ ne dépend que de lui-même (ADR 0005).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/core/*',
                '!@/core/types',
                '!@/core/supabase',
                '!@/core/database.types',
                '!@/core/auth',
                '@/core/auth/*',
                '!@/core/auth/useAuth',
              ],
              message:
                'Un module n’utilise du core que types, supabase, database.types et auth/useAuth (ADR 0005).',
            },
            {
              group: ['@/vitrine/*', '@/modules/*'],
              message:
                'Un module n’importe ni la vitrine ni un autre module ; imports internes en relatif (ADR 0005).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
