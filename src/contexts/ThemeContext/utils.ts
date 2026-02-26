import { createClientOnlyFn, createIsomorphicFn } from '@tanstack/react-start'
import { z } from 'zod'

const UserThemeSchema = z.enum(['light', 'dark', 'system']).catch('system')
const _AppThemeSchema = z.enum(['light', 'dark']).catch('light')

export type UserTheme = z.infer<typeof UserThemeSchema>
export type AppTheme = z.infer<typeof _AppThemeSchema>

const themeStorageKey = 'ui-theme'

/* ========================================================================
             
======================================================================== */

export const getStoredUserTheme = createIsomorphicFn()
  .server((): UserTheme => 'system')
  .client((): UserTheme => {
    const stored = localStorage.getItem(themeStorageKey)
    return UserThemeSchema.parse(stored)
  })

/* ========================================================================
             
======================================================================== */

export const setStoredTheme = createClientOnlyFn((theme: UserTheme) => {
  const validatedTheme = UserThemeSchema.parse(theme)
  localStorage.setItem(themeStorageKey, validatedTheme)
})

/* ========================================================================
             
======================================================================== */

export const getSystemTheme = createIsomorphicFn()
  .server((): AppTheme => 'light')
  .client((): AppTheme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

/* ========================================================================
             
======================================================================== */

export const handleThemeChange = createClientOnlyFn((userTheme: UserTheme) => {
  const validatedTheme = UserThemeSchema.parse(userTheme)

  const root = document.documentElement
  root.classList.remove('light', 'dark', 'system')

  if (validatedTheme === 'system') {
    const systemTheme = getSystemTheme()
    root.classList.add(systemTheme, 'system')
  } else {
    root.classList.add(validatedTheme)
  }
})

/* ========================================================================
             
======================================================================== */

export const setupPreferredListener = createClientOnlyFn(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => handleThemeChange('system')
  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
})

/* ========================================================================
             
======================================================================== */

export const themeScript = (function () {
  function themeFn() {
    if (typeof window !== 'undefined') {
      try {
        const storedTheme = localStorage.getItem('ui-theme') || 'system'
        const validTheme = ['light', 'dark', 'system'].includes(storedTheme)
          ? storedTheme
          : 'system'

        if (validTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light'
          document.documentElement.classList.add(systemTheme, 'system')
        } else {
          document.documentElement.classList.add(validTheme)
        }
      } catch (_err) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light'
        document.documentElement.classList.add(systemTheme, 'system')
      }
    }
  }
  return `(${themeFn.toString()})();`
})()

/* ========================================================================
             
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The current implementation with this in ThemeProvider seems to work fine.
//
//   <ThemeContext value={{ userTheme, appTheme, setTheme }}>
//     <ScriptOnce children={themeScript} />
//     {children}
//   </ThemeContext>
//
// However, as an alterative, we could do this in __root.tsx:
//
//   scripts: [  { children: themeScriptString }]
//
///////////////////////////////////////////////////////////////////////////

export const themeScriptString = `
  const themeStorageKey = 'ui-theme'
  if (typeof window !== 'undefined') {
    console.log("Running themeScript...")
    try {
      const storedTheme = localStorage.getItem(themeStorageKey) || 'system'
      const validTheme = ['light', 'dark', 'system'].includes(storedTheme)
        ? storedTheme
        : 'system'

      if (validTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light'
        document.documentElement.classList.add(systemTheme, 'system')
      } else {
        document.documentElement.classList.add(validTheme)
      }
    } catch (e) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      document.documentElement.classList.add(systemTheme, 'system')
    }
  }
`
