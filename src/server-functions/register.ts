import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import { APIError } from 'better-auth/api'

import type { ResponsePromise } from '@/types'

import { db } from '@/db'
import { UserTable } from '@/db/schema'
import { auth } from '@/lib/auth'
import { codes, formatZodErrors } from '@/utils'

/* ======================
     
====================== */

const PasswordSchema = z
  .string()
  .min(1, { error: 'Password is required' })
  .min(8, { error: 'Password must be at least 8 characters long' })
  // Matches "anything that isn't a letter or digit"
  .regex(/[a-zA-Z]/, {
    message: 'Password must contain at least one letter'
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  // Matches "anything that isn't a letter or digit"
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character.'
  })

/* ======================
        Types
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Previously inferred from getRegisterSchema() function:
//
//   type RegisterSchemaType = ReturnType<typeof getRegisterSchema>
//   type RegisterSchemaInput = z.infer<RegisterSchemaType>
//
// But that's no longer possible becasue the function MUST be inside
// of the server function because of the server-side db logic.
//
///////////////////////////////////////////////////////////////////////////

type RegisterSchemaInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type Data = null
type RegisterResponsePromise = ResponsePromise<Data>

/* ========================================================================

======================================================================== */

export const register = createServerFn({
  method: 'POST'
})
  .inputValidator((input: RegisterSchemaInput) => input)

  .handler(async (ctx): RegisterResponsePromise => {
    // await sleep(1000)
    const { data } = ctx

    const dataPassword =
      data && typeof data === 'object' && 'password' in data
        ? data.password
        : undefined

    /* ======================
        getRegisterSchema()
    ====================== */
    // This can't be defined at the top level of the file. It needs to be
    // inside of the createServerFn because it has logic that runs on the server.

    const getRegisterSchema = (password: unknown) => {
      const RegisterSchema = z.object({
        name: z.string(),
        email: z

          // Could also use z.regex()
          // const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
          .email()

          .refine(
            async (email) => {
              ///////////////////////////////////////////////////////////////////////////
              //
              // ⚠️ Case Sensitivity: https://www.prisma.io/docs/orm/prisma-client/queries/case-sensitivity
              //
              // Note: if email is 'DAVID@example.com' but 'david@example.com' alread exists, Prisma will
              // throw a PrismaClientKnownRequestError because the uniqueness constraint will have failed.
              // In other words, uniqueness is not case insensitive. Similarly, when querying for a user by
              // email it will also be case insensitive by default.
              //
              // Apparently, Prisma queries are case-insensitive by default.
              // While Prisma's query language itself is case-sensitive by default, the underlying database
              // and its configuration can sometimes lead to case-insensitive behavior for certain operations.
              // Thus if you did this in MySQL workbench:
              //
              //   SELECT * from users WHERE email = "DAVID@example.com";
              //
              // You would likely get back the record with email 'david@example.com'.
              // In the case of MySQL, the case sensitivity of string comparisons is determined by the collation
              // of the column. Collation is a set of rules that define how character data is sorted and compared.
              //
              // While we can rely on that default behavior, it's still a good practice to explicitly specify
              // case-insensitivity at the level of Prisma. That said, findUnique() doesn't support the `mode`
              // option, so you'll need to use findFirst() instead.
              //
              //  const existingUser = await prisma.user.findUnique({ where: { email }  })
              //
              ///////////////////////////////////////////////////////////////////////////

              const [existingUser] = await db
                .select({ id: UserTable.id })
                .from(UserTable)

                .where(eq(sql`lower(${UserTable.email})`, email.toLowerCase()))
                .limit(1)

              return !existingUser
            },

            // 'Invalid email address' is the same as the default
            // error message for .email()
            { error: 'Invalid email address' }
          ),

        password: PasswordSchema,
        confirmPassword: z.string().refine(
          (value) => {
            return value === password
          },
          {
            error: 'The passwords must match. (Server)'
          }
        )
      })

      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ Gotcha: Having .refine() on the outside of the z.object() seems
      // like a good idea because it allows you to access both values.password
      // and values.confirmPassword. However, it will short-circuit
      // if there are any errors in z.object().
      //
      //   .refine((values) => values.password === values.confirmPassword, {
      //     message: 'Passwords do not match.',
      //     path: ['confirmPassword'] // attaches the error to this field
      //   })
      //
      // Solution: wrap the Zod schema in a functon and pass it the password from the
      // outside, or create a secondary schema just for the password confirmation.
      //
      ///////////////////////////////////////////////////////////////////////////

      return RegisterSchema
    }

    try {
      /* ======================
            Validation
      ====================== */
      // Inside try/catch because RegisterSchema makes a DB call.

      const RegisterSchema = getRegisterSchema(dataPassword)
      const validationResult = await RegisterSchema.safeParseAsync(data)

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

      // Always use sanitized data from Zod.
      const { name, email, password } = validationResult.data

      /* ======================
            Create User
      ====================== */
      ///////////////////////////////////////////////////////////////////////////
      //
      // The result will be an object that looks like this:
      //
      //   {
      //     token: '3OWZv...',
      //     user: {
      //       createdAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)',
      //       email: 'david@example.com',
      //       emailVerified: false,
      //       id: 'abc123',
      //       image: null,
      //       name: 'David Codina',
      //       updatedAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)'
      //     }
      //   }
      //
      ///////////////////////////////////////////////////////////////////////////

      const _result = await auth.api.signUpEmail({
        body: {
          email,
          // On the server side, Better Auth automatically hashes the password before
          // storing it in the database. You never see or handle the raw password after this point.
          password: password,
          name: name,
          // When using requireEmailVerification: true, it makes more sense to use callbackURL.
          // This will be where the user is redirected to. After they verify their email, a new
          // browser tab will open the application. On the other hand, if you're not using
          // email verification, it's preferable to programmatically navigate to the login page
          // on success.
          // I believe that this callback URL is only used when email verification is enabled.
          callbackURL: '/login?verified=true'
          // image?: string | undefined;
          // rememberMe?: boolean | undefined;
        }
      })

      /* ======================
             Response
      ====================== */

      return {
        code: codes.CREATED,
        data: null, // The client doesn't need { token, user }
        message: 'Registration success. Verification email sent.',
        success: true
      }
    } catch (err) {
      if (err instanceof APIError) {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Checking for instanceof APIError is especially if you're using hooks
        // in auth.ts to throw a custom error. For example:
        //
        //   hooks: {
        //     before: createAuthMiddleware(async (ctx) => {
        //       if (ctx.path === '/sign-up/email') {
        //         if (ctx.body.email === 'david@example.com') {
        //           throw new APIError('BAD_REQUEST', {
        //             code: 'EMAIL_BLACKLISTED',
        //             message: 'This email is blacklisted.'
        //           })
        //         }
        //       }
        //     })
        //   }
        //
        // Then respond accordingly. That said, since we're already on the server, we actually
        // don't need a hook for blacklisting, validation, etc.
        //
        ///////////////////////////////////////////////////////////////////////////

        if (err.body?.code === 'EMAIL_BLACKLISTED') {
          return {
            code: err.body.code,
            data: null,
            message: 'The email is blacklisted.',
            success: false
          }
        }
      }

      if (err instanceof Error) {
        // Better Auth enforces longer (8 character) passwords by default.
        // Example: { name: 'APIError', message: 'Password too short' }
        // console.log({ name: err.name, message: err.message })
      }
      return {
        code: 'INTERNAL_SERVER_ERROR',
        data: null,
        message: 'Server error.',
        success: false
      }
    }
  })
