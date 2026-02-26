import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { UserTable, safeUserFields } from '@/db/schema'
import { codes, formatZodErrors } from '@/utils'

const UpdateUserSchema = z.object({
  // Zod's .uuid() works perfeclty with Drizle's
  // id: uuid('id').primaryKey().defaultRandom(),
  id: z.uuid('The resource `id` must be a valid UUID.'),
  username: z.string().min(1)
})

type UpdateUserInput = z.infer<typeof UpdateUserSchema>

/* ========================================================================
     
======================================================================== */
// For now, I'm just updating the username.

export const updateUser = createServerFn({
  method: 'POST'
})
  .inputValidator((input: UpdateUserInput) => input)
  .handler(async (ctx) => {
    const { data } = ctx

    const validationResult = UpdateUserSchema.safeParse(data)

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
    const { id, username } = validationResult.data

    //# Test what happens when you try to update a nonexistent user.

    try {
      const result = await db
        .update(UserTable)
        .set({ username })
        .where(eq(UserTable.id, id))
        .returning(safeUserFields)

      return {
        code: codes.UPDATED,
        data: result?.[0],
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
