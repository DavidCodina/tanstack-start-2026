import React, { useState, useTransition } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import * as z from 'zod'
import { TriangleAlert } from 'lucide-react'

import { register } from '../-server-functions/register'
import { Button } from '@/components'
import { Input } from '@/components/Input'
import { formatZodErrors } from '@/utils'

/* ======================
      Zod Schema
====================== */

const PasswordSchema = z
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

const getFormSchema = (password: unknown) => {
  const FormSchema = z.object({
    name: z.string().min(1, { error: 'A name is required' }),
    email: z.email(),
    password: PasswordSchema,
    confirmPassword: z
      .string()
      .min(8, {
        error: 'Must be at least 8 characters long'
      })
      .refine(
        (value) => {
          return value === password
        },
        {
          error: 'The passwords must match.'
        }
      )
  })

  return FormSchema
}

// type FormSchemaType = ReturnType<typeof getFormSchema>

// type LooseFormErrors = Record<string, string>

type FormErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Regarding Fine-Grained Validation Control:
//
// For this demo we're using Base UI Form's onFormSubmit to initiate
// form-level validation. Initially, I was also using Base UI Input's validate
// prop for field-level validation. This mostly works, but the validationMode
// can only be 'onBlur', 'onChange', or 'onSubmit'. This results in some
// unusual behavior such that if 'onBlur' is selected, an invalid value
// will trigger data-invalid, but as soon as you go back to the field and
// begin typing again, it will be data-valid until another blur occurs.
//
// In other words, there's nothing analagous to validationMode="onBlurThenOnChange".
// The best solution is to switch to using TanStack Form. However, we can also
// manually implement touched state + validation onBlur + validation onValueChange.
// This is the way...
//
// Note: it's still important to set validationMode to 'onBlur' either in each
// field or in the <Form />.
//
///////////////////////////////////////////////////////////////////////////

