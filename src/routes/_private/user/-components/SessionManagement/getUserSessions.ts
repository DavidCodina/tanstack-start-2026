import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
import { codes } from '@/utils'

/* ========================================================================

======================================================================== */

export const getUserSessions = createServerFn({
  method: 'GET'
}).handler(async (_ctx) => {
  try {
    const headers = getRequestHeaders()
    const accounts = await auth.api.listSessions({ headers })

    return {
      code: codes.OK,
      data: accounts,
      message: 'success',
      success: true
    }
  } catch {
    return {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: 'failed',
      success: false
    }
  }
})

export type GetUserSessionsResponseBody = Awaited<
  ReturnType<typeof getUserSessions>
>
