import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TriangleAlert } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'
import { Input } from '@/components/Input'
import { formatZodErrors } from '@/utils'

/* ======================
      Zod Schema
====================== */

const FormSchema = z.object({
  email: z.email()
})

type ZodData = z.infer<typeof FormSchema>
type FormErrors = Partial<Record<keyof ZodData, string>>

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Resetting a password is a two-step process.
//
// 1. They sumbit their email and then receive a link at that email address.
// 2. They enter a new password, which happens on a separate page.
//
// Rather than having this as an actual page, in production just make it a modal.
// on the login page.
//
///////////////////////////////////////////////////////////////////////////

export const ForgotPasswordForm = () => {
  const formActionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [email, setEmail] = React.useState('')
  const [emailTouched, setEmailTouched] = React.useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})
  // const isErrors = Object.keys(errors).length > 0
  const isErrors = Object.values(errors).some((value) => !!value)

  const [formPending, startFormTransition] = React.useTransition()
  const [resetKey, setResetKey] = React.useState(0)

  /* ======================
      validateEmail()
  ====================== */

  const validateEmail = (value?: string): void => {
    value = typeof value === 'string' ? value : email
    const validationResult = FormSchema.shape.email.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            email: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.email
      return newErrors
    })
  }

  /* ======================

  ====================== */

  const handleSubmit = async (zodData: ZodData) => {
    startFormTransition(async () => {
      try {
        // If the email address exists, it sends the reset password email to the user
        // By "exists", we likely mean if it exists in our database.

        const result = await authClient.requestPasswordReset(
          {
            email: zodData.email,
            // fetchOptions: {},

            // Used by the sendResetPassword callback in auth.ts to redirect user back
            // to the application after they click on the link in the associated email.
            redirectTo: '/reset-password'
          },
          {
            // onRequest: (ctx) => {},
            // onResponse: (ctx) => {},
            // onSuccess: (ctx) => {},
            // onError: (ctx) => {}
          }
        )

        const { data, error } = result

        if (error) {
          toast.error('Unable to send password reset email.', {
            // duration: Infinity
          })
          return
        }

        if (data) {
          // If no email account exists in the database for the given password,
          // Better Auth will not throw an error. It will simply silently do nothing.
          // Instead, it will always succeed, even if there is no such email in the database.
          // This is an intentional desing decision by Better Auth to be opaque.
          // That's why I added the caveat in the toast.
          // Coding In Flow discusses this  at 1:12:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
          toast.success(
            'If account exists for associated email, the password reset email was sent.'
          )
          return
        }
      } catch (_err) {
        toast.error('Unable to send password reset email.')
      } finally {
        setEmail('')
        setEmailTouched(false)
        setErrors({})
        setResetKey((v) => v + 1)
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <Form
        actionsRef={formActionsRef}
        className='bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow'
        errors={errors}
        key={resetKey}
        noValidate

        onFormSubmit={async (_formValues, _eventDetails) => {
          // Set true on all toucher functions.
          // This is important in order to subsequently allow validation onChange.
          const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
            setEmailTouched
          ]
          touchers.forEach((toucher) => {
            toucher(true)
          })

          // Validation...
          const {
            data: zodData,
            error: zodError,
            success: zodSuccess
          } = await FormSchema.safeParseAsync({
            email
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
        <Input
          fieldRootProps={{
            // This is just to explicitly show its not depending on forceValidity.
            forceValidity: false,
            touched: emailTouched
          }}

          fieldLabelProps={{
            children: 'Email',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'email',
            type: 'email',
            onBlur: (e) => {
              const value = e.target.value
              setEmailTouched(true)
              validateEmail(value)
            },
            onValueChange: (newValue) => {
              setEmail(newValue)
              if (emailTouched) {
                validateEmail(newValue)
              }
            },
            placeholder: 'Email...',
            value: email
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
            'Sending Reset Password Email...'
          ) : (
            'Send Reset Password Email'
          )}
        </Button>
      </Form>
    </>
  )
}
