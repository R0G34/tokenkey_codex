import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig, globalIgnores } from 'eslint/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores(['.next', 'node_modules']),
  {
    extends: compat.extends('next/core-web-vitals'),
    plugins: {
      'unused-imports': unusedImports,
      react,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      // Avoid hardcoded labels
      'react/jsx-no-literals': 'off',
      // Consistently import navigation APIs from `@/i18n/routing`
      'no-restricted-imports': [
        'error',
        {
          name: 'next/link',
          message: 'Please import from `@/i18n/routing` instead.',
        },
        {
          name: 'next/navigation',
          importNames: [
            'redirect',
            'permanentRedirect',
            'useRouter',
            'usePathname',
          ],
          message: 'Please import from `@/i18n/routing` instead.',
        },
      ],
    },
  },
  {
    files: [
      'src/components/ui/*',
      'src/components/extension/*',
      'src/app/\\[locale\\]/app/help/page-disabled.tsx',
      'src/app/\\[locale\\]/app/account/page-disabled.tsx',
      'src/app/\\[locale\\]/(public)/about/page-disabled.tsx',
      'src/app/\\[locale\\]/(public)/how-it-works/page-disabled.tsx',
      'src/app/\\[locale\\]/app/account/**/*',
      'src/app/\\[locale\\]/app/crypto-wallet/**/*',
      'src/app/\\[locale\\]/app/portfolio/**/*',
      'src/app/\\[locale\\]/app/projects/\\[code\\]/timeline.tsx',
      'src/app/\\[locale\\]/app/wallet/deposit/payment-card/**/*',
      'src/app/\\[locale\\]/(public)/footer.tsx',
    ],
    rules: {
      'react/jsx-no-literals': 'off',
    },
  },
])
