import * as React from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'

import { login } from '../-server-functions/login'
import { GitHub } from './GitHub'
import { Google } from './Google'
import { LinkedIn } from './LinkedIn'
import { authClient } from '@/lib/auth-client'

import { Button } from '@/components'
import { Input } from '@/components/Input'
import { InputPassword } from '@/components/InputPassword'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes'

/* ========================================================================

======================================================================== */

export const LoginForm = () => {
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false })

  // ⚠️ At present, if the user tries to go to
  const {
    callbackUrl,
    code: _code, // Destructure out so it's not included in otherSearchParams/enhancedCallbackUrl
    verified,
    ...otherSearchParams
  } = searchParams as {
    callbackUrl?: string
    code?: string
    // In Next.js the value would be a string, but in TanStack Start,
    // the searchParams automatically coerces the value to a boolean.
    verified?: boolean | string
  }

  const enhancedCallbackUrl = (() => {
    if (
      callbackUrl &&
      typeof callbackUrl === 'string' &&
      Object.keys(otherSearchParams).length > 0
    ) {
      // Use otherSearchParams to construct a string such that
      // for each other search param, we append it to the callbackUrl.
      // Thus the result might look something like this:
      // '/about?test=abc123&foo=bar'
      const params = new URLSearchParams()

      for (const [key, value] of Object.entries(otherSearchParams)) {
        if (value === undefined) continue
        params.append(key, String(value))
      }

      const queryString = params.toString()

      if (queryString) {
        const separator = callbackUrl.includes('?') ? '&' : '?'
        return `${callbackUrl}${separator}${queryString}`
      }
    }

    return callbackUrl
  })()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [emailLoginPending, startEmailLoginTransition] = React.useTransition()

  /* ======================

  ====================== */

  React.useEffect(() => {
    if (verified === true || verified === 'true') {
      toast.success('Email verification successful!')
    }
  }, []) // eslint-disable-line

  /* ======================

  ====================== */

  const _handleServerEmailLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    if (
      !email ||
      typeof email !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      toast.error('Email and password are required.')
      return
    }

    startEmailLoginTransition(async () => {
      try {
        const { message, success } = await login({ data: { email, password } })

        if (success !== true) {
          const errorMessage =
            typeof message === 'string' ? message : 'Unable to log in.'
          toast.error(errorMessage, {
            // duration: Infinity
          })
          return
        }

        toast.success('Login success.')

        navigate({
          to: '/user',
          replace: true
        })
      } catch (_err) {
        toast.error('Unable to log in.')
      } finally {
        setEmail('')
        setPassword('')
      }
    })
  }

  /* ======================
  resendVerificationEmail()
  ====================== */
  // This works for now, but a better implementation would be to have a button that
  // opens a modal or redirects to a separate page. Then there would be a form where the user
  // can enter their email. As of right now, the user has no idea how to proactively request
  // a verification email until they've already attempted to log in.

  const resendVerificationEmail = async (email: string) => {
    try {
      const _result = await authClient.sendVerificationEmail({
        ///////////////////////////////////////////////////////////////////////////
        //
        // email is used by Better Auth to look up the user in the database by email.
        // Then it generates a verification token for that user, then calls the sendVerificationEmail helper.
        // For development, we can set the email to 'delivered@resend.dev'. However, that will still only work
        // if the actual user's email is 'delivered@resend.dev'. Otherwise, Better Auth won't find a matching
        // user and will silently do nothing.
        //
        // So... What we actually need to do is derive the email from the form login attempt.
        // Regardless of what email is, the sendVerificationEmail() currently has
        // 'delivered@resend.dev' hardcoded. That said, the actual email is still important
        // for Better Auth's internal logic to look up the user in the database - even during development.
        //
        ///////////////////////////////////////////////////////////////////////////
        email: email,
        callbackURL: '/login?verified=true'
      })

      // if (result.data) { console.log('\nResend verification email success.', _result.data)  }
      // if (result.error) { console.log('\nError resending verification email.', _result.error) }
    } catch (_err) {
      // ...
    }
  }

  /* ======================
    handleClientEmailLogin()
  ====================== */

  const handleClientEmailLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    if (
      !email ||
      typeof email !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      toast.error('Email and password are required.')
      setPassword('')
      return
    }

    startEmailLoginTransition(async () => {
      try {
        // https://www.better-auth.com/docs/basic-usage#sign-in
        const { /* data, */ error } = await authClient.signIn.email(
          {
            email,
            password
            // callbackURL: '/user'
            //# This is an interesting feature.
            //# rememberMe determines if the user remains logged in after they close the website
            //# Test it out, and decide whether you want it to be true | false.
            //# Also test cross-tab compatibility.
            // See Coding In Flow tutorial at 24:15: https://www.youtube.com/watch?v=w5Emwt3nuV0&t=15s
            // rememberMe: false
          },
          {
            ///////////////////////////////////////////////////////////////////////////
            //
            // Can be used for setting loading states if one wasn't using a transition.
            //
            //   onRequest: (ctx) => {},
            //
            //   onResponse: (ctx) => {},
            //
            //   onSuccess: (ctx) => {
            //     const { data, request, response } = ctx
            //   },
            //
            //   onError: (ctx) => {
            //     const { error, request, response } = ctx
            //     const { message } = error
            //   }
            //
            ///////////////////////////////////////////////////////////////////////////
          }
        )

        // The data and error are a discriminated union.
        if (error) {
          // {message: 'Email not verified', code: 'EMAIL_NOT_VERIFIED', status: 403, statusText: 'FORBIDDEN'}
          if (error.code === 'EMAIL_NOT_VERIFIED') {
            // This code searchParam is not currently being used, but one could conditionally
            // render a Button in the UI based on the presence of this param. At present, the
            // button is simply in the toast notification.
            navigate({
              to: '/login',
              search: { code: 'EMAIL_NOT_VERIFIED' }
            })

            toast.error(
              'Email not verified.',

              {
                duration: Infinity,
                // closeButton: true,
                description:
                  'Click send to resend verification link to your email.',
                actionButtonStyle: {
                  minWidth: 50,

                  justifyContent: 'center'
                },
                action: {
                  label: 'Send',
                  onClick: () => {
                    // console.log('Sending verification email to:', email)
                    resendVerificationEmail(email)
                  }
                },
                cancel: {
                  label: 'Cancel'
                  // onClick: () => console.log('Cancel!')
                }
              }
            )
          } else {
            ///////////////////////////////////////////////////////////////////////////
            //
            // More often the error will be something like this:
            //
            //   {
            //     code: "INVALID_EMAIL_OR_PASSWORD",
            //     message: "Invalid email or password",
            //     status: 401,
            //     statusText: "UNAUTHORIZED"
            //   }
            //
            // The general shape being:
            //
            //   {
            //     code?: string | undefined | undefined;
            //     message?: string | undefined | undefined;
            //     status: number;
            //     statusText: string;
            //   }
            //
            ///////////////////////////////////////////////////////////////////////////

            toast.error('Invalid email or password')
          }

          return
        }

        // Otherwise if data...

        ///////////////////////////////////////////////////////////////////////////
        //
        // The data will be an object that looks something like this:
        //
        //   {
        //     redirect: false,
        //     token: 'abc123...',
        //     user: {
        //       createdAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)',
        //       email: 'david@example.com',
        //       emailVerified: true,
        //       id: "36c7765e-15c9-43f9-9f67-3f8618675d7d",
        //       image: null,
        //       name: 'David Codina',
        //       updatedAt: 'Thu Dec 18 2025 16:31:53 GMT-0700 (Mountain Standard Time)'
        //     }
        //   }
        //
        ///////////////////////////////////////////////////////////////////////////

        toast.success('Login success.')

        navigate({
          to: enhancedCallbackUrl
            ? enhancedCallbackUrl
            : DEFAULT_LOGIN_REDIRECT,
          replace: true
        })
      } catch (_err) {
        toast.error('Unable to log in.')
      } finally {
        setEmail('')
        setPassword('')
      }
    })
  }
  /* ======================
      handleOAuthLogin()
  ====================== */

  const handleOAuthLogin = async (
    provider: 'github' | 'google' | 'linkedin'
  ) => {
    try {
      const _data = await authClient.signIn.social({
        provider: provider,
        callbackURL: enhancedCallbackUrl
          ? enhancedCallbackUrl
          : DEFAULT_LOGIN_REDIRECT
      })
    } catch (_err) {
      // ...
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        // ⚠️ Do not do this if using action={} here or formAction on Button.
        onSubmit={(e) => e.preventDefault()}
        // action={credentialsLoginAction}
        className='bg-card mx-auto mb-2 max-w-lg overflow-hidden rounded-lg border shadow'
        noValidate
      >
        <div
          className='bg-card flex justify-center gap-6 border-b px-4 py-2'
          style={{ boxShadow: '0px 1px 3px rgba(0,0,0,0.25)' }}
        >
          <button
            className='cursor-pointer transition-transform hover:scale-125'
            onClick={() => {
              handleOAuthLogin('google')
            }}
            type='button'
          >
            <Google className='size-6' />
          </button>

          <button
            className='cursor-pointer transition-transform hover:scale-125'
            onClick={() => {
              handleOAuthLogin('github')
            }}
            type='button'
          >
            <GitHub className='size-6' />
          </button>

          <button
            className='cursor-pointer transition-transform hover:scale-125'
            onClick={() => {
              handleOAuthLogin('linkedin')
            }}
            type='button'
          >
            <LinkedIn className='size-6' />
          </button>
        </div>

        <div className='space-y-4 p-4'>
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

          <InputPassword
            fieldRootProps={{}}

            inputProps={{
              fieldSize: 'sm',
              name: 'password',
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

          <Button
            className='flex w-full'
            loading={emailLoginPending}
            // ⚠️ Explicitly set to type='submit' if using 'formAction` or `action` props.
            // formAction={credentialsLoginAction}
            onClick={handleClientEmailLogin}
            size='sm'
            type='button'
          >
            Login
          </Button>
        </div>
      </form>

      <div className='text-muted-foreground text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link
          className='text-primary font-medium underline'
          to={'/register'}
          // target='_self'
        >
          Sign Up
        </Link>
      </div>

      <div className='text-muted-foreground text-center text-sm'>
        <Link
          className='text-primary font-medium underline'
          to={'/forgot-password'}
          // target='_self'
        >
          Forgot Password?
        </Link>
      </div>
    </>
  )
}
