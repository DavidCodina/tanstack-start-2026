'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

// import { z } from 'zod'

import { Button } from '@/components'
import { Input } from '@/components/Input'
import { cn } from '@/utils'

type UpdatePasswordFormProps = React.ComponentProps<'form'>

// const updatePasswordSchema = z.object({
//   currentPassword: z
//     .string()
//     .min(1, { message: "Current password is required" }),
//   newPassword: passwordSchema,
// });

// type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

/* ========================================================================

======================================================================== */

export const UpdatePasswordForm = ({
  className = '',
  ...otherProps
}: UpdatePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
  const [pending, setPending] = React.useState(false)

  /* ======================

  ====================== */

  const handleUpdatePassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    //# Add better validation here, including password confirmation match.
    //# The basic password schema is as follows. On top of that,
    // const PasswordSchema = z
    //   .string()
    //   .min(1, { error: 'Password is required' })
    //   .min(8, { error: 'Password must be at least 8 characters long' })
    //   .regex(/[a-zA-Z]/, {
    //     message: 'Password must contain at least one letter'
    //   })
    //   .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    //   // Matches "anything that isn't a letter or digit"
    //   .regex(/[^a-zA-Z0-9]/, {
    //     message: 'Password must contain at least one special character.'
    //   })

    //# On top of that, there should be logic for checking if the passwords match similar to this:
    // const getLinkCredentialsSchema = (password: unknown) => {
    //   const LinkCredentialsSchema = z.object({
    //     password: z.string().min(5, {
    //       message: 'A password must be at least 5 characters. (Server)'
    //     }),
    //     confirmPassword: z.string().refine(
    //       (value) => {
    //         return value === password
    //       },
    //       {
    //         error: 'The passwords must match. (Server)'
    //       }
    //     )
    //   })
    //   ///////////////////////////////////////////////////////////////////////////
    //   //
    //   // ⚠️ Gotcha: Having .refine() on the outside of the z.object() seems
    //   // like a good idea because it allows you to access both values.password
    //   // and values.confirmPassword. However, it will short-circuit
    //   // if there are any errors in z.object().
    //   //
    //   //   .refine((values) => values.password === values.confirmPassword, {
    //   //     message: 'Passwords do not match.',
    //   //     path: ['confirmPassword'] // attaches the error to this field
    //   //   })
    //   //
    //   // Solution: wrap the Zod schema in a functon and pass it the password from the
    //   // outside, or create a secondary schema just for the password confirmation.
    //   //
    //   ///////////////////////////////////////////////////////////////////////////

    //   return LinkCredentialsSchema
    // }

    if (!newPassword || !currentPassword || newPassword.length < 8) {
      setPending(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      return
    }

    setPending(true)

    try {
      // https://better-auth.com/docs/authentication/email-password#update-password
      const { data, error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        // When true, the user will be logged out of their other sessions.
        // This is a good idea for security because changing a password is
        // often done to prevent a security breach. WDS makes this a checkbox
        // that the user can opt into. However, I've hardcoded it here for now.
        revokeOtherSessions: true
      })

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
        // An error here could also be due to any custom logic we have in auth.ts
        // for hooks.before + '/change-password'.
        //
        ///////////////////////////////////////////////////////////////////////////

        //! Temporary...
        console.log('error from UpdatePasswordForm', error)
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
      setPending(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    }
  }

  /* ======================
          return
  ====================== */

  return (
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
          autoCapitalize: 'none',
          // Browsers often ignore ❌ autoComplete='off'. Even with
          // 'new-password', Chrome still auto completes values.
          autoComplete: 'new-password',
          autoCorrect: 'off',
          spellCheck: false,
          fieldSize: 'sm',
          name: 'current_password',
          type: 'password',
          onValueChange: (newValue) => {
            setCurrentPassword(newValue)
          },
          placeholder: 'Current Password...',
          value: currentPassword
        }}

        fieldLabelProps={{
          children: 'Password',
          labelRequired: true
        }}
      />

      <Input
        fieldRootProps={{}}

        inputProps={{
          autoCapitalize: 'none',
          autoComplete: 'new-password',
          autoCorrect: 'off',
          spellCheck: false,
          fieldSize: 'sm',
          name: 'new_password',
          type: 'password',
          onValueChange: (newValue) => {
            setNewPassword(newValue)
          },
          placeholder: 'New Password...',
          value: newPassword
        }}

        fieldLabelProps={{
          children: 'New Password',
          labelRequired: true
        }}
      />

      <Input
        fieldRootProps={{}}

        inputProps={{
          autoCapitalize: 'none',
          autoComplete: 'new-password',
          autoCorrect: 'off',
          spellCheck: false,
          fieldSize: 'sm',
          name: 'confirm_new_password',
          type: 'password',
          onValueChange: (newValue) => {
            setConfirmNewPassword(newValue)
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
        loading={pending}
        onClick={handleUpdatePassword}
        size='sm'
        type='button'
      >
        {pending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
