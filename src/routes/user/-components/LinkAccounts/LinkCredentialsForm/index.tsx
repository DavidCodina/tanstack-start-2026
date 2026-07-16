import * as React from 'react'
import { toast } from 'sonner'

import { linkCredentials } from './linkCredentials'
import { Button } from '@/components'
import { InputPassword } from '@/components/InputPassword'
import { cn } from '@/utils'

type SetPasswordFormProps = {
  className?: string
  onSuccess: () => void
}

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

//# Add Form, and password validation.
//# Add confirmPassword field.

export const LinkCredentialsForm = ({
  className = '',
  onSuccess
}: SetPasswordFormProps) => {
  const [newPassword, setNewPassword] = React.useState('')
  const [pending, startTransition] = React.useTransition()

  /* ======================

  ====================== */

  const handleLinkCredentials = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    //# Use the same Zod schema as is being used currently by linkCredentials.
    if (!newPassword || typeof newPassword !== 'string') {
      toast.error('Email is required.')
      setNewPassword('')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      setNewPassword('')
      return
    }

    startTransition(async () => {
      try {
        // ⚠️ setPassword can't be called from the client for security reasons.
        const { code, success } = await linkCredentials({
          data: {
            password: newPassword,
            confirmPassword: newPassword
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
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn('flex max-w-sm flex-wrap items-end gap-2', className)}
      noValidate
    >
      <InputPassword
        fieldLabelProps={{
          children: 'Password',
          labelRequired: true
        }}

        fieldRootProps={{
          className: 'flex-1'
        }}

        inputProps={{
          fieldSize: 'sm',
          name: 'newPassword',
          onValueChange: (newValue) => {
            setNewPassword(newValue)
          },
          placeholder: 'New Password...',
          value: newPassword
        }}
      />

      <Button
        className='flex'
        loading={pending}
        onClick={handleLinkCredentials}
        size='sm'
        type='button'
      >
        {pending ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
