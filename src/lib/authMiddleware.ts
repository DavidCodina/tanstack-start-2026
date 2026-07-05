import { createMiddleware } from '@tanstack/react-start'
import { auth } from './auth'
// ❌ import { redirect } from '@tanstack/react-router'

export const publicRoutes = ['/', '/about', '/test', '/forbidden']

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
export const DEFAULT_LOGIN_REDIRECT = '/' // '/user', '/settings', etc

/* ========================================================================

======================================================================== */
// The authMiddleware is implemented globally and consumed within start.ts
// Note: Global request middleware runs before every request, including
// server routes, SSR and server functions.

//^ Gotcha: as it is currently implemented, ALL server functions will now fail
//^ because they are not made public.

export const authMiddleware = createMiddleware().server(async (param) => {
  const {
    // context,
    // pathname,
    next,
    request
    // serverFnMeta
  } = param
  const session = await auth.api.getSession({ headers: request.headers })
  const isLoggedIn = !!session

  const url = new URL(request.url)
  const { pathname, search } = url

  const isAuthRoute = authRoutes.includes(pathname)
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix) // '/api/auth'
  //# const isAdminRoute = pathname.startsWith(ADMIN_PREFIX)

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    // ⚠️ This kind of hack would actually end up being a pain in production.
    // pathname.startsWith('/api/dynamic-route-demo')
    // A better solution is to actually have an /api/public folder.
    pathname.startsWith('/api/public')

  // If it's an API auth route, then always allow it. This
  // entails any route that begins with '/api/auth'.
  if (isApiAuthRoute) {
    return next()
  }

  /* ======================

  ====================== */

  if (isAuthRoute) {
    // However, if the user is already logged in, then there's no reason for them
    // to be accessing an auth route, so redirect to DEFAULT_LOGIN_REDIRECT.

    if (isLoggedIn) {
      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ OrcDev uses throw redirect() in the places where he wants to redirect.
      // https://tanstack.com/router/v1/docs/api/router/redirectFunction
      // However, Claude argues that keeping the manual approach is the correct choice for this layer.
      // Why?
      //
      //   throw redirect() from @tanstack/react-router doesn't throw an HTTP response — it throws a special
      //   object ({ isRedirect: true, to, statusCode, ... }) that only specific parts of the router's machinery
      //   know how to catch and translate into an actual 302: route lifecycle hooks (beforeLoad/loader) and
      //   server functions invoked through useServerFn() on the client. Both of those sit inside the router's
      //   own error-boundary handling.
      //
      //   Global request middleware runs outside and below that — it's directly in the raw HTTP request/response
      //   pipeline, before routing/rendering even happens. When people have tried throw redirect() in exactly
      //   this spot, it doesn't get caught properly and surfaces as a broken SSR error instead of a redirect
      //
      //   There's also an open GitHub issue confirming the same underlying mismatch — isRedirect() expects a
      //   Response-shaped object, but middleware-thrown redirects come through as a plain object instead.
      //   https://github.com/TanStack/router/issues/4460
      //
      ///////////////////////////////////////////////////////////////////////////

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

  //# if (isLoggedIn && isAdminRoute) {
  //#   const role = typeof session.user?.role === 'string' ? session.user.role : ''
  //#   if (role.toLowerCase() !== 'admin') {
  //#     return Response.redirect(new URL('/forbidden', url), 302)
  //#   }
  //# }

  /* ======================

  ====================== */

  const response = await next()
  return response
})

/* 
Things worth verifying before you trust this in production:

- Redirects from request middleware are a less-traveled path than from server-function middleware. 
  Server-function middleware has a documented, supported throw redirect() pattern. For request middleware, 
  returning a raw Response to short-circuit is the mechanism implied by the docs' request/response diagram 
  (middleware ultimately produces the HTTP response), but I'd test this concretely against a protected and 
  an auth route rather than assuming it behaves identically to NextResponse.redirect() — there's open 
  discussion in the TanStack repo about exactly this kind of early-return-from-middleware case, so treat 
  it as something to verify in your app, not a guaranteed-stable API.

- No matcher-based asset exclusion. If you see the middleware firing on requests you didn't expect 
  (fonts, images, etc.), you may need to add an early bailout (e.g., checking the request's Accept 
  header or path extension) rather than relying on an automatic exclusion like Next's matcher provides.

- session.user.role — same as your Next.js version, this assumes you've extended the user schema with a 
  role field via Better Auth's additionalFields, and that inferAdditionalFields is wired into your 
  authClient/auth types so TypeScript knows about it.

I'd suggest testing all four branches explicitly (public route as guest, protected route as guest, auth 
route while logged in, admin route as non-admin) before considering this solid, since the redirect-from-middleware 
mechanics here are newer ground than the rest of your setup.

*/
