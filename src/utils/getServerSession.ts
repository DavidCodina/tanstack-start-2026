import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

/* ========================================================================
    
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://better-auth.com/docs/integrations/tanstack#protecting-resources
// To protect resources that require authentication, use beforeLoad with a server function.
// This ensures authentication is checked on every navigation, including client-side
// navigation via <Link> components.
//
// Note: Coding In Flow at 45:15 wraps in cache() from React.
// https://www.youtube.com/watch?v=w5Emwt3nuV0
// However, to keep it simple I've avoided doing that here for this version.
//
///////////////////////////////////////////////////////////////////////////
export const getServerSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const headers = getRequestHeaders()
      const session = await auth.api.getSession({ headers })
      return session
    } catch {
      return null
    }
  }
)
