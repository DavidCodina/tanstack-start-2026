// https://github.com/TanStack/router/blob/6d904d6ba9397f4939064b0319abc3e47770d4d3/packages/react-router/src/awaited.tsx#L4

import { Suspense, use } from 'react'
import type { ReactNode } from 'react'

type AwaitProps<T> = {
  promise: Promise<T>
  children: (data: T) => ReactNode
  fallback?: ReactNode
}

/* ========================================================================

======================================================================== */

function AwaitResolver<T>({
  promise,
  children
}: {
  promise: Promise<T>
  children: (data: T) => ReactNode
}) {
  // React's `use` hook suspends the component until the promise resolves
  const data = use(promise)
  return <>{children(data)}</>
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This component is intended to mimic the behavior of the Tanstack Router Await component.
// ⚠️ This component is untested.
// This component is somewhat similar to my DataComponent.
//
// Usage example:
//
// function MyComponent() {
//   const slowDataPromise = fetchSlowData();
//
//   return (
//     <Await
//       promise={slowDataPromise}
//       fallback={<div>Loading...</div>}
//     >
//       {(data) => <div>{data.title}</div>}
//     </Await>
//   );
// }
//
///////////////////////////////////////////////////////////////////////////

export function Await<T>({
  promise,
  children,
  fallback = null
}: AwaitProps<T>) {
  return (
    <Suspense fallback={fallback}>
      <AwaitResolver promise={promise} children={children} />
    </Suspense>
  )
}
