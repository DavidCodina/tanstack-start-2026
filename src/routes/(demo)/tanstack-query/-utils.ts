import type { Todo } from '@/types'
import { CustomError, codes, isResBody, randomFail, sleep } from '@/utils'
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: Failed to parse URL from /api/tq-todos
// Most of the time the getTodosQueryFn works fine, but if you refresh
// the browser, the route component's loader runs on the server, which
// then no longer understands relative paths. Consequently, you should
// ALWAYS use absolute for any fetch() logic.
//
// Of course, the other alternative is to have query and mutation functions
// that connect through RPC with server functions.
//
///////////////////////////////////////////////////////////////////////////

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error('Missing VITE_API_BASE_URL environment variable.')
}

/* ========================================================================

======================================================================== */

// We have to be a bit more explicit with the typings here
// because of @total-typescript/ts-reset.
export const getTodosQueryFn = async (): Promise<Array<Todo>> => {
  await sleep(2000) //! Temporary
  const res = await fetch(`${baseURL}/api/tq-todos`)

  if (randomFail(0)) {
    throw new CustomError({
      code: codes.INTERNAL_SERVER_ERROR,
      message: 'A random error occurred.'
    })
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // https://tanstack.com/query/v4/docs/react/guides/query-functions#handling-and-throwing-errors
  // For TanStack Query to determine a query has errored, the query function must throw or
  // return a rejected Promise. Any error that is thrown in the query function will be persisted
  // on the error state of the query.
  //
  // While most utilities like axios or graphql-request automatically throw errors for unsuccessful
  // HTTP calls, some utilities like fetch do not throw errors by default.
  // fetch() only throws for network errors (e.g., DNS lookup fails,
  // no internet connection, CORS rejection).
  //
  // In order to leverage React Query's error handling capabilities, you'll need to
  // throw them on your own.
  //
  ///////////////////////////////////////////////////////////////////////////

  const resBody = await res.json()
  // At this point, the function may have already thrown if res.json() failed.

  ///////////////////////////////////////////////////////////////////////////
  //
  // This is a nice check to ensure that the server is following the correct
  // contract. While, it's better to just do it during development, TypeScript
  // is not aware of when you are or aren't in development, and adding the
  // process.env.NODE_ENV === 'development' condition wrecks the type
  // inference.
  //
  // Note: When we call !isResBody<Array<Todo>>(resBody), we're not actually
  // checking if the data is of type T. We're simply telling TypeScript that
  // it is. This is very similar to omitting the generic when consuming, and
  // instead returning with a type assertion:
  //
  //   return data as Array<Todo>
  //
  ///////////////////////////////////////////////////////////////////////////

  if (
    /* process.env.NODE_ENV === 'development' && */ !isResBody<Array<Todo>>(
      resBody
    )
  ) {
    throw new CustomError({
      code: codes.INTERNAL_SERVER_ERROR,
      message: 'The response body is malformed.'
      // name: 'CustomError'
    })
  }

  const { code, data, message, success } = resBody

  //# If you really wanted to go all out, use Zod here to actually validate data.

  if (!res.ok || success !== true) {
    // throw new Error(`The request failed with a status of ${res.status}.`)
    // throw new Error('Unable to get todos.')
    throw new CustomError({
      code: code || codes.INTERNAL_SERVER_ERROR,
      message: message || 'Unable to get todos.'
      // name: 'CustomError'
    })
  }

  return data
}

/* ========================================================================

======================================================================== */

export const getTodoQueryFn = async ({
  todoId
}: {
  todoId: string
}): Promise<Todo> => {
  // console.log('getTodoQueryFn() called, but sleeping for 2s...')
  await sleep(2000) //! Temporary
  const res = await fetch(`${baseURL}/api/tq-todos/${todoId}`)

  if (randomFail(0)) {
    throw new CustomError({
      code: codes.INTERNAL_SERVER_ERROR,
      message: 'A random error occurred.'
    })
  }

  const resBody = await res.json()

  if (!isResBody<Todo>(resBody)) {
    throw new CustomError({
      code: codes.INTERNAL_SERVER_ERROR,
      message: 'The response body is malformed.'
    })
  }

  const { code, data, message, success } = resBody

  //# If you really wanted to go all out, use Zod here to actually validate data.

  if (!res.ok || success !== true) {
    throw new CustomError({
      code: code || codes.INTERNAL_SERVER_ERROR,
      message: message || 'Unable to get todos.'
    })
  }

  return data
}

/* ========================================================================

======================================================================== */

export const addTodoMutationFn = async (name: string): Promise<Todo> => {
  const res = await fetch(`${baseURL}/api/tq-todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  })

  const resBody = await res.json()

  if (!isResBody<Todo>(resBody)) {
    throw new CustomError({
      code: codes.INTERNAL_SERVER_ERROR,
      message: 'The response body is malformed.'
    })
  }

  const { code, data, message, success } = resBody

  if (!res.ok || success !== true) {
    // throw new Error(`The request failed with a status of ${res.status}.`)
    // throw new Error('Unable to add todo.')
    throw new CustomError({
      code: code || codes.INTERNAL_SERVER_ERROR,
      message: message || 'Unable to add todo.'
      // name: 'CustomError'
    })
  }

  return data
}

/* ========================================================================

======================================================================== */

export const updateTodoMutationFn = async ({
  todoId,
  name
}: {
  todoId: string
  name: string
}): Promise<Todo> => {
  const res = await fetch(`${baseURL}/api/tq-todos/${todoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  })

  const resBody = await res.json()

  if (!isResBody<Todo>(resBody)) {
    throw new CustomError({
      code: codes.INTERNAL_SERVER_ERROR,
      message: 'The response body is malformed.'
    })
  }

  const { code, data, message, success } = resBody

  if (!res.ok || success !== true) {
    throw new CustomError({
      code: code || codes.INTERNAL_SERVER_ERROR,
      message: message || 'Unable to update todo.'
    })
  }

  return data
}

/* ========================================================================

======================================================================== */

export const deleteTodoMutationFn = async (todoId: string): Promise<null> => {
  const res = await fetch(`${baseURL}/api/tq-todos/${todoId}`, {
    method: 'DELETE'
  })

  const resBody = await res.json()

  if (!isResBody<null>(resBody)) {
    throw new CustomError({
      code: codes.INTERNAL_SERVER_ERROR,
      message: 'The response body is malformed.'
    })
  }

  const { code, data, message, success } = resBody

  if (!res.ok || success !== true) {
    throw new CustomError({
      code: code || codes.INTERNAL_SERVER_ERROR,
      message: message || 'Unable to delete todo.'
    })
  }

  return data
}
