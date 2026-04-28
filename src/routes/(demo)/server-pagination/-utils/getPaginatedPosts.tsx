import type { ResponsePromise } from '@/types'
import { codes, handleError, /* randomFail,*/ sleep } from '@/utils'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

type ReturnData = {
  posts: Post[]
  total: number | undefined
}
type GetPaginatedPostsData = ReturnData | null
type GetPaginatedPostsResponsePromise = ResponsePromise<GetPaginatedPostsData>
type GetPaginatedPostsArg = {
  page?: number
  limit?: number
}
type GetPaginatedPosts = (
  arg?: GetPaginatedPostsArg
) => GetPaginatedPostsResponsePromise

/* ======================
    getPaginatedPosts()
====================== */

export const getPaginatedPosts: GetPaginatedPosts = async (arg = {}) => {
  const page = arg.page && typeof arg.page === 'number' ? arg.page : 1
  // Initially, I did not have  || 999999. However, JSONPlaceholder seems to only
  // return the X-Total-Count header if one explicitly specifies a limit.
  const limit = arg.limit || 999999

  try {
    // This is useful for demonstrating that Tanstack Router is caching
    // the loader return value relative to the search params.
    await sleep(2000)
    const URL = `https://jsonplaceholder.typicode.com/posts${limit && typeof limit === 'number' ? `?_start=${(page - 1) * limit}&_limit=${limit}` : ''}`

    const res = await fetch(URL)

    if (!res.ok) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `The request failed with a status of ${res.status}.`,
        success: false
      }
    }

    const xTotalCount = res.headers.get('X-Total-Count')

    const maybeTotalAsNUmber =
      typeof xTotalCount === 'string' ? parseInt(xTotalCount) : undefined
    const total =
      typeof maybeTotalAsNUmber === 'number' && !isNaN(maybeTotalAsNUmber)
        ? maybeTotalAsNUmber
        : undefined

    const json = (await res.json()) as Post[]

    return {
      code: codes.OK,
      data: {
        posts: json,
        total
      },
      message: 'success',
      success: true
    }
  } catch (err) {
    if (err instanceof Error) {
      return handleError(err, err.message)
    }
    return handleError(err)
  }
}
