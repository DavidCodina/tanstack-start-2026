import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { UserPreferencesTable, UserTable, safeUserFields } from '@/db/schema'
import { codes, formatZodErrors } from '@/utils'

const GetUserSchema = z.object({
  // Zod's .uuid() works perfeclty with Drizle's
  // id: uuid('id').primaryKey().defaultRandom(),
  id: z.uuid('The resource `id` must be a valid UUID.')
})

type GetUserInput = z.infer<typeof GetUserSchema>

/* ========================================================================
                              getUser()
======================================================================== */

export const getUser = createServerFn({
  method: 'GET'
})
  .inputValidator((input: GetUserInput) => input)

  .handler(async (ctx) => {
    const { data } = ctx
    const validationResult = GetUserSchema.safeParse(data)

    // If you pass in a malformed uuid like '123', then validation will fail.
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
      const result = await db
        .select({
          ...safeUserFields,
          preferences: UserPreferencesTable
        })
        .from(UserTable)
        .leftJoin(
          UserPreferencesTable,
          eq(UserTable.id, UserPreferencesTable.userId)
        )
        .where(eq(UserTable.id, id))

      // Return early if empty array
      if (!Array.isArray(result) || result.length === 0) {
        return {
          code: codes.NOT_FOUND,
          data: null,
          message: 'Resource not found.',
          success: false
        }
      }

      return {
        code: codes.OK,
        data: result?.[0],
        message: 'success',
        success: true
      }
    } catch (_err) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'fail',
        success: false
      }
    }
  })
