import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TriangleAlert } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'
import { Input } from '@/components/Input'
import { cn, formatZodErrors } from '@/utils'

type UpdateEmailFormProps = Form.Props & {
  currentEmail: string
}

/* ======================
      Zod Schema
====================== */

const getNewEmailSchema = (currentEmail: unknown) => {
  const NewEmailSchema = z.email().refine(
    (value) => {
      return value !== currentEmail
    },
    {
      error: 'The email is the same.'
    }
  )

  return NewEmailSchema
}
const getFormSchema = (currentEmail: unknown) => {
  const FormSchema = z.object({
    newEmail: getNewEmailSchema(currentEmail)
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
// ✅ Coding in Flow at 1:47:30 : https://www.youtube.com/watch?v=w5Emwt3nuV0
// ✅ WDS at 2:02:45            : https://www.youtube.com/watch?v=WPiqNDapQrk
//    Instead of having multiple separate forms, Kyle combines logic for
//    UpdateUserForm and UpdateEmailForm into a single form that makes multiple
//    API calls within the submit handler. However, in that case he preemptively
//    ensures that he never call authClient.changeEmail(), if it's still the
//    current email.
//
// https://better-auth.com/docs/concepts/users-accounts#change-email
//
///////////////////////////////////////////////////////////////////////////

//# The Better Auth implementation is already using sendChangeEmailConfirmation in auth.ts
//# However, it may still be useful for there to be a confirmEmail field in order to prevent
//# wrong emails. Ask AI if this is being too defensive.

//# Test what happens if we try to assign an email that already exists on another user.

export const UpdateEmailForm = ({
  className = '',
  currentEmail = '',
  ...otherProps
}: UpdateEmailFormProps) => {
  /* ======================
        state & refs
  ====================== */

  const formActionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [newEmail, setNewEmail] = React.useState(() => {
    if (currentEmail && typeof currentEmail === 'string') {
      return currentEmail
    }
    return ''
  })
  const [newEmailTouched, setNewEmailTouched] = React.useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})
  // const isErrors = Object.keys(errors).length > 0
  const isErrors = Object.values(errors).some((value) => !!value)

  const [formPending, setFormPending] = React.useState(false)
  const [resetKey, setResetKey] = React.useState(0)

  const FormSchema = getFormSchema(currentEmail)

  /* ======================
      validateNewEmail()
  ====================== */

  const validateNewEmail = (value?: string): void => {
    value = typeof value === 'string' ? value : newEmail
    const validationResult = FormSchema.shape.newEmail.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            newEmail: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.newEmail
      return newErrors
    })
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (zodData: ZodData) => {
    setFormPending(true)

    try {
      // This works against OAuth or credential signups. Changing email
      // for a user with an Oath account does not break the login flow.
      const { data, error } = await authClient.changeEmail({
        newEmail: zodData.newEmail,
        // Do this if you're NOT using sendChangeEmailConfirmation in auth.ts
        // callbackURL: '/user?email_updated=true'
        // Otherwise, use the /email-change-status route.
        callbackURL: '/email-change-status?new_email=' + zodData.newEmail
      })

      if (error) {
        ///////////////////////////////////////////////////////////////////////////
        //
        // If the newEmail is submitted and it matches the current email, then an
        // error will occur:
        //
        //   {message: 'Email is the same', status: 400, statusText: 'BAD_REQUEST'}
        //
        ///////////////////////////////////////////////////////////////////////////

        if (error.message === 'Email is the same') {
          toast.error(error.message)
          return
        }

        ///////////////////////////////////////////////////////////////////////////
        //
        // Note: If a user attempts to submit a newEmail that already exists on another user,
        // it will not error out, and instead silently do nothing (i.e., no verification email sent).
        // This is a deliberate anti-enumeration measure on behalf of Better Auth.
        //
        //   https://better-auth.com/docs/authentication/email-password#email-enumeration-protection
        //   the /change-email endpoint no longer reveals whether the target email is already registered
        //   — it always returns a success response.
        //
        // Returning an erro when the email belongs to another user would let an attacker probe the users
        // table by trying changeEmail with a list of guessed addresses and watching for the error.
        // That's a classic email-enumeration vulnerability. So instead, Better Auth swallows it silently:
        // no error, no verification email sent, but the client sees a "successful" response. This mirrors
        // the same pattern they use on sign-up when requireEmailVerification is on — the sign-up endpoint
        // prevents email enumeration by returning the same 200 response whether the email is already registered
        // or not, following OWASP authentication best practices.
        //
        ///////////////////////////////////////////////////////////////////////////
        toast.error('Unable to send email verification.')

        return
      }

      if (data) {
        // The trade-off for the security measure above is that we can't rely on the API
        // response to tell the user "that email is taken."
        // toast.success(
        //   "If the email isn't already associated with an account, we've sent a confirmation link to it."
        // )

        toast.success(
          'A confirmation link has been sent to your current email.'
        )
        return
      }
    } catch (_err) {
      toast.error('Unable to send email verification.')
    } finally {
      setFormPending(false)
      // Not necessary to clear the email. The success flow entails sending an email
      // then redirecting back to a new tab/window.
      // setNewEmail('')
      setNewEmailTouched(false)
      setErrors({})
      setResetKey((v) => v + 1)
    }
  }

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, this component accepted the user as a prop, then did this:
  //
  //   React.useEffect(() => {
  //     if (user && user.email && typeof user.email === 'string') {
  //       setNewEmail(user.email)
  //     }
  //   }, [user])
  //
  // The problem above is that when authClient.changeEmail() fires, the authClient.useSession()
  // will be refreshed, and at this point the user will be a new reference object, even if
  // nothing has changed among the object properties.
  //
  ///////////////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    //! Don't fire on mount!
    if (currentEmail && typeof currentEmail === 'string') {
      setNewEmail(currentEmail) // eslint-disable-line
    }
  }, [currentEmail])

  /* ======================
          return
  ====================== */

  return (
    <>
      <h2 className='text-primary mb-1 text-4xl font-black'>Update Email</h2>
      <Form
        {...otherProps}
        actionsRef={formActionsRef}

        className={cn(
          'bg-card space-y-4 rounded-lg border p-4 shadow',
          className
        )}
        errors={errors}
        key={resetKey}
        noValidate

        onFormSubmit={async (_formValues, _eventDetails) => {
          // Set true on all toucher functions.
          // This is important in order to subsequently allow validation onChange.s
          const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
            setNewEmailTouched
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
            newEmail
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
            touched: newEmailTouched
          }}

          fieldLabelProps={{
            children: 'Email',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'newEmail',
            type: 'text',

            onBlur: (e) => {
              const value = e.target.value
              setNewEmailTouched(true)
              validateNewEmail(value)
            },
            onValueChange: (newValue) => {
              setNewEmail(newValue)
              if (newEmailTouched) {
                validateNewEmail(newValue)
              }
            },
            placeholder: 'Email...',
            value: newEmail
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
