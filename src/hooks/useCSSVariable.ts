import * as React from 'react'
import { useTheme } from '@/contexts'

/* ========================================================================

======================================================================== */

export const useCSSVariable = ({
  value,
  fallback
}: {
  value: string
  fallback: string
}) => {
  const { userTheme } = useTheme()
  const [computed, setComputed] = React.useState<string | undefined>(fallback)

  /* ======================
      useLayoutEffect()
  ====================== */

  React.useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const computedStyle = getComputedStyle(
      document.documentElement
    ).getPropertyValue(value)

    setComputed(computedStyle)
  }, [userTheme, value])

  return computed || fallback
}
