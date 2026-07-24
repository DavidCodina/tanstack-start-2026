import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

/* ========================================================================

======================================================================== */

export const Route = createFileRoute('/_private')({
  component: LayoutComponent,
  beforeLoad: (param) => {
    const { context, location } = param
    const { pathname, search } = location

    // Logic for redirecting away from /login, /register, /forgot-password when
    // already authenticated is handled within the beforeLoad of each respective route.

    // Logic for redirecting away from admin routes is handled within _admin/route.tsx

    if (!context.session) {
      throw redirect({
        to: '/login',
        // No need for manual encodeURIComponent. By default, TanStack Router
        // parses and serializes URL search params automatically using JSON.stringify
        // and JSON.parse, and this process involves escaping and unescaping the
        // search string as part of that serialization.
        search: {
          ...search,
          callbackUrl: pathname
        }
      })
    }
    return { session: context.session }
  }
})

function LayoutComponent() {
  return <Outlet />
}
