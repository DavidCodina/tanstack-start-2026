import * as React from 'react'
import { useDebouncedState } from '@tanstack/react-pacer'

// import { Button } from '@/components'

// const DebouncedCounter = () => {
//   // const [count, setCount] = React.useState(0)
//   const [count, setCount] = useDebouncedState(0, {
//     wait: 250
//   })

//   return (
//     <Button
//       className='mx-auto mb-6 flex'
//       onClick={() => {
//         setCount((v) => v + 1)
//       }}
//       size='sm'
//       variant='success'
//     >
//       Count: {count}
//     </Button>
//   )
// }

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example is very similar to the UseThrottedState demo.
// However, with useThrottledState, you're getting a new value EVERY TIME the
// wait duration elapses. In contrast, with useDebouncedState, you're getting a
// new value only AFTER the there is a rest period of wait duration. In other words,
// in the latter case (i.e., this case), you're only getting a single value change.
//
// In the actual case of resize event listeners or scrolling event listeners, you generally
// want throttle, but again it just depends what the goal is.
//
// The DebouncedCounter is another contrived example. It's a button that for whatever reason,
// we want to prevent button mashing, or accidental double-clicks on.
//
///////////////////////////////////////////////////////////////////////////

export const UseDebouncedState = () => {
  const [mounted, setMounted] = React.useState(false)
  const [width, setWidth] = useDebouncedState(0, {
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
