'use client'

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'

export interface ThemeContextValue {
  theme: 'light' | 'dark'
  setTheme: Dispatch<SetStateAction<'light' | 'dark'>>
  // [key: string]: any
}

const THEME = 'theme'
const LIGHT = 'light'
const DARK = 'dark'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Tailwind             : https://tailwindcss.com/docs/dark-mode
// John Komarnicki      : https://www.youtube.com/watch?v=oMOe_32M6ss
// Tom Is Loading       : https://www.youtube.com/watch?v=vIBKSmWAdIA - A more sophisticated approach.
// See also next-themes : https://github.com/pacocoursey/next-themes
//
/////////////////////////
//
// The Tailwind light/dark theme feature works in conjunction with several other files.
// - tailwind.config.js sets: darkMode: 'selector'. // ❌ not 'class'
// - <ThemeProvider> is consumed in contexts/Providers.tsx
// - <MainLayout/> consumes:  const { theme } = useThemeContext()
// - const { theme, setTheme } = useThemeContext() is also consumed in MainLayout/components/Menu.tsx
//
// - useThemeContext() might also be baked into various custom components like
//   Title, HR, Card, Modal, Spinner, Tabs (?), etc. However, I want to move away from doing that
//   because it means they can no longer be part of a separate component library.
//
// Ultimately, Whether a website will need a 'light/dark' feature is something that should
// ideally be determined from the outset. Otherwise, adding it in later is kind of
// a pain because you have to go back and update a bunch of component styles.
//
///////////////////////////////////////////////////////////////////////////

export const ThemeContext = createContext({} as ThemeContextValue)
export const ThemeConsumer = ThemeContext.Consumer

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const firstRenderRef = useRef(true)
  const isWindow = typeof window !== 'undefined'

  const prefersDarkTheme = isWindow
    ? window.matchMedia(`(prefers-color-scheme: ${DARK})`).matches
    : false

  // Initially, theme will be set based on the presence of a 'theme' key in localStorage.
  // If no 'them' key exists, then we check for a system preference.
  // If dark is not set as a system preference, then ultimately we default to light.
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // ⚠️ Gotcha ReferenceError: localStorage is not defined
    // In Tanstack Start, this useState hook will run first on the server,
    // then on the client.
    if (typeof localStorage !== 'undefined') {
      const maybeTheme = localStorage.getItem(THEME)
      if (maybeTheme === LIGHT || maybeTheme === DARK) {
        return maybeTheme
      }
    }

    return prefersDarkTheme ? DARK : LIGHT
  })

  /* ======================
        useEffect()
  ====================== */
  // On mount, set up an event listener that watches for changes to the user's system preference.

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaWatcher = window.matchMedia(`(prefers-color-scheme: ${DARK})`)

    // https://betterprogramming.pub/using-window-matchmedia-in-react-8116eada2588
    // When the user changes changes their system preference for dark theme,
    // then update theme accordingly.
    const handleChange = (e: any) => {
      if (e.currentTarget.matches === true) {
        // console.log('The user now prefers a prefers a dark color scheme.')
        setTheme(DARK)
      } else {
        // console.log('The user now does NOT prefer a dark color scheme.')
        setTheme(LIGHT)
      }
    }
    mediaWatcher.addEventListener('change', handleChange)
    return () => {
      mediaWatcher.removeEventListener('change', handleChange)
    }
  }, [])

  /* ======================
        useEffect()
  ====================== */
  // Update the <html> element's classList and localStorage whenenver the value
  // of theme changes. There was a flash that occurs on mount when the theme switches.
  // This is one of those rare cases where useLayoutEffect() is needed.

  useLayoutEffect(() => {
    // ⚠️ Gotcha ReferenceError: localStorage is not defined
    if (typeof window === 'undefined') {
      return
    }

    const html = document.getElementsByTagName('html')?.[0]
    if (firstRenderRef.current === true && html) {
      // .transition-none-all is hardcoded into index.html to prevent
      // the light/dark transition on mount.

      // # I'm currently not implementing 'transition-none-all'
      setTimeout(() => {
        html.classList.remove('transition-none-all')
      }, 1000)
    }
    firstRenderRef.current = false

    if (html) {
      if (theme === DARK) {
        localStorage.setItem(THEME, DARK)
        if (!html.classList.contains(DARK)) {
          html.classList.add(DARK)
        }
      } else {
        localStorage.setItem(THEME, LIGHT)
        html.classList.remove(DARK)
      }
    }
  }, [theme])

  /* ======================
          return
  ====================== */

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const value = useContext(ThemeContext)
  return value
}
