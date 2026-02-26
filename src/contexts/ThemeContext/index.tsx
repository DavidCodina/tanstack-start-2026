///////////////////////////////////////////////////////////////////////////
//
// ✅ https://www.youtube.com/watch?v=NoxvbjkyLAg
// ✅ https://github.com/Balastrong/start-theme-demo
//
// See also:
//   Josef Bender: https://www.youtube.com/watch?v=h8QJ-keNnHw&t=53s // 👈🏻👈🏻👈🏻
//   https://github.com/juliusmarminge/tanstack-themes
//   https://www.npmjs.com/package/@tanstack-themes/react
//   https://dev.to/tigawanna/tanstack-start-ssr-friendly-theme-provider-5gee
//
///////////////////////////////////////////////////////////////////////////

import { ScriptOnce } from '@tanstack/react-router'
import { createContext, use, useEffect, useState } from 'react'

import { z } from 'zod'
import {
  getStoredUserTheme,
  getSystemTheme,
  handleThemeChange,
  setStoredTheme,
  setupPreferredListener,
  themeScript
} from './utils'
import type { ReactNode } from 'react'

const UserThemeSchema = z.enum(['light', 'dark', 'system']).catch('system')
const _AppThemeSchema = z.enum(['light', 'dark']).catch('light')

export type UserTheme = z.infer<typeof UserThemeSchema>
export type AppTheme = z.infer<typeof _AppThemeSchema>

/* ======================

====================== */

type ThemeContextValue = {
  userTheme: UserTheme
  appTheme: AppTheme
  setTheme: (theme: UserTheme) => void
}

//const ThemeContext = createContext({} as ThemeContextValue)
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

type ThemeProviderProps = {
  children: ReactNode
}

/* ========================================================================
             
======================================================================== */

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [userTheme, setUserTheme] = useState<UserTheme>(getStoredUserTheme)

  const appTheme = userTheme === 'system' ? getSystemTheme() : userTheme

  const setTheme = (newUserTheme: UserTheme) => {
    const validatedTheme = UserThemeSchema.parse(newUserTheme)
    setUserTheme(validatedTheme)
    setStoredTheme(validatedTheme)
    handleThemeChange(validatedTheme)
  }

  /* ======================
         useEffect()
  ====================== */

  useEffect(() => {
    if (userTheme !== 'system') {
      return
    }
    return setupPreferredListener()
  }, [userTheme])

  /* ======================
          return
  ====================== */

  return (
    <ThemeContext value={{ userTheme, appTheme, setTheme }}>
      {/* 
      Prevent FOUC. See here at 3:45
      https://www.youtube.com/watch?v=NoxvbjkyLAg
      */}
      <ScriptOnce children={themeScript} />

      {children}
    </ThemeContext>
  )
}

/* ========================================================================
             
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: Saves to THIS file will result in:
//
//   ❌ Error: useTheme must be used within a ThemeProvider
//
// However in general, files saves elsewhere will work fine.
// Actually, the issue is more pervasive. Merely saving in __root.tsx
// will also cause an error:
//
//   ❌ Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
//
// The issue occurs when saving any top-level file.
// https://github.com/TanStack/router/issues/1992
// Bottom line: This is a framework issue, not a bug in my code.
//
///////////////////////////////////////////////////////////////////////////

export const useTheme = () => {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
