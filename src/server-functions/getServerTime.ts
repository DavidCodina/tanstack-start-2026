import { createServerFn } from '@tanstack/react-start'
import { codes, getTime, isServer } from '@/utils'

/* ========================================================================
                              getServerTime()
======================================================================== */

export const getServerTime = createServerFn({
  method: 'GET'
}).handler(async (_ctx) => {
  const time = getTime()

  const data = {
    time: getTime(),
    isServer: isServer()
  }

  try {
    const successResponse = {
      code: codes.OK,
      data: data,
      message: `Success: ${time}`,
      success: true
    }

    console.log(
      '\n\n-------------------------------\n\n',
      'Server code running:',
      successResponse,
      '\n\n-------------------------------\n\n'
    )
    return successResponse
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

export type GetServerTimeReturnType = ReturnType<typeof getServerTime>
