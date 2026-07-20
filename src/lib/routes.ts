// The '/reset-password' route must be treated as a public route, so that
// a OAuth user can go through the create password flow initiated by the
// <CreatePasswordButton />.
export const publicRoutes = [
  '/',
  '/test',
  '/test/nested',
  '/forbidden',
  '/reset-password',
  '/email-change-status' // This is the route that is redirected to after the user verifies their new email.
  // '/about'
]

/** An array of routes that are used for authentication
 * If user tries to access them while authenticated, they
 * will be redirected to DEFAULT_LOGIN_REDIRECT
 */
export const authRoutes = ['/login', '/register', '/forgot-password']

export const ADMIN_PREFIX = '/admin'

/** The default redirect path after logging in. */
export const DEFAULT_LOGIN_REDIRECT = '/user' // '/settings', etc
