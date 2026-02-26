import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'
import type { FallbackProps } from 'react-error-boundary'
import type { DataContainerProps } from './types'
import { Alert, Button } from '@/components'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This component is intended to to wrap a child component that is passed
// a Promise and implements use() internally. This component is client-side
// only because react-error-boundary is client-side only package. For
// server-side components that await data, handle the error internally by
// catching it in the component, or better yet in the data fetching function or action.
// And just like is done here, wrap that component in Suspense to stream it in.
//
// Admittedly, this is a very niche component, and I'm personally not a fan of relying
// on an ErrorBoundary to handle errors, but it's still a useful component to have.
//
// While this works, if you're already using Tanstack Start, it's easier to simply
// implement <Await /> + <CatchBoundary />. See the AwaitWithCatch component.
//
///////////////////////////////////////////////////////////////////////////

export const DataContainer = ({
  children,
  errorMessage = 'Request Failed.',
  fallback,
  fallbackRender,
  FallbackComponent,
  handleResetErrorBoundary,
  onError,
  onReset,
  showOriginalError = false,
  suspenseFallback,
  suspenseKey
}: DataContainerProps) => {
  /* ======================
         fallbackProp
  ====================== */
  // A single prop is created for the particular fallback
  // type that satisfies the discriminated union. When
  // no fallback type is specified, the default fallbackRender
  // is used.

  const fallbackProp = fallback
    ? { fallback }
    : fallbackRender
      ? { fallbackRender }
      : FallbackComponent
        ? { FallbackComponent }
        : {
            fallbackRender: (fallbackProps: FallbackProps) => {
              const { error, resetErrorBoundary } = fallbackProps
              const originalError = error instanceof Error ? error.message : ''
              const message =
                showOriginalError && originalError
                  ? originalError
                  : errorMessage
              return (
                <Alert
                  className='mx-auto mb-6 max-w-[600px]'
                  leftSection={<AlertCircle className='size-6' />}
                  rightSection={
                    <Button
                      className='min-w-[100px] self-center'
                      onClick={async () => {
                        if (typeof handleResetErrorBoundary === 'function') {
                          await handleResetErrorBoundary(resetErrorBoundary)
                        } else {
                          resetErrorBoundary()
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
                >
                  {message}
                </Alert>
              )
            }
          }

  /* ======================
          return
  ====================== */

  return (
    <ErrorBoundary onError={onError} onReset={onReset} {...fallbackProp}>
      <Suspense key={suspenseKey} fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
