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
