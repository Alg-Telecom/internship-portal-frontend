import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // `const { password: _password, ...rest } = user` is the usual way to
      // drop a field from an object — the dropped one is unused on purpose.
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    // Each context file exports its Provider together with the hook that
    // reads it (AuthProvider + useAuth...). That's the standard React
    // pattern; it only means Fast Refresh reloads these few files fully.
    files: ['src/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': [
        'error',
        { allowExportNames: ['useAuth', 'useLanguage', 'usePageTitle', 'usePageHeader', 'useToast'] },
      ],
    },
  },
])
