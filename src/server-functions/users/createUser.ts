import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { db } from '@/db'
import { UserTable, safeUserFields } from '@/db/schema'
import { codes, formatZodErrors, sleep } from '@/utils'

export * from './getUsers'

const CreateUserSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string().min(5)
})

type CreateUserInput = z.infer<typeof CreateUserSchema>

/* ========================================================================
     
======================================================================== */

export const createUser = createServerFn({
  method: 'POST'
})
  .inputValidator((input: CreateUserInput) => input)

  .handler(async (ctx) => {
    await sleep(1500)
    const { data } = ctx

    const validationResult = CreateUserSchema.safeParse(data)

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
    const { username, email, password } = validationResult.data

    try {
      ///////////////////////////////////////////////////////////////////////////
      //
      // The result is NeonHttpQueryResult<never>
      //
      // {
      //   fields: [],
      //   rows: [],
      //   command: 'INSERT',
      //   rowCount: 1,
      //   rowAsArray: false,
      //   viaNeonFetch: true,
      //   _parsers: [],
      //   _types: TypeOverrides {
      //     _types: {
      //       getTypeParser: [Function: getTypeParser],
      //       setTypeParser: [Function: setTypeParser],
      //       arrayParser: [Object],
      //       builtins: [Object]
      //     },
      //     text: {},
      //     binary: {}
      //   }
      // }
      //
      // To get the actual data back chain on .returning()
      //
      //   [
      //     {
      //       id: 'd5f49176-653c-44b0-8d02-b9b11dd19eb3',
      //       email: 'fred@example.com',
      //       username: 'Fred',
      //       password: '12345',
      //       createdAt: 2026-01-01T18:02:40.409Z,
      //       updatedAt: 2026-01-01T18:02:40.409Z
      //     }
      //   ]
      //
      // Then you need to pick out object from result: result[0]
      //
      /////////////////////////
      //
      // If you're coming from Prisma, this may seem a bit weird.
      // Prisma has a lot of convenience methods that get generated for you,
      // so you can simply do things like this:
      //
      //   const result = await prisma.user.create({ ... })
      //
      // However, the syntax in Drizzle is slightly more verbose and and reflects
      // a intentionally different design philosophy. Drizzle's philosophy is
      // "If you know SQL, you know Drizzle ORM" - it mirrors SQL in its API
      // while Prisma provides a higher-level abstraction designed with common
      // application development tasks in mind.
      //
      // Drizzle is more verbose because:
      //
      //   1. No code generation - Drizzle uses TypeScript inference directly from your schema.
      //      Prisma generates a custom client with methods like .create(), .update(), etc.
      //
      //   2. SQL-like operations - In SQL, you'd write INSERT INTO users ... RETURNING *.
      //      Drizzle mirrors this. There's no magic "create" method because there's no CREATE keyword in SQL.
      //
      //   3. Explicit over implicit - Drizzle is designed as a thin, type-safe wrapper around SQL
      //      The .returning() call and array index access are explicit representations of what's
      //      happening at the database level.
      //
      ///////////////////////////////////////////////////////////////////////////
      const result = await db
        .insert(UserTable)
        .values({ username, email, password })
        .returning(safeUserFields)

      // .onConflictDoUpdate() | .onConflictDoNothing()

      // At this point, you can safely assume that result[0] exists
      // The result array would only be empty if you use:
      // ON CONFLICT DO NOTHING and a conflict occurs.

      return {
        code: codes.CREATED,
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
