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
// Ultimately, even the use of Authenticated is not a perfect solution. Any and all
// route-level or component-level protections are just for UX. Real security boundaries
// must also exist wherever the protected data actually comes from (e.g., API routes, server functions).
// For this reason, all sensitive data must have its own data access layer.
//
/////////////////////////
//
// Ranking The Three Layers
//
// 1. A check inside the actual server function / API route that returns the data
//   (the real boundary). This is the only one that can't be bypassed, because it
//   runs on infrastructure the attacker doesn't control, and it gates the data, not just the UI.
//
// 2. beforeLoad calling getServerSession. On the initial hard navigation, this is genuine server-side
//    enforcement before any HTML is sent — real, but only for that request. On client-side (SPA) navigations
//    it re-runs in the browser, so from that point on it's routing/UX behavior, not a boundary.
//
// 3. <Authenticated>. This is weaker than both of the above, for a reason worth calling out explicitly:
//    it has zero server-side execution, ever. authClient.useSession() is a client hook backed by client-side
//    state (your nanostore observation). Even when this component happens to render during an SSR pass, the
//    "check" it's performing isn't a trust check against a request — it's reading whatever the client store
//    already has, which on first server render is typically empty/pending anyway. So unlike beforeLoad,
//    there's no version of this component's execution that anyone should treat as authoritative.
//    It's UI-only, 100% of the time.
//
/////////////////////////
//
// The more important gap: rendering vs. fetching
//
// There's a second reason <Authenticated> is weaker that's easy to miss: it only controls what gets rendered
// into the DOM, not what data got fetched to produce it.
//
// If a route's loader already fetched sensitive data before <Authenticated> even mounts, that data is sitting
// in the client's memory/network tab regardless of whether this component decides to render children or return null.
// Wrapping a component in <Authenticated> doesn't stop the fetch — it just decides whether to display the result.
// So this component is only a legitimate tool for hiding UI (nav links, a "Settings" button, etc.), never for
// protecting data that's already been loaded elsewhere. If you're relying on it to keep something secret rather
// than just visually tidy, that's the bypass that matters most here — no header-spoofing or clever attack
// required, just: the data already left the server.
//
/////////////////////////
//
// Regarding previous comment that "page/component-level protection is more secure than middleware-level protection"
//
// Worth tightening this line in your comment, because it's true in the Next.js CVE context but easy to over-generalize.
// In that context, "page-level" usually means checking auth inside getServerSideProps / a Server Component / the route
// handler itself — i.e., still server-side code, just not living in the separate middleware.ts interceptor that had
// the skip-header bug. It doesn't mean client component checks are more secure — a client-only check like <Authenticated>
// is actually the weakest of the three, weaker than middleware normally is, since middleware at least runs server-side
// per request outside of that one CVE.
//
// So I'd revise that sentence to something like:
//
//   Page-level or component-level protection implemented on the server (e.g., checking session in a loader, Server Component,
//   or route handler) avoids the specific class of bug where a shared middleware layer can be tricked into skipping itself.
//   <Authenticated> here is not that — it's a pure client-side UI gate, useful for hiding UI elements from unauthenticated
//   users, but it provides no data protection and no enforcement guarantee whatsoever.
//
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
