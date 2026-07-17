import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TriangleAlert } from 'lucide-react'

import { linkCredentials } from './linkCredentials'
import { Button } from '@/components'
import { InputPassword } from '@/components/InputPassword'
import { cn, formatZodErrors } from '@/utils'

//! This is wrong!
type SetPasswordFormProps = {
  className?: string
  onSuccess: () => void
}

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
type FormErrors = Partial<Record<keyof ZodData, string>>

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: In CreatePasswordButton, we use: authClient.requestPasswordReset()
// However, here in linkCredentials  we use auth.api.setPassword(). In other words,
// we're not asking the user to verify their email address. Instead, we're just
// using the user.email already on the user record.
//
// ⚠️ setPassword() trusts the session alone as sufficient authority to attach a new,
// attacker-chosen credential to the account. If a session is hijacked (XSS, malware,
// leaked cookie, unattended device, etc.), the attacker doesn't need to know the
// current password or have any other proof of identity — they just need the live
// session token, and they can plant a password of their choosing.
//
// Doing this is less secure! If someone got a hold of the session they could hijack it,
// add a password, and unlink all other accounts. However, if there was email
// verification then the user would likely not be able to change the password because they
// wouldn't have access to the actual user's email.
//
// Conceptually, the whole idea of having this form + the linkCredentials server function
// is the wrong approach. Instead, if we want to add a credential account in the account
// linking section of the UI we should just use the CreatePasswordButton, or something similar
// to kicks off the request password reset flow.
//
// TL;DR: This whole form is now redundant once you accept the security conclusion. If setting
// a password requires email verification (which we established it should), then there's no
// reason to also collect a password directly in this form and pass it to a server function
// that sets it immediately. The two flows are trying to do the same job, and only
// CreatePasswordButton's flow is the correct one.
//
/////////////////////////
//
// But this brings up a larger concern. What about if we let the user link social accounts?
// Isn't that inherently insecure as well? Let's say someone got a hold of the session,
// couldn't they just link their own OAuth account, then unlink the original accounts
// from the actual user? Yes!
//
// Generally speaking, I have serious reservations about account linking... Conceptually, this feels dangerous to me. In practice,
// if someone got a hold of our session, couldn't they link their own OAuth account, then unlink all
// of the other accounts? This would result in a full takeover and lock out.
//
// ⚠️ This is a real and well-known vulnerability pattern, not just paranoia. It's sometimes called a
// "parasitic account linking" attack, and it's exactly the scenario you'd get with allowDifferentEmails: true
// combined with session-based linking.
//
///////////////////////////////////////////////////////////////////////////

export const LinkCredentialsForm = ({
  className = '',
  onSuccess
}: SetPasswordFormProps) => {
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

  const validateNewPassword = (value?: string): void => {
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
  validateConfirmNewPassword()
  ====================== */

  const validateConfirmNewPassword = (
    value?: string,
    newPass?: string
  ): void => {
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
        // ⚠️ setPassword can't be called from the client for security reasons.
        const { code, success } = await linkCredentials({
          data: {
            newPassword: zodData.newPassword,
            confirmNewPassword: zodData.confirmNewPassword
          }
        })

        if (success !== true) {
          if (code === 'INVALID_PASSWORD') {
            toast.error('Invalid password')
            return
          }

          toast.error('Unable to set password.')
        } else if (success === true) {
          onSuccess?.()
          toast.success('Password set success.')
        }
      } catch (_err) {
        toast.error('Unable to set password.')
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
          return
  ====================== */

  return (
    <Form
      actionsRef={actionsRef}
      className={cn('bg-card space-y-4 rounded-lg border p-4', className)}
      errors={errors}
      key={resetKey}
      noValidate

      onFormSubmit={async (_formValues, _eventDetails) => {
        // Set true on all toucher functions.
        // This is important in order to subsequently allow validation onChange.
        const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
          setNewPasswordTouched,
          setConfirmNewPasswordTouched
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
        fieldLabelProps={{
          children: 'New Password',
          labelRequired: true
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
              validateNewPassword(newValue)
            }

            // ⚠️ Gotcha: confirmNewPassword validation also needs to run after every time newPassword changes.
            if (confirmNewPasswordTouched) {
              validateConfirmNewPassword(undefined, newValue)
            }
          },
          placeholder: 'New Password...',
          spellCheck: false,
          value: newPassword
        }}
      />

      <InputPassword
        fieldRootProps={{
          touched: confirmNewPasswordTouched
        }}

        fieldLabelProps={{
          children: 'Confirm New Password',
          labelRequired: true
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
          value: confirmNewPassword
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
          'Adding Credential Account...'
        ) : (
          'Add Credential Account'
        )}
      </Button>
    </Form>
  )
}
