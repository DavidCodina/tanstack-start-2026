import * as React from 'react'
import { useThrottledValue } from '@tanstack/react-pacer'

/* ========================================================================

======================================================================== */
// https://tanstack.com/pacer/latest/docs/framework/react/reference/functions/useThrottledValue

export const UseThrottledValue = () => {
  const [mounted, setMounted] = React.useState(false)
  const [width, setWidth] = React.useState(0)
  const [throttledWidth, throttler] = useThrottledValue(
    width,
    {
      wait: 1000 * 2

      // Inverting these properties from there defaults would essentially
      // create throttling behavior that ran once (I think).
      // leading: true, // Defaults to false
      // trailing: false // Defaults to true
    }

    // Whatever you expose here can then be used through throttler.state elsewhere.
    // For example: throttler.state.executionCount
    // (throttlerState) => {
    //   console.log(throttlerState)
    //   return { executionCount: throttlerState.executionCount }
    // }
  )

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

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    setWidth(window.innerWidth)
    setMounted(true)
  }, [setWidth, throttler])

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='mb-6 flex items-center justify-center gap-2 text-2xl'>
        <span className='text-primary font-semibold'>width:</span>{' '}
        {mounted ? (
          <code className='text-pink-500'>{width}px</code>
        ) : (
          <code className='text-pink-500'>...</code>
        )}
      </div>

      <div className='flex items-center justify-center gap-2 text-2xl'>
        <span className='text-primary font-semibold'>Throttled width:</span>{' '}
        {mounted ? (
          <code className='text-pink-500'>
            {throttledWidth === 0 ? width : throttledWidth}px
          </code>
        ) : (
          <code className='text-pink-500'>...</code>
        )}
      </div>
    </>
  )
}
