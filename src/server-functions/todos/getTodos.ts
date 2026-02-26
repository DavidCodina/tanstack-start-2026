import {
  // createMiddleware,
  createServerFn
} from '@tanstack/react-start'
import { readTodos } from './utils'
import { codes, getTime, sleep } from '@/utils'

// import { mockAuthMiddleware, randomFailMiddleware } from '@/middleware'

/*
const loggingMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    console.log("Request:", request.url);
    return next();
  }
);
const loggedServerFunction = createServerFn({ method: "GET" }).middleware([
  loggingMiddleware,
]);
*/

/* ========================================================================
                              getTodos()
======================================================================== */
// https://tanstack.com/start/latest/docs/framework/react/guide/server-functions

export const getTodos = createServerFn({
  method: 'GET'
}).handler(async (_ctx) => {
  const time = getTime()
  await sleep(10)

  try {
    // if (randomFail(0.25)) { throw new Error('Whoops! Unable to get todos.') }

    const todos = await readTodos()
    const successResponse = {
      code: codes.OK,
      data: todos,
      message: `Success: ${time}`,
      success: true
    }

    // console.log('\n-------------------------------\n', successResponse)
    return successResponse
  } catch (_err) {
    const errorResponse = {
      code: codes.INTERNAL_SERVER_ERROR,
      data: null,
      // message: errorMessage,
      message: `Failed: ${time}`,
      success: false
    }

    // console.log('\n-------------------------------\n', errorResponse)
    return errorResponse
  }
})
