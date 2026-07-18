import * as React from 'react'
import { toast } from 'sonner'
import { Form } from '@base-ui/react/form'
import { z } from 'zod'
import { TriangleAlert } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'
import { InputPassword } from '@/components/InputPassword'
import { cn, formatZodErrors } from '@/utils'

//! This is wrong!
type UpdatePasswordFormProps = React.ComponentProps<'form'>

/* ======================
      Zod Schema
====================== */

const NewPasswordSchema = z
  .string()
  .min(1, {
    abort: true,
    error: 'Password is required'
  })
  .min(8, {
    abort: true,
    error: 'Password must be at least 8 characters long'
  })
  .max(50, {
    abort: true,
    error: 'Password must be 50 characters or fewer'
  })
  // Matches "anything that isn't a letter or digit"
  .regex(/[a-zA-Z]/, {
    error: 'Password must contain at least one letter'
  })
  .regex(/[0-9]/, { error: 'Password must contain at least one number' })
  // Matches "anything that isn't a letter or digit"
  .regex(/[^a-zA-Z0-9]/, {
    error: 'Password must contain at least one special character.'
  })

const getConfirmNewPasswordSchema = (newPassword: unknown) => {
  const ConfirmNewPasswordSchema = z
    .string()
    .min(8, {
      error: 'Must be at least 8 characters long'
    })
    ///////////////////////////////////////////////////////////////////////////
    //
    // Note: It's often easier to append the .refine() to the outside of the z.object():
    //
    //   .refine(
    //     ({ password, confirmPassword }) => {
    //       return password === confirmPassword
    //     },
    //     {
    //       error: 'The passwords must match.',
    //       path: ['confirmPassword']
    //     }
    //   )
    //
    // In most cases that would work fine. However, if any of the fields implement
    // an abort:true configuration and are invalid, they will always short-circuit
    // the outer .refine(). For this reason, it's often a more flexible solution to
    // append the .refine() to the actual field. The trade-off is that validating the
    // password becomes more complicated because we actually need to be in scope
    // - hence the use of getFormSchema() function.
    //
    ///////////////////////////////////////////////////////////////////////////
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
    currentPassword: z.string().min(1, { error: 'Password is required' }),
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

export const UpdatePasswordForm = ({
  className = '',
  ...otherProps
}: UpdatePasswordFormProps) => {
  /* ======================
        state & refs
  ====================== */

  const actionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [currentPassword, setCurrentPassword] = React.useState('')
  const [currentPasswordTouched, setCurrentPasswordTouched] =
    React.useState(false)

  const [newPassword, setNewPassword] = React.useState('')
  const [newPasswordTouched, setNewPasswordTouched] = React.useState(false)

  const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
  const [confirmNewPasswordTouched, setConfirmNewPasswordTouched] =
    React.useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})
  const isErrors = Object.values(errors).some((value) => !!value)

  const [formPending, setFormPending] = React.useState(false)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Calling setErrors({}) and setting each field's state value to '' is not enough
  // to reset the form. The main issue with Base UI is that it never really resets
  // the field control to its initial state because internally it uses the Constraint Validation API.
  // The consequence is that even if you clear all errors, you'll still have a data-valid attribute
  // on the input, rather than nothing. One solution to this is to reset the key prop on <Form />
  // to completely remount the Form and all children.
  //
  ///////////////////////////////////////////////////////////////////////////
  const [resetKey, setResetKey] = React.useState(0)

  const FormSchema = getFormSchema(newPassword)

  /* ======================
  validateCurrentPassword()
  ====================== */

  const validateCurrentPassword = (value?: string) => {
    value = typeof value === 'string' ? value : currentPassword
    const validationResult = FormSchema.shape.currentPassword.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            currentPassword: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.currentPassword
      return newErrors
    })
  }

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
    setFormPending(true)

    try {
      // https://better-auth.com/docs/authentication/email-password#update-password
      const result = await authClient.changePassword({
        currentPassword: zodData.currentPassword,
        newPassword: zodData.newPassword,

        // When true, the user will be logged out of their other sessions.
        // This is a good idea for security because changing a password is
        // often done to prevent a security breach. WDS makes this a checkbox
        // that the user can opt into. However, I've hardcoded it here for now.
        revokeOtherSessions: true
      })

      const { data, error } = result

      if (error) {
        ///////////////////////////////////////////////////////////////////////////
        //
        // ⚠️ When authClient.changePassword() is called, Better Auth looks up the session's user ID,
        // queries all their accounts, filters for one with providerId === "credential", and throws
        // immediately if none is found.
        //
        //   {
        //     message: 'Credential account not found',
        //     code: 'CREDENTIAL_ACCOUNT_NOT_FOUND',
        //     status: 400,
        //     statusText: 'BAD_REQUEST'
        //   }
        //
        /////////////////////////
        //
        // If the user submits the wrong value for currentPassword, result.error will be:
        //
        //   {
        //     code: 'INVALID_PASSWORD',
        //     message: "Invalid password",
        //     status: 400,
        //     statusText: 'BAD_REQUEST'
        //   }
        //
        /////////////////////////
        //
        // An error here could also be due to any custom logic we have in auth.ts
        // for hooks.before + '/change-password'. There the APIError instance has
        // been intentionally crafted to output the exact same kind of result.error:
        //
        //   throw new APIError('BAD_REQUEST', {
        //     code: 'INVALID_PASSWORD',
        //     message: 'Invalid password'
        //   })
        //
        // Note: The custom logic in hooks.before will likely never result in an error
        // because we have very similar Zod logic here, which preemptively causes the
        // flow to return early. The hooks.before logic would generally only throw an
        // APIError if some user was trying to call '/change-password' DIRECTLY.
        //
        ///////////////////////////////////////////////////////////////////////////

        toast.error('Unable to update password.')
        return
      }

      if (data) {
        toast.success('Password updated.')
        return
      }
    } catch (_err) {
      toast.error('Unable to update password.')
    } finally {
      setFormPending(false)
      setCurrentPassword('')
      setCurrentPasswordTouched(false)
      setNewPassword('')
      setNewPasswordTouched(false)
      setConfirmNewPassword('')
      setConfirmNewPasswordTouched(false)
      setErrors({})
      setResetKey((v) => v + 1)
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <h2 className='text-primary mb-1 text-4xl font-black'>Update Password</h2>
      <Form
        {...otherProps}
        actionsRef={actionsRef}
        className={cn(
          'bg-card space-y-4 rounded-lg border p-4 shadow',
          className
        )}
        errors={errors}
        key={resetKey}
        noValidate
        onFormSubmit={async (_formValues, _eventDetails) => {
          // Set true on all toucher functions.
          // This is important in order to subsequently allow validation onChange.
          const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
            setCurrentPasswordTouched,
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
            currentPassword,
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
            touched: currentPasswordTouched
          }}

          inputProps={{
            autoCapitalize: 'none',
            // Browsers often ignore ❌ autoComplete='off'. Even with
            // 'new-password', Chrome still auto completes values.
            autoComplete: 'new-password',
            autoCorrect: 'off',
            spellCheck: false,
            fieldSize: 'sm',
            name: 'currentPassword',
            onBlur: (e) => {
              const value = e.target.value
              setCurrentPasswordTouched(true)
              validateCurrentPassword(value)
            },

            onValueChange: (newValue) => {
              setCurrentPassword(newValue)
              if (currentPasswordTouched) {
                validateCurrentPassword(newValue)
              }
            },
            placeholder: 'Current Password...',
            value: currentPassword
          }}

          fieldLabelProps={{
            children: 'Password',
            labelRequired: true
          }}
        />

        <InputPassword
          fieldRootProps={{
            touched: newPasswordTouched
          }}

          inputProps={{
            autoCapitalize: 'none',
            autoComplete: 'new-password',
            autoCorrect: 'off',
            spellCheck: false,
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
            'Saving...'
          ) : (
            'Save Changes'
          )}
        </Button>
      </Form>
    </>
  )
}
