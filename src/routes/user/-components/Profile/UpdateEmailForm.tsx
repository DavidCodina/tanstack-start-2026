'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
// import { z } from 'zod'

import { Button } from '@/components'
import { Input } from '@/components/Input'
import { cn } from '@/utils'

type UpdateEmailFormProps = React.ComponentProps<'form'> & {
  currentEmail: string
}

// const updateEmailSchema = z.object({
//   newEmail: z.email({ message: 'Enter a valid email' })
// })

// type UpdateEmailValues = z.infer<typeof updateEmailSchema>

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

//# Here we 100% need to have a confirm email field.
//# Otherwise, there's an increased risk that the user will inadvertently
//# update the email to the WRONG email and then get locked out.

//# Test what happens if we try to assign an email that already exists on another user.

export const UpdateEmailForm = ({
  className = '',
  currentEmail = '',
  ...otherProps
}: UpdateEmailFormProps) => {
  const [newEmail, setNewEmail] = React.useState(() => {
    if (currentEmail && typeof currentEmail === 'string') {
      return currentEmail
    }
    return ''
  })

  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleUpdateEmail = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    // We could do this, but what if we wanted to update the image, but not the email?
    // if (newEmail === currentEmail) {
    //   toast.error("You can't use the same email address.")
    //   return
    // }

    //# Validation!!!
    if (!newEmail) {
      return
    }

    setPending(true)

    try {
      // This works against OAuth or credential signups. Changing email
      // for a user with an Oath account does not break the login flow.
      const { data, error } = await authClient.changeEmail({
        newEmail,
        callbackURL: '/user?email_updated=true'
      })

      if (error) {
        ///////////////////////////////////////////////////////////////////////////
        //
        // If the newEmail is submitted and it matches the current email, then an
        // error will occur:
        // {message: 'Email is the same', status: 400, statusText: 'BAD_REQUEST'}
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
        toast.success(
          "If this email isn't already associated with an account, we've sent a confirmation link to it."
        )
        return
      }
    } catch (_err) {
      toast.error('Unable to send email verification.')
    } finally {
      setPending(false)
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
      <form
        {...otherProps}
        onSubmit={(e) => e.preventDefault()}
        className={cn(
          'bg-card space-y-4 rounded-lg border p-4 shadow',
          className
        )}
        noValidate
      >
        <Input
          fieldRootProps={{}}

          inputProps={{
            fieldSize: 'sm',
            name: 'email',
            type: 'text',
            onValueChange: (newValue) => {
              setNewEmail(newValue)
            },
            placeholder: 'Email...',
            value: newEmail
          }}

          fieldLabelProps={{
            children: 'Email',
            labelRequired: true
          }}
        />

        <Button
          className='flex w-full'
          loading={pending}
          onClick={handleUpdateEmail}
          size='sm'
          type='button'
        >
          {pending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </>
  )
}
