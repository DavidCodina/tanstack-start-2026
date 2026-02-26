import type { ResponsePromise } from '@/types'
import { randomFail, sleep } from '@/utils'

type Data = unknown // Or be more specific.
export type GetDataResponsePromise = ResponsePromise<Data>
export type GetData = () => GetDataResponsePromise
export type GetDataResolvedResponse = Awaited<GetDataResponsePromise>

/* ========================================================================

======================================================================== */

export const getData: GetData = async () => {
  try {
    await sleep(1000)

    if (randomFail(0.25)) {
      throw new Error('Whoops! Something went wrong!')
    }

    const res = await fetch(
      'https://jsonplaceholder.typicode.com/users?_limit=3'
    )
    const json = await res.json()

    return {
      code: 'OK',
      data: json,
      message: 'Request success.',
      success: true
    }
  } catch (_err) {
    return {
      code: 'INTERNAL_SERVER_ERROR',
      data: null,
      message: 'Request failed.',
      success: false
    }
  }
}
