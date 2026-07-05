import {
  // createCsrfMiddleware,

  createStart
} from '@tanstack/react-start'
import { authMiddleware } from '@/lib/authMiddleware'

// const csrfMiddleware = createCsrfMiddleware({
//   filter: (ctx) => ctx.handlerType === 'serverFn',
// })

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://tanstack.com/start/latest/docs/framework/react/guide/middleware#global-middleware
// Global middleware runs automatically for every request in your application. This is useful
// for functionality like authentication, logging, and monitoring that should apply to all requests.
//
// Note: Global request middleware runs before every request, including server routes, SSR and
// server functions.
//
///////////////////////////////////////////////////////////////////////////

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [authMiddleware]
  }
})
