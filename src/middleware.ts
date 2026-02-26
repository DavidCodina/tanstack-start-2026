import { createMiddleware } from '@tanstack/react-start'
import { getTime, randomFail, randomTrue } from '@/utils'

/* ========================================================================

======================================================================== */

export const randomFailMiddleware = createMiddleware({
  type: 'function'
}).server(async (options) => {
  const { next } = options

  const shouldFail = randomFail()
  if (shouldFail) {
    // ////////////////////////////////////////////////////////////////////////
    //
    // In TanStack Router, middleware should not return custom response objects.
    // Instead, it should either call next() to continue the middleware
    // chain or throw an error to interrupt it. If you throw:
    //
    //   const time = getTime()
    //   throw new Error(`Randomly failed at: ${time}`)
    //
    // Terminal will output:
    //
    //   Server Fn Error!
    //   Error: Randomly failed at: 7:19:49 PM
    //   at ...
    //   at ...
    //
    // This error must be caught by the code consuming the server function, which
    // is super annoying. As an alternative we can
    //
    // ////////////////////////////////////////////////////////////////////////
    const time = getTime()
    throw new Error(`Randomly failed at: ${time}`)
  }

  return next()
})

/* ========================================================================

======================================================================== */
// ////////////////////////////////////////////////////////////////////////
//
// As a best practice, try not throw in middleware.
// Instead, prefer passing context to a server function, and handling it
// internally there. This way you can avoid potential uncaught errors.
//
// Note: actual middleware is more likely implemented in the beforeLoad handler.
//
// ////////////////////////////////////////////////////////////////////////

export const mockAuthMiddleware = createMiddleware({
  type: 'function'
}).server(async (options) => {
  const { next, context } = options

  // This is hacky, but seems necesary because currently
  // TanStack Start doesn't provide strong typing for the extensible
  // context object in middleware.
  let typedContext = context as unknown as
    | { isAuthenticated?: boolean }
    | undefined

  const isAuthenticated = randomTrue()

  if (!typedContext) {
    typedContext = { isAuthenticated }
  } else {
    typedContext.isAuthenticated = isAuthenticated
  }

  return next()
})
