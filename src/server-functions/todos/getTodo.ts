import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { readTodos } from './utils'
import { codes, formatZodErrors } from '@/utils'

const GetTodoSchema = z.object({ id: z.string() })
type GetTodoInput = z.infer<typeof GetTodoSchema>

/* ========================================================================
                              getTodo()
======================================================================== */

export const getTodo = createServerFn({
  method: 'GET'
})
  .inputValidator((input: GetTodoInput) => input)

  .handler(async (ctx) => {
    const { data } = ctx
    const validationResult = GetTodoSchema.safeParse(data)

    if (!validationResult.success) {
      const errors = formatZodErrors(validationResult.error)
      const errorMessage =
        'id' in errors ? errors.id : 'The data failed validation.'

      return {
        code: codes.BAD_REQUEST,
        data: null,
        message: errorMessage,
        success: false
      }
    }

    // Always use sanitized data from Zod here.
    const { id } = validationResult.data

    try {
      const todos = await readTodos()
      const todo = todos.find((todo) => todo.id === id)

      if (!todo) {
        return {
          code: codes.NOT_FOUND,
          data: null,
          message: 'Resource not found.',
          success: false
        }
      }

      const successResponse = {
        code: codes.OK,
        data: todo,
        message: `success`,
        success: true
      }

      return successResponse
    } catch (_err) {
      const errorResponse = {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `fail`,
        success: false
      }

      return errorResponse
    }
  })
