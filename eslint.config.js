import { tanstackConfig } from '@tanstack/eslint-config'

import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
// https://orm.drizzle.team/docs/eslint-plugin?utm_source=copilot.com
import drizzlePlugin from 'eslint-plugin-drizzle'
import queryPlugin from '@tanstack/eslint-plugin-query'
import pluginPromise from 'eslint-plugin-promise'

// Currently, I'm not sure I need to bring in globals.
// import globals from 'globals'
import testingLibrary from 'eslint-plugin-testing-library'
import jestDom from 'eslint-plugin-jest-dom'
//# import jsxA11y from 'eslint-plugin-jsx-a11y'
import vitest from '@vitest/eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://tanstack.com/config/latest/docs/eslint
//
// ⚠️ Gotcha: @tanstack/eslint-config is framework-agnostic and doesn't include
// React-specific plugins, even though TanStack Start uses React. This is intentional
// so the config works across different TanStack projects.
//
// Also, I've currently omitted implementing: eslint-plugin-jsx-a11y
//
///////////////////////////////////////////////////////////////////////////

export default [
  {
    ignores: ['eslint.config.js', 'src/generated']
  },
  ...tanstackConfig,
  {
    plugins: {
      '@tanstack/query': queryPlugin,
      drizzle: drizzlePlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      vitest: vitest, // ✅
      'jest-dom': jestDom, // ✅
      'testing-library': testingLibrary
      //# 'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect' // Automatically detects React version from package.json
      }
    },
    rules: {
      ...drizzlePlugin.configs.recommended.rules,
      ...queryPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      // React Hooks plugin rules (includes exhaustive-deps)
      ...reactHooksPlugin.configs.recommended.rules,
      ...vitest.configs.recommended.rules,
      // Test working: expect(button).toBeTruthy()
      ...jestDom.configs.recommended.rules,
      // Test working:
      // const button = container.querySelector('button')
      // screen.debug()
      ...testingLibrary.configs['flat/react'].rules
    }
  },
  pluginPromise.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    rules: {
      /* ======================
      eslint-plugin-prettier
    ====================== */

      'prettier/prettier': 'warn', // For eslint-plugin-prettier - downgrade to "warn"
      'arrow-body-style': 'off', // eslint-plugin-prettier recommendation
      'prefer-arrow-callback': 'off', // eslint-plugin-prettier recommendation

      /* ======================
    Tanstack Start Overwrites
    ====================== */
      ///////////////////////////////////////////////////////////////////////////
      //
      // @tanstack/eslint-config comes with:
      // @eslint/js, @stylistic/eslint-plugin, eslint-plugin-import-x,
      // eslint-plugin-n, globals, typescript-eslint, vue-eslint-parser
      //
      ///////////////////////////////////////////////////////////////////////////

      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      'import/consistent-type-specifier-style': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
      'import/order': 'warn',
      'import/first': 'warn',

      'no-shadow': 'off',

      'sort-imports': 'warn',

      // If you look in node_modules/@tanstack/eslint-config/dist/stylistic.js,
      // This is actually the only rule from that library that is set.
      // See here for others: https://eslint.style/rules
      '@stylistic/spaced-comment': 'off',

      /* ======================
        My General Rules
    ====================== */

      ///////////////////////////////////////////////////////////////////////////
      //
      //   const data = { name: 'Fred',  age: 35,}
      //
      //   for (const key in data) {
      //     if (Object.prototype.hasOwnProperty.call(data, key)) {
      //       console.log(`${key}: ${data[key as keyof typeof data]}`)
      //     }
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////
      'guard-for-in': 'warn', // Off by default in Next.js

      // Would require an await inside the body of an async function: export const func = async () => null
      // Off by default in Next.js
      'require-await': 'off',

      'no-var': 'warn', // Warns user to implement let or const instead.
      'prefer-const': 'warn',
      'no-eq-null': 'warn', // Warns user to implement strict equality.
      'no-prototype-builtins': 'off',
      'no-throw-literal': 'warn', // Warns user to use an Error object
      'no-unreachable': 'warn', // Warns user when code is unreachable due to return, throw, etc.

      // By default, all types of anonymous default exports are forbidden, but any types can be selectively
      // allowed by toggling them on in the options. Ensuring that default exports are named helps improve
      // the grepability of the codebase by encouraging the re-use of the same identifier for the module's
      // default export at its declaration site and at its import sites.
      // We could set this to "off", but for now "warn"
      'import/no-anonymous-default-export': 'warn',

      '@typescript-eslint/ban-ts-comment': 'off', // Allows @ts-ignore statement
      '@typescript-eslint/no-non-null-assertion': 'off', // Allows ! bang operator - already "off" in Next.js by defualt.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off', // Allows type Props = {}
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Ignore unused arguments that start with _
          varsIgnorePattern: '^_', // Ignore unused variables that start with _
          caughtErrorsIgnorePattern: '^_', // Ignore caught errors that start with _
          destructuredArrayIgnorePattern: '^_' // Ignore destructured array elements that start with _
        }
      ],

      /* ======================
            react
    ====================== */

      'react/react-in-jsx-scope': 'off', // Not needed for React 17+

      'react/no-children-prop': 'off',

      // Modern JSX parsers (React 17+) handle these characters correctly.
      // It’s overly strict and forces HTML entities like &apos; instead of '.
      // Many teams disable it because it adds friction without real benefit.
      'react/no-unescaped-entities': 'off', // Allow apostrophies in text...

      //! I turned this off temporarily, but you should turn it back on.
      // This was introduced in React 19.1
      // It enforces component purity by flagging impure functions like Date.now(), Math.random(),
      // and crypto.randomUUID() during render.
      'react-hooks/purity': 'off',

      //^ I'm not sure how I fee about this rule. It often tries to prevent you
      //^ from calling setState in a useEffect, but sometimes there's not other solution.
      'react-hooks/set-state-in-effect': 'warn',

      //! I turned this off temporarily, but you should turn it back on.
      'react-hooks/immutability': 'off',

      /* ======================
      eslint-plugin-react-compiler
      ====================== */

      //# Eventually add eslint-plugin-react-compiler
      //# "react-compiler/react-compiler": "warn",

      /* ======================
      eslint-plugin-promise
      ====================== */

      'promise/always-return': 'warn',
      'promise/no-return-wrap': 'warn',
      'promise/param-names': 'warn',
      'promise/catch-or-return': ['warn', { allowFinally: true }],
      'promise/no-native': 'off',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/avoid-new': 'off',
      'promise/no-new-statics': 'warn',
      'promise/no-return-in-finally': 'warn',
      'promise/valid-params': 'warn',
      'promise/no-multiple-resolved': 'warn',

      /* ======================
      eslint-plugin-drizzle
     ====================== */

      'drizzle/enforce-delete-with-where': 'warn',
      'drizzle/enforce-update-with-where': 'warn',

      /* ======================
              Vitest
      ====================== */

      'vitest/expect-expect': 'warn',

      /* ======================
          Testing Library
      ====================== */

      'testing-library/no-debugging-utils': 'off'
    }
  },
  ...storybook.configs['flat/recommended']
]
