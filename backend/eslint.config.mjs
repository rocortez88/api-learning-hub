import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'src/db/seeds/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,

  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Seguridad
      'no-eval': 'error',
      'no-new-func': 'error',

      // Estilo
      'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
      'prefer-const': 'error',
    },
  },
);
