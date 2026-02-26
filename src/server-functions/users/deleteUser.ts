import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { UserTable, safeUserFields } from '@/db/schema'
import { codes, formatZodErrors } from '@/utils'

const DeleteUserSchema = z.object({
  // Zod's .uuid() works perfeclty with Drizle's
  // id: uuid('id').primaryKey().defaultRandom(),
  id: z.uuid('The resource `id` must be a valid UUID.')
})

type DeleteUserInput = z.infer<typeof DeleteUserSchema>

/* ========================================================================
     
======================================================================== */

export const deleteUser = createServerFn({
  method: 'POST'
})
  .inputValidator((input: DeleteUserInput) => input)
  .handler(async (ctx) => {
    const { data } = ctx

    const validationResult = DeleteUserSchema.safeParse(data)

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

    //# Test what happens when you try to delete a nonexistent user.

    try {
      const _result = await db
        .delete(UserTable)
        .where(eq(UserTable.id, id))
        .returning(safeUserFields)

      return {
        code: codes.DELETED,
        data: null,
        message: `success`,
        success: true
      }
    } catch (_err) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `fail`,
        success: false
      }
    }
  })
