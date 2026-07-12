import { Navigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

type AuthenticatedProps = {
  children: React.ReactNode
  shouldRedirect?: boolean
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// The current application implements route protection in the __root.tsx file's
// beforeLoad function. However, Authenticated can be used as an added layer of
// protection:
//
//   function SomePage() {
//     return (<Authenticated> ... </Authenticated>)
//   }
//
//   function SomeComponent() {
//     return (<Authenticated shouldRedirect={false}> ... </Authenticated>)
//   }
//
// Page-level or component-level protection is more secure than middleware-level
// protection. For example, in Next.js logic in middleware.ts/proxy.ts can be
// bypassed by a malicious user. That said, the __root.tsx beforeLoad function is
// not actually middleware, so it doesn't necessarily have that same exact vulnerability.
// Rather, beforeLoad is intrinsic to route resolution itself. That said, it doesn't mean
// it's necessarily unbypassable.
//
// beforeLoad in __root.tsx isn't middleware in the Next.js sense — it's part of route resolution itself,
// not a separate interceptable layer, so it doesn't share the specific class of bug where a crafted header
// tells the framework to skip it. On the initial request it genuinely runs server-side before any HTML is
// sent. But on client-side navigations it runs in the browser like any other client code, so it's
// merely a ⚠️ UX/routing protection ⚠️ (i.e., UX convenience feature), not a security boundary by itself.
// The actual enforcement still needs to live in the server functions/API routes serving protected data
// (e.g., checking the session cookie there too), independent of whether beforeLoad fires.
//
// Nonetheless, this component is still useful if we want to perform client-side
// protection. However, in the specific case of page-level protection in TanStack Start,
// apps it would still be more idiomatic to use that page route's beforeLoad function to
// do a server-side authentication check.
//
// Ultimately, even the use of Authenticated is not a perfect solution. The real
// security boundary has to live wherever the protected data actually comes from. For
// this reason, all sensitive data (i.e., API data) must have its own data access layer.
//
///////////////////////////////////////////////////////////////////////////

export const Authenticated = ({
  children,
  shouldRedirect = true
}: AuthenticatedProps) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // The value seems to come back immediately with data.session, data.user, and isPending as false.
  // This may be because it's already stored in a nanostore.
  //
  // Case 1: user refreshes the page and is NOT authenticated?
  //
  //   1. {data: null, error: null, isPending: true}
  //   2. {data: null, error: null, isPending: false}
  //
  // Case 2: user refreshes the page and IS authenticated?
  //
  //   1. {data: null, error: null, isPending: true}
  //   2. {data: {…}, error: null, isPending: false}
  //
  ///////////////////////////////////////////////////////////////////////////
  const value = authClient.useSession()

  // Note: here data and error seem not to exist as a discriminated union in regard
  // to their types. However, I'm assuming that in practice they never coexist.
  const {
    data,
    // error
    isPending
    // isRefetching,
    // refetch
  } = value

  const isAuthenticated = data && !isPending ? true : false

  if (!isAuthenticated) {
    if (shouldRedirect === true) {
      return <Navigate to='/login' replace />
    }
    return null
  }

  // This is a textbook example of the doughnut pattern.
  return children
}
