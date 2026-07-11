import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { APIError } from 'better-auth/api'

import type { ResponsePromise } from '@/types'

import { auth } from '@/lib/auth'
import { codes, formatZodErrors, sleep } from '@/utils'

const getLinkCredentialsSchema = (password: unknown) => {
  const LinkCredentialsSchema = z.object({
    password: z.string().min(5, {
      message: 'A password must be at least 5 characters. (Server)'
    }),
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

  return LinkCredentialsSchema
}

type LinkCredentialsSchemaType = ReturnType<typeof getLinkCredentialsSchema>

type LinkCredentialsInput = z.infer<LinkCredentialsSchemaType>

type Data = null
type LinkCredentialsResponsePromise = ResponsePromise<Data>

/* ========================================================================
     
======================================================================== */

export const linkCredentials = createServerFn({
  method: 'POST'
})
  .inputValidator((input: LinkCredentialsInput) => input)

  .handler(async (ctx): LinkCredentialsResponsePromise => {
    await sleep(1500)
    const { data } = ctx

    const dataPassword =
      data && typeof data === 'object' && 'password' in data
        ? data.password
        : undefined

    const LinkCredentialsSchema = getLinkCredentialsSchema(dataPassword)
    const validationResult = LinkCredentialsSchema.safeParse(data)

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
    const { password } = validationResult.data

    try {
      const headers = getRequestHeaders()

      /* const _result = */ await auth.api.setPassword({
        body: { newPassword: password },
        headers: headers
      })

      /* ======================
              Response
      ====================== */

      return {
        code: codes.UPDATED,
        data: null,
        errors: null,
        message: 'The password has been updated.',
        success: true
      }
    } catch (err) {
      if (err instanceof APIError) {
        // ...
      }

      if (err instanceof Error) {
        //^ Better Auth enforces longer passwords by default, so use: 12345678
        // Example: { name: 'APIError', message: 'Password too short' }
        // console.log({ name: err.name, message: err.message })
      }
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'Server error.',
        success: false
      }
    }
  })

export type LinkCredentialsResponseBody = Awaited<
  ReturnType<typeof linkCredentials>
>
