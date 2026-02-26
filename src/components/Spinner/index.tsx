import * as React from 'react'
import { Loader2Icon } from 'lucide-react'
import { cn } from '@/utils'

type SpinnerProps = React.ComponentProps<'svg'> & {
  delay?: number
  initialShowSpinner?: boolean
}

/* ========================================================================

======================================================================== */
// Usage: <Spinner className='mx-auto size-16 text-sky-500' delay={500} />
//
// https://disjoint.ca/til/2017/09/21/how-to-delay-the-display-of-loading-animations-in-react/
// https://medium.com/trabe/delayed-render-of-react-components-3482f8ad48ad
// https://www.npmjs.com/package/spin-delay

export const Spinner = ({
  className = '',
  delay = 0,
  initialShowSpinner = false,
  ...otherProps
}: SpinnerProps) => {
  const [showSpinner, setShowSpinner] = React.useState(initialShowSpinner)

  /* ======================

  ====================== */
  // ⚠️ Gotcha: Components rendered as fallbacks in <Await /> don't trigger useEffect/useLayoutEffect
  // during the pending state. This is by design - Await is meant for simple fallbacks that don't need
  // complex state or effects. Use initialShowSpinner={true} when using as a fallback in <Await />

  React.useEffect(() => {
    let timeout: NodeJS.Timeout

    if (delay === 0) {
      setShowSpinner(true)
    } else if (delay > 0) {
      timeout = setTimeout(() => {
        setShowSpinner(true)
      }, delay)
    }

    return () => {
      clearTimeout(timeout)
      setShowSpinner(false)
    }
  }, [delay])

  /* ======================
          return 
  ====================== */

  if (!showSpinner) {
    return null
  }

  return (
    <Loader2Icon
      aria-label='Loading'
      role='status'
      {...otherProps}
      className={cn('size-4 animate-spin', className)}
    />
  )
}
