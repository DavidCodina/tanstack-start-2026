import * as React from 'react'
import { useTheme } from '@/contexts'

const getCSSFromTailwind = ({
  className = '',
  cssProp = 'color',
  fallback = '#000000'
}: {
  className: string
  cssProp: string
  fallback: string
}) => {
  // This is especiially important for Tanstack Start.
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return fallback
  }

  const div = document.createElement('div')
  div.className = className
  div.style.position = 'absolute'
  div.style.visibility = 'hidden'

  document.body.appendChild(div)
  const computedStyle = getComputedStyle(div)
  const propertyValue = computedStyle.getPropertyValue(cssProp)

  document.body.removeChild(div)
  return propertyValue.trim()
}

/* ========================================================================

======================================================================== */

export const useCSSFromTailwind = ({
  className = '',
  cssProp = 'color',
  fallback = '#000000'
}: {
  className: string
  cssProp: string
  fallback: string
}) => {
  const { userTheme } = useTheme()
  const [value, setValue] = React.useState<string>(fallback)

  /* ======================
      useLayoutEffect()
  ====================== */

  React.useLayoutEffect(() => {
    // This is especially important for Tanstack Start.
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const newValue = getCSSFromTailwind({ className, cssProp, fallback })

    setValue(newValue)
  }, [userTheme, className, cssProp, fallback])

  return value || fallback
}
