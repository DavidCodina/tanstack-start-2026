import fs from 'node:fs'

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { TODOS_FILE, readTodos } from './utils'
import { codes, formatZodErrors, sleep } from '@/utils'

type UpdateTodoInput = {
  id: string
  name: string
}

/* ========================================================================
                              updateTodo()
======================================================================== */

export const updateTodo = createServerFn({ method: 'POST' })
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Even though inputValidator is only being used as a pass through, it's
  // still a good practice to use it, so the consumed updateTodo has
  // type safety on the data property. However, that also means that the
  // handler will now assume that data is exactly as you typed it, and
  // not warn you that data is unknown.
  //
  ///////////////////////////////////////////////////////////////////////////
  .inputValidator((input: UpdateTodoInput) => input)
  .handler(async (ctx) => {
    const { data } = ctx

    const DataSchema = z.object({
      id: z.string(),
      name: z.string()
    })

    const validationResult = DataSchema.safeParse(data)

    if (!validationResult.success) {
      const errors = formatZodErrors(validationResult.error)
      return {
        code: codes.BAD_REQUEST,
        data: null,
        errors: errors,
        message: 'The data failed validation.',
        success: false
      }
    }

    // Always use sanitized data from Zod here.
    const { id: todoId, name } = validationResult.data

    try {
      await sleep(1500)
      const todos = await readTodos()

      const todo = todos.find((todo) => todo.id === todoId)

      if (!todo) {
        return {
          code: codes.NOT_FOUND,
          data: null,
          message: `The todo with id ${todoId} was not found`,
          success: false
        }
      }

      todo.name = name

      await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2))
      return {
        code: codes.UPDATED,
        data: null,
        message: `Updated todo with id of: ${todoId}`,
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
