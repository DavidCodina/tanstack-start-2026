import { useThrottledCallback } from '@tanstack/react-pacer'
import { Button } from '@/components'

/* ========================================================================

======================================================================== */
// This example is of a button that throttle button mashing such that the
// click handler only runs once every 3 seconds. Why would you want to do this?
// It just depends...

export const UseThrottledCallback = () => {
  const handleClick = () => {
    console.log('Clicked!')
  }

  const debouncedHandleClick = useThrottledCallback(handleClick, {
    enabled: true, // Defaults to true.
    wait: 1000 * 3,
    leading: false // Defaults to false
  })

  return (
    <>
      <Button onClick={debouncedHandleClick}>Click Me</Button>
    </>
  )
}
