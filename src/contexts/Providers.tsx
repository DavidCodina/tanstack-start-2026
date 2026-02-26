import * as React from 'react'
import { AppProvider } from './AppContext'
import { ThemeProvider } from './ThemeContext'

/* ========================================================================
             
======================================================================== */

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <AppProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AppProvider>
  )
}
