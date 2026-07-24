import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

/* ========================================================================

======================================================================== */

export const Route = createFileRoute('/_private/_admin')({
  component: LayoutComponent,
  beforeLoad: (param) => {
    const { context } = param
    const { session } = context

    const role =
      'role' in session.user && typeof session.user.role === 'string'
        ? session.user.role
        : ''
    if (role.toLowerCase() !== 'admin') {
      throw redirect({
        to: '/forbidden'
      })
    }

    return { session }
  }
})

function LayoutComponent() {
  return <Outlet />
}