export const RegisterForm = () => {
  /* ======================
        state & refs
  ====================== */

  const navigate = useNavigate()

  const actionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [name, setName] = useState('')
  const [nameTouched, setNameTouched] = useState(false)

  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const [password, setPassword] = useState('')
  const [passwordTouched, setPasswordTouched] = useState(false)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})

  const isErrors = Object.keys(errors).length > 0

  const [formPending, startFormTransition] = useTransition()

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

  const FormSchema = getFormSchema(password)

  /* ======================
        validateName()
  ====================== */

  const validateName = (value?: string) => {
    value = typeof value === 'string' ? value : name
    const validationResult = FormSchema.shape.name.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            name: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      // Alternatively destructure out:
      // const { name: _name, ...rest } = prev
      // return rest
      const next = { ...prev }
      delete next.name
      return next
    })
  }

  /* ======================
      validateEmail()
  ====================== */

  const validateEmail = (value?: string) => {
    value = typeof value === 'string' ? value : email
    const validationResult = FormSchema.shape.email.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            email: error
          }
          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next.email
      return next
    })
  }

  /* ======================
      validatePassword()
  ====================== */

  const validatePassword = (value?: string) => {
    value = typeof value === 'string' ? value : password
    const validationResult = FormSchema.shape.password.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            password: error
          }

          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next.password
      return next
    })
  }

  /* ======================
  validateConfirmPassword()
  ====================== */

  const validateConfirmPassword = (value?: string) => {
    value = typeof value === 'string' ? value : confirmPassword
    const validationResult = FormSchema.shape.confirmPassword.safeParse(value)

    if (validationResult.success === false) {
      const error = validationResult.error.issues[0]?.message
      if (typeof error === 'string') {
        setErrors((prev) => {
          const newErrors: FormErrors = {
            ...prev,
            confirmPassword: error
          }

          return newErrors
        })
      }
      return
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next.confirmPassword
      return next
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <Form
        actionsRef={actionsRef}
        className='bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow'
        errors={errors}
        key={resetKey}
        noValidate

        ///////////////////////////////////////////////////////////////////////////
        //
        // onFormSubmit only runs if  all the field-level validation passes.
        // However, as noted earlier the field-level validate prop is problematic because it doesn't
        // allow for fine-graned control over how/when validation runs.
        //
        // In practice, this means there's no way of externalizing errors that are triggered through
        // field-level validate functions. That said, you can start from the other way around and run validation
        // externally through Zod.
        //
        ///////////////////////////////////////////////////////////////////////////
        onFormSubmit={async (_formValues, _eventDetails) => {
          /* ======================
                  Validation
          ====================== */

          const validationResult = await FormSchema.safeParseAsync({
            name,
            email,
            password,
            confirmPassword
          })

          if (!validationResult.success) {
            const errors = formatZodErrors(validationResult.error)
            setErrors(errors)
            return
          }

          startFormTransition(async () => {
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
              // ⚠️ Here we're using a server function, which works in this specific case because
              // we're not logging the user in automatically. However, if we were doing that
              // then the UI would likely not update on the client.
              //
              // Ultimately, which approach you take depends on your use case.
              //
              ///////////////////////////////////////////////////////////////////////////

              const res = await register({
                data: {
                  name: validationResult.data.name,
                  email: validationResult.data.email,
                  password: validationResult.data.password,
                  confirmPassword: validationResult.data.confirmPassword
                }
              })

              if (res.success === true) {
                toast.success(
                  "Registration success! If this email isn't already associated with an account, we've sent a confirmation link to it."
                )
                // ❌ toast.success('Registration success!')

                ///////////////////////////////////////////////////////////////////////////
                //
                // Because we're using requireEmailVerification: true, we can instead
                // use the callbackURL in the Better Auth signUp function. It won't redirect
                // until AFTER the email is verified. Actually, the redirect will open in a
                // new tab, rather than from the current application tab. We still want the
                // current application flow to go to '/login'
                //
                ///////////////////////////////////////////////////////////////////////////
                navigate({ to: '/login' })

                return
              }

              if (res.code === 'EMAIL_BLACKLISTED') {
                toast.error('This email is blacklisted.', {
                  duration: Infinity
                })
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
              setErrors({})
              setResetKey((v) => v + 1)
            }
          })
        }}
        // I don't think this is necessary if we're using onFormSubmit.
        onSubmit={(e) => e.preventDefault()}
        ref={formRef}
        validationMode='onBlur'
      >
        <Input
          fieldRootProps={{}}

          inputProps={{
            fieldSize: 'sm',
            name: 'name',
            onBlur: (e) => {
              const value = e.target.value
              setNameTouched(true)
              validateName(value)
            },
            onValueChange: (newValue) => {
              setName(newValue)
              if (nameTouched) {
                validateName(newValue)
              }
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
            onBlur: (e) => {
              const value = e.target.value
              setEmailTouched(true)
              validateEmail(value)
            },
            onValueChange: (newValue) => {
              setEmail(newValue)
              if (emailTouched) {
                validateEmail(newValue)
              }
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
            onBlur: (e) => {
              const value = e.target.value
              setPasswordTouched(true)
              validatePassword(value)
            },
            onValueChange: (newValue) => {
              setPassword(newValue)
              if (passwordTouched) {
                validatePassword(newValue)
              }
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
            onBlur: (e) => {
              const value = e.target.value
              setConfirmPasswordTouched(true)
              validateConfirmPassword(value)
            },
            onValueChange: (newValue) => {
              setConfirmPassword(newValue)
              if (confirmPasswordTouched) {
                validateConfirmPassword(newValue)
              }
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
          loading={formPending}
          disabled={isErrors}
          size='sm'
          type='submit'
          variant={isErrors ? 'destructive' : 'primary'}
        >
          {isErrors ? (
            <>
              <TriangleAlert /> Please Correct Errors...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </Form>

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
    </>
  )
}
