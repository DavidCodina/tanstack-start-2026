import * as React from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Form } from '@base-ui/react/form'
import { z } from 'zod'
import { AlertCircle, TriangleAlert } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Alert, Button } from '@/components'
import { InputPassword } from '@/components/InputPassword'
import { formatZodErrors } from '@/utils'

/* ======================
      Zod Schema
====================== */

const NewPasswordSchema = z
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

const getFormSchema = (newPassword: unknown) => {
  const FormSchema = z.object({
    newPassword: NewPasswordSchema,
    confirmNewPassword: getConfirmNewPasswordSchema(newPassword)
  })
  return FormSchema
}

type FormSchemaType = ReturnType<typeof getFormSchema>
type ZodData = z.infer<FormSchemaType>
// type LooseFormErrors = Record<string, string>
// type FormErrors = { [K in keyof ZodData]?: string; }
type FormErrors = Partial<Record<keyof ZodData, string>>

/* ========================================================================

======================================================================== */

export const ResetPasswordForm = () => {
  const navigate = useNavigate()
  // If the token is expired, the redirectTo URL will comeback with
  // an error search param instead of a token search param.
  // http://localhost:3000/reset-password?error=INVALID_TOKEN

  //# Rather than using type assertion here, the more idiomatic approach is to type
  //# the params on the page component.
  const { /* error, */ token } = useSearch({ strict: false }) as unknown as {
    token?: string
    error?: string
  }

  /* ======================
        state & refs
  ====================== */

  const actionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [newPassword, setNewPassword] = React.useState('')
  const [newPasswordTouched, setNewPasswordTouched] = React.useState(false)

  const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
  const [confirmNewPasswordTouched, setConfirmNewPasswordTouched] =
    React.useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})
  const isErrors = Object.values(errors).some((value) => !!value)

  const [formPending, startFormTransition] = React.useTransition()
  const [resetKey, setResetKey] = React.useState(0)

  const FormSchema = getFormSchema(newPassword)

  /* ======================
    validateNewPassword()
  ====================== */

  const validateNewPassword = (value?: string) => {
    value = typeof value === 'string' ? value : newPassword
    const validationResult = FormSchema.shape.newPassword.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            newPassword: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.newPassword
      return newErrors
    })
  }

  /* ======================
  validateNewPasswordPlusConfirmPassword()
  ====================== */
  // This validation helper is one approach to solving synchronization between
  // newPassword and confirmNewPassword. However, it's overly complex and there
  // are easier solutions.

  const _validateNewPasswordPlusConfirmPassword = (value?: string) => {
    value = typeof value === 'string' ? value : newPassword

    if (confirmNewPasswordTouched) {
      const FreshFormSchema = getFormSchema(value)

      const { error: zodError, success: zodSuccess } =
        FreshFormSchema.safeParse({
          newPassword: value,
          confirmNewPassword: confirmNewPassword
        })

      if (!zodSuccess) {
        const formattedZodErrors = formatZodErrors(zodError)

        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            ...formattedZodErrors
          }

          if (!formattedZodErrors.newPassword) {
            delete newErrors.newPassword
          }

          if (!formattedZodErrors.confirmNewPassword) {
            delete newErrors.confirmNewPassword
          }

          return newErrors
        })
      } else if (zodSuccess) {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev
          }

          delete newErrors.newPassword
          delete newErrors.confirmNewPassword

          return newErrors
        })
      }

      return
    }

    /* =================== */

    const validationResult = FormSchema.shape.newPassword.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            newPassword: error
          }

          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.newPassword
      return newErrors
    })
  }

  /* ======================
  validateConfirmNewPassword()
  ====================== */

  const validateConfirmNewPassword = (value?: string, newPass?: string) => {
    value = typeof value === 'string' ? value : confirmNewPassword
    newPass = typeof newPass === 'string' ? newPass : newPassword

    const FreshConfirmNewPasswordSchema = getConfirmNewPasswordSchema(newPass)
    const validationResult = FreshConfirmNewPasswordSchema.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            confirmNewPassword: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.confirmNewPassword
      return newErrors
    })
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (zodData: ZodData) => {
    startFormTransition(async () => {
      try {
        const result = await authClient.resetPassword({
          newPassword: zodData.newPassword,

          token
        })

        const { data, error } = result

        if (error) {
          // Example: if we did this: http://localhost:3000/reset-password?token=abc123
          // Then we'd get back: {message: 'Invalid token', code: 'INVALID_TOKEN', status: 400, statusText: 'BAD_REQUEST'}
          // console.log('error from ResetPasswordForm', error)

          toast.error('Unable to reset password.')
          return
        }
        if (data) {
          toast.success('Password reset success.')
          navigate({ to: '/user' })
          return
        }
      } catch (_err) {
        toast.error('Unable to reset password.')
      } finally {
        setNewPassword('')
        setNewPasswordTouched(false)
        setConfirmNewPassword('')
        setConfirmNewPasswordTouched(false)
        setErrors({})
        setResetKey((v) => v + 1)
      }
    })
  }

  /* ======================
        rendeForm()
  ====================== */

  const renderForm = () => {
    if (token && typeof token === 'string') {
      return (
        <Form
          actionsRef={actionsRef}
          className='bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow'
          errors={errors}
          key={resetKey}
          noValidate
          onFormSubmit={async (_formValues, _eventDetails) => {
            // A missing token is already handled by what UI. Doing it here also is still a good practice.
            if (!token || typeof token !== 'string') {
              toast.error(
                'Email verification is required prior to resetting password.'
              )
              return
            }

            // Validation...
            const {
              data: zodData,
              error: zodError,
              success: zodSuccess
            } = await FormSchema.safeParseAsync({
              newPassword,
              confirmNewPassword
            })

            if (!zodSuccess) {
              const formattedZodErrors = formatZodErrors(zodError)
              setErrors(formattedZodErrors)
              return
            }

            // Submission...
            handleSubmit(zodData)
          }}

          // I don't think this is necessary if we're using onFormSubmit.
          onSubmit={(e) => e.preventDefault()}
          ref={formRef}
          validationMode='onBlur'
        >
          <InputPassword
            fieldRootProps={{
              touched: newPasswordTouched
            }}

            inputProps={{
              autoCapitalize: 'none',
              // Browsers often ignore ❌ autoComplete='off'. Even with
              // 'new-password', Chrome still auto completes values.
              autoComplete: 'new-password',
              autoCorrect: 'off',

              fieldSize: 'sm',
              name: 'newPassword',
              onBlur: (e) => {
                const value = e.target.value
                setNewPasswordTouched(true)
                validateNewPassword(value)
              },

              onValueChange: (newValue) => {
                setNewPassword(newValue)
                if (newPasswordTouched) {
                  // ⚠️ Gotcha: The confirmPassword validation also needs to run after every time newPassword
                  // changes. One way to achieve this is by executing validateNewPasswordPlusConfirmPassword.
                  // However, the logic necessary for that is a bit complex.
                  validateNewPassword(newValue)
                }

                // An alternative approach is to simply call validateConfirmNewPassword().
                // However, there's a race condition here when setting newPassword state,
                // so we need to pass newValue directly to validateConfirmNewPassword().
                if (confirmNewPasswordTouched) {
                  validateConfirmNewPassword(undefined, newValue)
                }
              },
              placeholder: 'New Password...',
              spellCheck: false,
              type: 'password',
              value: newPassword
            }}

            fieldLabelProps={{
              children: 'New Password',
              labelRequired: true
            }}
          />

          <InputPassword
            fieldRootProps={{
              touched: confirmNewPasswordTouched
            }}

            inputProps={{
              autoCapitalize: 'none',
              autoComplete: 'new-password',
              autoCorrect: 'off',
              spellCheck: false,
              fieldSize: 'sm',
              name: 'confirmNewPassword',
              onBlur: (e) => {
                const value = e.target.value
                setConfirmNewPasswordTouched(true)
                validateConfirmNewPassword(value)
              },
              onValueChange: (newValue) => {
                setConfirmNewPassword(newValue)
                if (confirmNewPasswordTouched) {
                  validateConfirmNewPassword(newValue)
                }
              },
              placeholder: 'Confirm New Password...',
              type: 'password',
              value: confirmNewPassword
            }}

            fieldLabelProps={{
              children: 'Confirm New Password',
              labelRequired: true
            }}
          />

          <Button
            className='flex w-full'
            disabled={isErrors}
            loading={formPending}
            size='sm'
            type='submit'
            variant={isErrors ? 'destructive' : 'primary'}
          >
            {isErrors ? (
              <>
                <TriangleAlert /> Please Correct Errors...
              </>
            ) : formPending ? (
              'Resetting Password...'
            ) : (
              'Reset Password'
            )}
          </Button>
        </Form>
      )
    }

    /////////////////////////////////////////////////////////////////////////////
    //
    // In practice, you won't receive an invalid token in the URL.
    // Instead, what actually happens is that the redirectTo URL will
    // append an error if the token has expired or is invalid for some
    // other reason (e.g., it's already been used).
    //
    //   http://localhost:3000/reset-password?error=INVALID_TOKEN
    //
    // However, all the UI needs to know here is that there's no token.
    //
    /////////////////////////////////////////////////////////////////////////////

    return (
      <Alert
        className='mx-auto my-6 max-w-[800px]'
        leftSection={<AlertCircle className='size-6' />}
        title={'Error'}
        variant={'destructive'}
      >
        The token for the reset link is missing or invalid. Make sure you
        received the email with the reset password link.
      </Alert>
    )
  }

  /* ======================
          return
  ====================== */

  return renderForm()
}
