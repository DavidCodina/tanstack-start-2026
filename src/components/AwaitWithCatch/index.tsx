import * as React from 'react'
import { Await, CatchBoundary } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import { Alert } from '../Alert'
import { Button } from '../Button'
import type {
  ErrorComponentProps,
  ErrorRouteComponent
} from '@tanstack/react-router'
import { cn } from '@/utils'

type HandleReset = (errorComponentProps: ErrorComponentProps) => void
type AlertProps = React.ComponentProps<typeof Alert>
type SuspenseKey = React.Key | null | undefined

// This type consolidates props from both Await and CatchBoundary.
// It omits getResetKey from CatchBoundary.
// It adds alertProps.
// It adds onReset to expose errorComponentProps to the consumer.
type AwaitWithCatchProps<T> = {
  alertProps?: AlertProps
  children: (result: T) => React.ReactNode
  errorComponent?: ErrorRouteComponent
  fallback?: React.ReactNode
  noCatchBoundary?: boolean
  onCatch?: (error: Error, errorInfo: React.ErrorInfo) => void
  onReset?: HandleReset
  promise: Promise<T>
  // Generally not needed. Prefer using loader + router.invalidate() instead.
  // I added this for cases where I wanted to memoize the Promise inside of the
  // component, rather than using the loader. The problem with not using the loader
  // is that it leads to potential hydration mismatches, which then necessitates using
  // the ClientOnly component. Ultimately, we should probably just use the loader.
  suspenseKey?: SuspenseKey
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// In practice, there's actually no reason to ever implement Suspense (i.e., Await)
// Even with components like Await and CatchBoundary and this abstraction, the
// boilerplate needed for a streaming implementation is much more verbose,
// disconnected and tedious to maintain.
//
// TL;DR: there's almost no reason to ever  use any kind of Suspense/Await implementation.
// It's bad DX. The only exception to this is if you're streaming in from an RSC (like in Next.js).
//
// Often, you'll see tutorials hyping Suspense like it's the future of React and
// the solution to all your useEffect() problems. In practice, it's much more
// painful to use. So... DON'T USE THIS! Instead, prefer useQuery() from Tanstack Query.
//
///////////////////////////////////////////////////////////////////////////

export const AwaitWithCatch = <T,>({
  alertProps = {},
  children,
  errorComponent,
  fallback,
  noCatchBoundary = false,
  onCatch,
  onReset,
  promise,
  suspenseKey
}: AwaitWithCatchProps<T>) => {
  const resetKeyRef = React.useRef(0)
  const { className: alertClassName, ...otherAlertProps } = alertProps

  /* ======================
    defaultErrorComponent
  ====================== */

  const defaultErrorComponent = (errorComponentProps: ErrorComponentProps) => {
    const { error, reset /* info */ } = errorComponentProps
    return (
      <Alert
        className={cn('mx-auto mb-6 max-w-[600px]', alertClassName)}
        leftSection={<AlertCircle className='size-6' />}
        rightSection={
          <Button
            className='min-w-[100px] self-center'
            // ⚠️ Gotcha: when you click "Reset", the CatchBoundary resets but the loader itself is not re-run.
            // So you have to ask yourself are you anticipating an error from the loader, or from the component?
            // If the former, then use router.invalidate(). If the latter, use reset().
            onClick={() => {
              resetKeyRef.current += 1
              if (typeof onReset === 'function') {
                // Make sure onReset() always calls reset() - even if you've already invalidated the route!
                onReset(errorComponentProps)
              } else {
                reset()
              }
            }}
            size='sm'
            variant='destructive'
          >
            Reset
          </Button>
        }
        title='Error'
        variant='destructive'
        {...otherAlertProps}
      >
        {error.message}
      </Alert>
    )
  }

  /* ======================
          return 
  ====================== */

  if (noCatchBoundary) {
    return (
      <Await fallback={fallback} key={suspenseKey} promise={promise}>
        {(result) => children(result)}
      </Await>
    )
  }

  return (
    <CatchBoundary
      errorComponent={errorComponent ? errorComponent : defaultErrorComponent}
      getResetKey={() => resetKeyRef.current}
      onCatch={onCatch}
    >
      <Await fallback={fallback} key={suspenseKey} promise={promise}>
        {(result) => children(result)}
      </Await>
    </CatchBoundary>
  )
}
