import * as React from 'react'
import { useThrottledState } from '@tanstack/react-pacer'

/* ========================================================================

======================================================================== */
// https://tanstack.com/pacer/latest/docs/framework/react/examples/useThrottledState
// https://tanstack.com/pacer/latest/docs/framework/react/reference/functions/useThrottledState
//
// There's four throttling options:
// - useThrottledState
// - useThrottledValue
// - useThrottledCallback
// - useThrottler
//
// These variations also exist for debouncing, etc.

export const UseThrottledState = () => {
  const [mounted, setMounted] = React.useState(false)
  const [width, setWidth] = useThrottledState(0, {
    wait: 500
  })

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    const controller = new AbortController()
    window.addEventListener(
      'resize',
      () => {
        setWidth(window.innerWidth)
      },
      {
        signal: controller.signal
      }
    )

    return () => controller.abort()
    // setWidth is an actual state setter, and will not cause rerenders
  }, [setWidth])

  React.useEffect(() => {
    setWidth(window.innerWidth)
    setMounted(true)
  }, [setWidth])

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='flex items-center justify-center gap-2 text-2xl'>
        <span className='text-primary font-semibold'>width:</span>{' '}
        {mounted ? (
          <code className='text-pink-500'>{width}px</code>
        ) : (
          <code className='text-pink-500'>...</code>
        )}
      </div>
    </>
  )
}
