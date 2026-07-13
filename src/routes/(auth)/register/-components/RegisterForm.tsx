'use client'

import React, { Fragment, useState, useTransition } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components'
import { Input } from '@/components/Input'
// import { authClient } from '@/lib/auth-client'

import { register } from '@/server-functions/register'

// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

/* ========================================================================

======================================================================== */

export const RegisterForm = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registrationPending, startRegistrationTransition] = useTransition()

  /* ======================

  ====================== */

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    //# Add better validation here...

    //   if (
    //     !firstName ||
    //     typeof firstName !== 'string' ||
    //     !lastName ||
    //     typeof lastName !== 'string' ||
    //     !email ||
    //     typeof email !== 'string' ||
    //     !password ||
    //     typeof password !== 'string' ||
    //     !confirmPassword ||
    //     typeof confirmPassword !== 'string'
    //   ) {
    //     toast.error('All fields are required.')
    //     return
    //   }

    startRegistrationTransition(async () => {
      try {
        ///////////////////////////////////////////////////////////////////////////
        //
        // One could also use authClient.signUp.email().
        //
        //   const { data, error } = await authClient.signUp.email({
        //     name: name,
        //     email,
        //     password
        //     // I believe that this callback URL is only used when email verification is enabled.
        //     callbackURL: '/login?verified=true'
        //   })
        //
        // However, in this case, it's easier to use a server action + auth.api.signUpEmail()
        // so we can perform server-side validation. One could use authClient.signUp.email()
        // in conjunction with a before hook, but I prefer this approach - despite it making
        // a server call from the server.
        //
        // ⚠️ Here we're using a server action, which works in this specific case because
        // we're not logging the user in automatically. However, if we were doing that
        // then the UI would likely not update on the client.
        //
        // Ultimately, which approach you take depends on your use case.
        //
        ///////////////////////////////////////////////////////////////////////////

        const res = await register({
          data: {
            name,
            email,
            password,
            confirmPassword
          }
        })

        if (res.success === true) {
          toast.success(
            "Registration success! If this email isn't already associated with an account, we've sent a confirmation link to it."
          )
          // toast.success('Registration success!')
          // Because we're using requireEmailVerification: true, we can instead
          // use the callbackURL in the Better Auth signUp function. It won't redirect
          // until AFTER the email is verified. Actually, the redirect will open in a
          // new tab, rather than from the current application tab.

          navigate({
            to: '/login'
          })

          return
        }

        if (res.code === 'EMAIL_BLACKLISTED') {
          toast.error('This email is blacklisted.', { duration: Infinity })
          return
        }

        toast.error(
          "Unable to register. Ensure you're using a valid email/password and not already registered through a social provider.",
          {
            duration: Infinity
          }
        )

        ///////////////////////////////////////////////////////////////////////////
        //
        // If you wanted to automatically sign the user in after registering
        // you can import { signIn } from 'next-auth/react' then do this:
        //
        //   signIn('credentials', { email, password, callbackUrl: '/user' })
        //
        // However, it's probably better to not do this and instead create
        // an additional step whereby the user must verify their email prior
        // to logging in for the first time.
        //
        ///////////////////////////////////////////////////////////////////////////
      } catch (_err) {
        console.log(_err)
        toast.error(
          "Unable to register. Ensure you're using a valid email/password and not already registered through a social provider.",
          {
            duration: Infinity
          }
        )
      } finally {
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <form
        onSubmit={(e) => e.preventDefault()}
        className='bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow'
        noValidate
      >
        <Input
          fieldRootProps={{}}

          inputProps={{
            fieldSize: 'sm',
            name: 'fullName',
            onValueChange: (newValue) => {
              setName(newValue)
            },
            placeholder: 'Full Name...',
            value: name
          }}

          fieldLabelProps={{
            children: 'Full Name',
            labelRequired: true
          }}
        />

        <Input
          fieldRootProps={{}}

          inputProps={{
            fieldSize: 'sm',
            name: 'email',
            type: 'email',
            onValueChange: (newValue) => {
              setEmail(newValue)
            },
            placeholder: 'Email...',
            value: email
          }}

          fieldLabelProps={{
            children: 'Email',
            labelRequired: true
          }}
        />

        <Input
          fieldRootProps={{}}

          inputProps={{
            fieldSize: 'sm',
            name: 'password',
            type: 'password',
            onValueChange: (newValue) => {
              setPassword(newValue)
            },
            placeholder: 'Password...',
            value: password
          }}

          fieldLabelProps={{
            children: 'Password',
            labelRequired: true
          }}
        />

        <Input
          fieldRootProps={{}}

          inputProps={{
            fieldSize: 'sm',
            name: 'confirmPassword',
            type: 'password',
            onValueChange: (newValue) => {
              setConfirmPassword(newValue)
            },
            placeholder: 'Confirm Password...',
            value: confirmPassword
          }}

          fieldLabelProps={{
            children: 'Confirm Password',
            labelRequired: true
          }}
        />

        <Button
          className='flex w-full'
          loading={registrationPending}
          onClick={handleSubmit}

          size='sm'
          type='button'
        >
          Register
        </Button>
      </form>

      <div className='text-muted-foreground text-center text-sm'>
        Already have an account?{' '}
        <Link
          className='text-primary font-medium underline'
          to='/login'
          // target='_self'
        >
          Sign In
        </Link>
      </div>
    </Fragment>
  )
}
