import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export const publicRoutes = [
  '/',
  // '/about',
  '/test',
  '/caching',
  '/caching-2',
  '/forbidden'
]

/** An array of routes that are used for authentication
 * If user tries to access them while authenticated, they
 * will be redirected to DEFAULT_LOGIN_REDIRECT
 */
export const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]

// Routes that start with '/api/auth' prefix are used for API authentication purposes.
// Never block the /api/auth routes.
export const apiAuthPrefix = '/api/auth'

export const ADMIN_PREFIX = '/admin'

/** The default redirect path after logging in. */
export const DEFAULT_LOGIN_REDIRECT = '/user' // '/settings', etc

/* ========================================================================

======================================================================== */

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const { nextUrl } = req
  const isLoggedIn = !!session

  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix) // '/api/auth'

  const isAdminRoute = nextUrl.pathname.startsWith(ADMIN_PREFIX)

  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    // ⚠️ This kind of hack would actually end up being a pain in production.
    // nextUrl.pathname.startsWith('/api/dynamic-route-demo')
    // A better solution is to actually have an /api/public folder.
    nextUrl.pathname.startsWith('/api/public')

  // If it's an API auth route, then always allow it. This
  // entails any route that begins with '/api/auth'.
  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    // However, if the user is already logged in, then there's no reason for them
    // to be accessing an auth route, so redirect to DEFAULT_LOGIN_REDIRECT.

    if (isLoggedIn) {
      // Don't use Response.redirect() here. It will result in: ⨯ TypeError: immutable
      // Response.redirect() creates an immutable response — when Next.js tries to attach
      // its internal headers to it, it throws TypeError: immutable.
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  /* ======================

  ====================== */

  if (!isLoggedIn && !isPublicRoute) {
    if (nextUrl.pathname.startsWith('/api')) {
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

    if (nextUrl.search) {
      if (nextUrl.search.includes('logout=true')) {
        return NextResponse.redirect(new URL(`/login`, nextUrl))
      }
    }

    const callbackUrl = nextUrl.pathname
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    const otherSearchParams = nextUrl.search
      ? `&${nextUrl.search.slice(1)}`
      : ''

    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${encodedCallbackUrl}${otherSearchParams}`,
        nextUrl
      )
    )
  }

  /* ======================
        Admin Check
  ====================== */

  if (isLoggedIn && isAdminRoute) {
    const role = typeof session.user?.role === 'string' ? session.user.role : ''
    if (role.toLocaleLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', nextUrl))
    }
  }

  /* ======================

  ====================== */

  // Otherwise, return.
  return
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
