import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

/* ========================================================================
    
======================================================================== */
// https://better-auth.com/docs/integrations/tanstack#protecting-server-functions
// https://better-auth.com/docs/integrations/tanstack#protecting-resources

// Use ensureSession helper to protect server functions
// Note: Possibly also used to protect API routes.
// However, I generally don't want to throw. If there's no session I will return a
// response rather than throwing and control going to the catch block.

export const ensureServerSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw new Error('Unauthorized')
    }
    return session
  }
)
