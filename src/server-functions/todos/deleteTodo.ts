import fs from 'node:fs'

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { TODOS_FILE, readTodos } from './utils'
import { codes, sleep } from '@/utils'

type DeletTodoInput = { id: string }

/* ========================================================================
                              deleteTodo()
======================================================================== */

export const deleteTodo = createServerFn({ method: 'POST' })
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Even though inputValidator is only being used as a pass through, it's
  // still a good practice to use it, so the consumed deleteTodo has
  // type safety on the data property. However, that also means that the
  // handler will now assume that data is exactly as you typed it, and
  // not warn you that data is unknown.
  //
  ///////////////////////////////////////////////////////////////////////////
  .inputValidator((input: DeletTodoInput) => input)
  .handler(async (ctx) => {
    const { data } = ctx

    const DataSchema = z.object({
      id: z.string()
    })

    const validationResult = DataSchema.safeParse(data)

    if (!validationResult.success) {
      return {
        code: codes.BAD_REQUEST,
        data: null,
        message: 'Invalid or missing `id` property.',
        success: false
      }
    }

    // Always use sanitized data from Zod here.
    const { id: todoId } = validationResult.data

    try {
      await sleep(1500)
      const todos = await readTodos()
      const newTodos = todos.filter((todo) => todo.id !== todoId)

      await fs.promises.writeFile(TODOS_FILE, JSON.stringify(newTodos, null, 2))
      return {
        code: codes.DELETED,
        data: null,
        message: `Deleted todo with id of: ${todoId}`,
        success: true
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Internal Server Error'
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: errorMessage,
        success: false
      }
    }
  })
