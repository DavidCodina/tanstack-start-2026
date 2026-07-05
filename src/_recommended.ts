import { createMiddleware } from '@tanstack/react-start'
import { auth } from './auth'

export const publicRoutes = [
  '/',
  '/test',
  '/caching',
  '/caching-2',
  '/forbidden'
]

export const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]

export const apiAuthPrefix = '/api/auth'

export const ADMIN_PREFIX = '/admin'

export const DEFAULT_LOGIN_REDIRECT = '/user'

/* ========================================================================

======================================================================== */

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })
    const isLoggedIn = !!session

    const url = new URL(request.url)
    const { pathname, search } = url

    const isAuthRoute = authRoutes.includes(pathname)
    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix)
    const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)
    const isPublicRoute =
      publicRoutes.includes(pathname) || pathname.startsWith('/api/public')

    // Never block /api/auth routes.
    if (isApiAuthRoute) {
      return next()
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url), 302)
      }
      return next()
    }

    /* ======================

    ====================== */

    if (!isLoggedIn && !isPublicRoute) {
      if (pathname.startsWith('/api')) {
        return new Response(
          JSON.stringify({
            data: null,
            message: 'Not authorized.',
            success: false
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'no-store'
            }
          }
        )
      }

      if (search.includes('logout=true')) {
        return Response.redirect(new URL('/login', url), 302)
      }

      const encodedCallbackUrl = encodeURIComponent(pathname)
      const otherSearchParams = search ? `&${search.slice(1)}` : ''

      return Response.redirect(
        new URL(
          `/login?callbackUrl=${encodedCallbackUrl}${otherSearchParams}`,
          url
        ),
        302
      )
    }

    /* ======================
          Admin Check
    ====================== */

    if (isLoggedIn && isAdminRoute) {
      const role =
        typeof session.user?.role === 'string' ? session.user.role : ''
      if (role.toLowerCase() !== 'admin') {
        return Response.redirect(new URL('/forbidden', url), 302)
      }
    }

    return next()
  }
)
