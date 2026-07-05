export const publicRoutes = ['/', '/test', '/forbidden'] //` '/about'

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

export const ADMIN_PREFIX = '/admin'

/** The default redirect path after logging in. */
export const DEFAULT_LOGIN_REDIRECT = '/' // '/user', '/settings', etc
