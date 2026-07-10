'use client'

import * as React from 'react'
import { toast } from 'sonner'
import type { ButtonProps } from '@/components'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components'
import { cn } from '@/utils'

type CreatePasswordButtonProps = ButtonProps & {
  email: string
}

/* ========================================================================

======================================================================== */

export const CreatePasswordButton = ({
  className = '',
  email,
  onClick,
  ...otherProps
}: CreatePasswordButtonProps) => {
  const [pending, startTransition] = React.useTransition()
  /* ======================

  ====================== */

  const handleForgotPassword = async () => {
    //# Switch to Zod validation.
    if (!email || typeof email !== 'string') {
      toast.error('Email is required.')
      return
    }

    startTransition(async () => {
      try {
        const { data, error } = await authClient.requestPasswordReset(
          {
            email: email,
            // fetchOptions: {},
            redirectTo: '/reset-password' // Must be a public route since the user is logged in.
          },
          {
            // onRequest: (ctx) => {},
            // onResponse: (ctx) => {},
            // onSuccess: (ctx) => {},
            // onError: (ctx) => {}
          }
        )

        if (error) {
          const errorMessage =
            typeof error.message === 'string'
              ? error.message
              : 'Unable to send verification email.'

          toast.error(errorMessage)
          return
        }

        if (data) {
          // If all goes well for the user, a credential account will be created such that
          // the user will now have that account in addition to their other OAuth accounts,
          // all pointing the same user record.
          toast.success('A verification email was sent to your current email.')
          return
        }
      } catch (_err) {
        toast.error('Unable to send verification email.')
      } finally {
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <Button
      size='sm'
      {...otherProps}
      className={cn('flex w-full', className)}
      loading={pending}
      onClick={(e) => {
        onClick?.(e)
        handleForgotPassword()
      }}
      type='button'
    >
      {pending ? 'Sending verification email...' : 'Add Password To Account'}
    </Button>
  )
}
