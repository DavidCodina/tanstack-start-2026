import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { APIError } from 'better-auth/api'

import type { ResponsePromise } from '@/types'

import { auth } from '@/lib/auth'
import { codes, formatZodErrors, sleep } from '@/utils'

const NewPasswordSchema = z
  .string()
  .min(1, { error: 'Password is required' })
  .min(8, { error: 'Password must be at least 8 characters long' })
  .max(50, {
    error: 'Password must be 50 characters or fewer'
  })
  // Matches "anything that isn't a letter or digit"
  .regex(/[a-zA-Z]/, {
    message: 'Password must contain at least one letter'
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  // Matches "anything that isn't a letter or digit"
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character.'
  })

const getConfirmNewPasswordSchema = (newPassword: unknown) => {
  const ConfirmNewPasswordSchema = z
    .string()
    .min(8, {
      error: 'Must be at least 8 characters long'
    })
    .refine(
      (value) => {
        return value === newPassword
      },
      { error: 'The passwords must match.' }
    )
  return ConfirmNewPasswordSchema
}

const getInputSchema = (newPassword: unknown) => {
  const InputSchema = z.object({
    newPassword: NewPasswordSchema,
    confirmNewPassword: getConfirmNewPasswordSchema(newPassword)
  })
  return InputSchema
}

type InputSchemaType = ReturnType<typeof getInputSchema>

type LinkCredentialsInput = z.infer<InputSchemaType>

type ResponseData = null
type LinkCredentialsResponsePromise = ResponsePromise<ResponseData>

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
      data && typeof data === 'object' && 'newPassword' in data
        ? data.newPassword
        : undefined

    const InputSchema = getInputSchema(dataPassword)
    const validationResult = InputSchema.safeParse(data)

    if (!validationResult.success) {
      const formattedErrors = formatZodErrors(validationResult.error)

      return {
        code: codes.BAD_REQUEST,
        data: null,
        errors: formattedErrors,
        message: 'The data failed validation.',
        success: false
      }
    }

    // Always use sanitized data from Zod here.
    const { newPassword } = validationResult.data

    try {
      const headers = getRequestHeaders()

      // https://better-auth.com/docs/concepts/users-accounts#set-password
      await auth.api.setPassword({
        body: { newPassword: newPassword },
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
        if (err.body?.code === 'INVALID_PASSWORD') {
          return {
            code: codes.INVALID_PASSWORD,
            data: null,
            message: 'Invalid password',
            success: false
          }
        }
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
