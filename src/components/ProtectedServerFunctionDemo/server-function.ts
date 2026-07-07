import { createServerFn } from '@tanstack/react-start'
import { codes, getServerSession } from '@/utils'

/* ========================================================================

======================================================================== */
//# See Coding in FLow: at 50:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0

export const getProtectedData = createServerFn({
  method: 'GET'
}).handler(async (_ctx) => {
  const session = await getServerSession()

  if (!session) {
    return {
      code: codes.UNAUTHORIZED,
      data: null,
      message: 'Unauthorized. User must be authenticated.',
      success: false
    }
  }

  try {
    return {
      code: codes.OK,
      data: { info: 'This is a protected server function.' },
      message: `success`,
      success: true
    }
  } catch (_err) {
    const errorResponse = {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      message: `failed`,
      success: false
    }

    return errorResponse
  }
})
