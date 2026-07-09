'use client'

import * as React from 'react'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { Alert, Button } from '@/components'
import { Input } from '@/components/Input'

/* ========================================================================

======================================================================== */
//# Add confirm password field.
//# Switch to using InputPassword component.

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

  const [newPassword, setNewPassword] = React.useState('')
  const [pending, startTransition] = React.useTransition()

  /* ======================

  ====================== */

  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (!newPassword || typeof newPassword !== 'string') {
      toast.error('Email is required.')
      return
    }

    // A missing token is already handled by what UI is show. Doing it here also is still a good practice.
    if (!token || typeof token !== 'string') {
      toast.error('A token is required.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    startTransition(async () => {
      try {
        const { data, error } = await authClient.resetPassword({
          newPassword,
          token
        })

        if (error) {
          // Example: if we did this: http://localhost:3000/reset-password?token=abc123
          // Then we'd get back: {message: 'Invalid token', code: 'INVALID_TOKEN', status: 400, statusText: 'BAD_REQUEST'}
          console.log(error)
          const errorMessage =
            typeof error.message === 'string'
              ? error.message
              : 'Unable to reset password.'
          toast.error(errorMessage, {
            // duration: Infinity
          })

          return
        }
        if (data) {
          toast.success('Password reset success.')

          navigate({
            to: '/login'
          })

          return
        }
      } catch (_err) {
        toast.error('Unable to reset password.')
      } finally {
        setNewPassword('')
      }
    })
  }

  /* ======================
        rendeForm()
  ====================== */

  const renderForm = () => {
    if (token && typeof token === 'string') {
      return (
        <form
          onSubmit={(e) => e.preventDefault()}
          className='bg-card mx-auto mb-2 max-w-lg overflow-hidden rounded-lg border shadow'
          noValidate
        >
          <div className='space-y-4 p-4'>
            <Input
              fieldRootProps={{}}

              inputProps={{
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

            <Button
              className='flex w-full'
              loading={pending}
              onClick={handleResetPassword}
              size='sm'
              type='button'
            >
              {pending ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </div>
        </form>
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
