import type {
  ComponentProps,
  ErrorInfo,
  PropsWithChildren,
  Suspense
} from 'react'

import type {
  ErrorBoundaryPropsWithComponent,
  ErrorBoundaryPropsWithFallback,
  ErrorBoundaryPropsWithRender
  // FallbackProps,
  // ErrorBoundaryProps
} from 'react-error-boundary'

/* ========================================================================

======================================================================== */

type ErrorBoundarySharedProps = PropsWithChildren<{
  onError?: (error: unknown, info: ErrorInfo) => void
  // ❌ onError?: (error: Error, info: ErrorInfo) => void
  onReset?: (
    details:
      | {
          reason: 'imperative-api'
          args: unknown[]
        }
      | {
          reason: 'keys'
          prev: unknown[] | undefined
          next: unknown[] | undefined
        }
  ) => void
  resetKeys?: unknown[]
}>

// ⚠️ ReactErrorBoundary doesn't expose ErrorBoundarySharedProps.
// In order to get the DataContainer to use the discriminated union from ErrorBoundary,
// but ALSO allow for the internal default fallbackRender (i.e., no choice as an option),
// we need to recreate ErrorBoundaryProps here (based off "react-error-boundary": "^5.0.0"),
// but with ErrorBoundaryPropsWithDefaultRender as a fourth option in the discriminated union.
export type ErrorBoundaryPropsWithDefaultRender = ErrorBoundarySharedProps & {
  fallback?: never
  FallbackComponent?: never
  fallbackRender?: never
}

export type ErrorBoundaryProps =
  | ErrorBoundaryPropsWithFallback
  | ErrorBoundaryPropsWithComponent
  | ErrorBoundaryPropsWithRender
  | ErrorBoundaryPropsWithDefaultRender

/* ========================================================================

======================================================================== */

type ResetErrorBoundary = (...args: unknown[]) => void

export type DataContainerProps = ErrorBoundaryProps & {
  errorMessage?: string
  handleResetErrorBoundary?: (resetErrorBoundary: ResetErrorBoundary) => void
  showOriginalError?: boolean
  // Previously, this was optional and there was a default suspenseFallback
  // baked into the DataContainer. However, The UI (i.e., skeleton/placeholder)
  // for the suspenseFallback should always be custom to prevent cumulative layout shift.
  suspenseFallback: ComponentProps<typeof Suspense>['fallback']
  suspenseKey?: React.Key | null | undefined
}
