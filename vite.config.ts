import path from 'path' // eslint-disable-line
import { fileURLToPath } from 'node:url'
import { defineConfig /*, configDefaults */ } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
// import { nitro } from 'nitro/vite'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const isVitest = process.env.VITEST ? true : false
const config = defineConfig({
  plugins: [
    devtools(),
    // nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json']
    }),
    tailwindcss(),
    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Only run TanStack Start when NOT in a Vitest environment
    //
    // https://github.com/TanStack/router/issues/6246
    // https://github.com/TanStack/router/issues/6262
    // https://github.com/TanStack/router/pull/6074
    //
    // Invalid hook call. Hooks can only be called inside of the body of a function component.
    // This could happen for one of the following reasons:
    //
    //   - You might have mismatching versions of React and the renderer (such as React DOM)
    //   - You might have more than one copy of React in the same app
    //
    // This is a known issue within the TanStack Start ecosystem. T
    //
    //   - The error occurs because the tanstackStart Vite plugin often applies certain optimizations (like optimizeDeps) that
    //     interfere with how Vitest resolves React. This results in the test runner seeing a
    //     different instance of React than the one renderHook is trying to use, leading to the
    //     "Invalid hook call" or "reading useState of null" errors.
    //
    //   - The Root Cause Identified: The tanstackStart() plugin applies optimizeDeps configurations unconditionally.
    //     This forces a pre-bundled version of React into the test environment, causing the duplicate React instances
    //     that break hooks.
    //
    // The Solution: Conditionally Disable the Start Plugin: !isVitest ? tanstackStart() : null,
    //
    // However, there is a dilemma with this:
    //
    //   - If you keep the plugin: It injects react into Vite's optimizeDeps, which causes Vitest to load
    //     a second instance of React.  Result: Hooks break (useState is null).
    //
    //   - If you disable the plugin: The code transformations that turn createIsomorphicFn and
    //     createServerFn into actual logic never happen. Result: Isomorphic functions return undefined (noop).
    //
    // In practice, this likely implies that many page-level tests will fail.
    //
    //
    // So.. Currently, this is an ongoing issue. In the future, update Tanstack Start, and remove the
    // conditional check here to see if a fix has been applied.
    //
    ///////////////////////////////////////////////////////////////////////////

    !isVitest ? tanstackStart() : null,
    viteReact()
  ].filter(Boolean),
  // Remove the null if it's a Vitest run,

  test: {
    ///////////////////////////////////////////////////////////////////////////
    //
    // After each test, restoreMocks:true  clears the call history AND restores
    // all mocks to their original implementation. This is the full reset!
    // Only use this if you want to make sure every test starts with a fresh, default
    // mock (no custom implementation, no call history).
    //
    // Gotcha: This will restore all mocks to their original implementation after each test.
    // But if you define your mock at the top-level (outside of your test/describe blocks),
    // Vitest will restore it to its original (unmocked) state BEFORE your test even runs.
    // For example in PagePosts.test.tsx
    //
    //   const mockLoader = vi.fn().mockImplementation(() => mockResponse)
    //
    // So, your mockLoader loses its mockImplementation, and when your test runs, it's
    // just an empty mock (returns undefined), which breaks the loader and causes the
    // component to render nothing (hence, Testing Library can't find the list).
    // In most setups, we probably don't want restoreMocks:true. It's too aggressive.
    //
    ///////////////////////////////////////////////////////////////////////////
    // ❌ restoreMocks: true, // Restores all mocks after each test.

    // After each test, it clears the call history of all mocks and spies.
    // It does not reset the mock’s implementation. If you used mockImplementation, that stays the same.
    // Use this if you want to keep your custom mock logic, but just want to reset the call count between tests.
    clearMocks: true,
    // https://vitest.dev/config/ :  Allows global access to describe(), test(), it(), etc.
    // The docs indicate to also add this to tsconfig.json  "compilerOptions": { "types": ["vitest/globals"] }
    // However, that seems problematic because of the way types work. If you define
    // it explicitly, it will ONLY include those items included in types, rather than
    // everything in node_modules/@types. For example, specifying the above type will cause
    // the following error: Property 'toHaveTextContent' does not exist on type 'Assertion<HTMLElement>'.
    // Conversely, removing  "types": ["vitest/globals"] doesn't seem to cause any issues, so
    // for now I'm NOT doing that step. Alternatively, we'd have to look at our node_modules/@types and
    // manually add in every singe thing.
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    // https://vitest.dev/config/#css,

    // https://vitest.dev/guide/in-source.html
    // If you're going to use in-source testing, you need to tell vitest
    // to also look inside of normal files (i.e., non .spec. .test. files).
    includeSource: ['src/**/*.{js,jsx,ts,tsx}'],
    // coverage: { provider: 'c8' // No need for this if using 'c8'

    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium'
              }
            ]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  }
})
export default config
