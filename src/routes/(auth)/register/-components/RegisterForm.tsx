import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import * as z from 'zod'
import { TriangleAlert } from 'lucide-react'

import { register } from '../-server-functions/register'

import type { FieldRootActions } from '@base-ui/react'

import { Button } from '@/components'
import { Input } from '@/components/Input'
import { InputPassword } from '@/components/InputPassword'
import { formatZodErrors } from '@/utils'

/* ======================
      Zod Schema
====================== */

const PasswordSchema = z
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

const getConfirmPasswordSchema = (password: unknown) => {
  const ConfirmPasswordSchema = z
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
        return value === password
      },
      {
        error: 'The passwords must match.'
      }
    )

  return ConfirmPasswordSchema
}

const getFormSchema = (password: unknown) => {
  const FormSchema = z.object({
    name: z
      .string()
      .min(1, { error: 'A name is required' })
      .max(100, { error: 'Name must be 100 characters or fewer' }),
    email: z.email(),
    password: PasswordSchema,

    confirmPassword: getConfirmPasswordSchema(password)
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
///////////////////////////////////////////////////////////////////////////
//
// This approach uses a dynamic field-level validationMode based on the touched state.
// It's clever, but it seems to necesitate this specific approach to sync the confirmPassword
// validation.
//
//   setTimeout(() => {
//     confirmPasswordActionsRef.current?.validate()
//   }, 0)
//
// It works fine, but feels a little hacky...
//
///////////////////////////////////////////////////////////////////////////

export const RegisterForm = () => {
  /* ======================
        state & refs
  ====================== */

  const navigate = useNavigate()

  const formActionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [name, setName] = React.useState('')
  const [nameTouched, setNameTouched] = React.useState(false)

  const [email, setEmail] = React.useState('')
  const [emailTouched, setEmailTouched] = React.useState(false)

  const [password, setPassword] = React.useState('')
  const [passwordTouched, setPasswordTouched] = React.useState(false)

  const confirmPasswordActionsRef = React.useRef<FieldRootActions>(null)
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    React.useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})
  // const isErrors = Object.keys(errors).length > 0
  const isErrors = Object.values(errors).some((value) => !!value)

  const [formPending, startFormTransition] = React.useTransition()

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
  // Note that each validator conforms to a type that returns string | null.
  // This allows them to also be returned from the validate callback.
  // It may seem redundant to also call setErrors(), but this is the only
  // way to maintain an external record of the errors for `isErrors`, etc.

  const validateName = (value?: string): string | null => {
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
        return error
      }
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.name
      return newErrors
    })

    return null
  }

  /* ======================
      validateEmail()
  ====================== */

  const validateEmail = (value?: string): string | null => {
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
        return error
      }
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.email
      return newErrors
    })

    return null
  }

  /* ======================
      validatePassword()
  ====================== */

  const validatePassword = (value?: string): string | null => {
    value = typeof value === 'string' ? value : password
    const validationResult = FormSchema.shape.password.safeParse(value)

    // ⚠️ Gotcha: confirmPassword validation also needs
    // to run after every time newPassword changes.
    if (confirmPasswordTouched) {
      // setTimeout needed to ensure it happens last.
      setTimeout(() => {
        // Using the actionsRef is the most idiomatic and least error prone in this case.
        confirmPasswordActionsRef.current?.validate()
        // This approach seems prone to some kind of race condition,
        // even inside of the setTimeout.
        // ❌ validateConfirmPassword(confirmPassword, value)
      }, 0)
    }

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

        return error
      }
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.password
      return newErrors
    })

    return null
  }

  /* ======================
  validateConfirmPassword()
  ====================== */

  const validateConfirmPassword = (
    value?: string,
    pass?: string
  ): string | null => {
    value = typeof value === 'string' ? value : confirmPassword
    pass = typeof pass === 'string' ? pass : password

    const FreshConfirmPasswordSchema = getConfirmPasswordSchema(pass)
    const validationResult = FreshConfirmPasswordSchema.safeParse(value)

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
        return error
      }
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.confirmPassword
      return newErrors
    })

    return null
  }

  /* ======================
      handleSubmit()
  ====================== */

  const handleSubmit = async (zodData: ZodData) => {
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
            name: zodData.name,
            email: zodData.email,
            password: zodData.password,
            confirmPassword: zodData.confirmPassword
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
        toast.error(
          "Unable to register. Ensure you're using a valid email/password and not already registered through a social provider.",
          {
            duration: Infinity
          }
        )
      } finally {
        setName('')
        setNameTouched(false)
        setEmail('')
        setEmailTouched(false)
        setPassword('')
        setPasswordTouched(false)
        setConfirmPassword('')
        setConfirmPasswordTouched(false)
        setErrors({})
        setResetKey((v) => v + 1)
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <Form
        actionsRef={formActionsRef}
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
          // Set true on all toucher functions.
          // This is important in order to subsequently allow validation onChange.
          const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
            setNameTouched,
            setEmailTouched,
            setPasswordTouched,
            setConfirmPasswordTouched
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
            name,
            email,
            password,
            confirmPassword
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
        // Set valiationMode on EVERY field instead based dynamically on the touched state.
        // ❌ validationMode='onBlur'
      >
        <Input
          fieldRootProps={{
            // This is just to explicitly show its not depending on forceValidity.
            forceValidity: false,
            touched: nameTouched,
            validationMode: nameTouched ? 'onChange' : 'onBlur',
            validate: (value) => {
              return validateName(value as string)
            }
          }}

          fieldLabelProps={{
            children: 'Full Name',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'name',
            onBlur: (_e) => {
              setNameTouched(true)
            },
            onValueChange: (newValue) => {
              setName(newValue)
            },

            placeholder: 'Full Name...',
            value: name
          }}
        />

        <Input
          fieldRootProps={{
            // This is just to explicitly show its not depending on forceValidity.
            forceValidity: false,
            touched: emailTouched,
            validationMode: emailTouched ? 'onChange' : 'onBlur',
            validate: (value) => {
              return validateEmail(value as string)
            }
          }}

          fieldLabelProps={{
            children: 'Email',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'email',
            type: 'email',
            onBlur: (_e) => {
              setEmailTouched(true)
            },
            onValueChange: (newValue) => {
              setEmail(newValue)
            },
            placeholder: 'Email...',
            value: email
          }}
        />

        <InputPassword
          fieldRootProps={{
            // This is just to explicitly show its not depending on forceValidity.
            forceValidity: false,
            touched: passwordTouched,
            validationMode: passwordTouched ? 'onChange' : 'onBlur',
            validate: (value) => {
              return validatePassword(value as string)
            }
          }}

          fieldLabelProps={{
            children: 'Password',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'password',
            onBlur: (_e) => {
              setPasswordTouched(true)
            },
            onValueChange: (newValue) => {
              setPassword(newValue)
            },
            placeholder: 'Password...',
            value: password
          }}
        />

        <InputPassword
          fieldRootProps={{
            actionsRef: confirmPasswordActionsRef,
            // This is just to explicitly show its not depending on forceValidity.
            forceValidity: false,
            touched: confirmPasswordTouched,
            validationMode: confirmPasswordTouched ? 'onChange' : 'onBlur',
            validate: (value) => {
              return validateConfirmPassword(value as string)
            }
          }}

          fieldLabelProps={{
            children: 'Confirm Password',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'confirmPassword',
            onBlur: (_e) => {
              setConfirmPasswordTouched(true)
            },
            onValueChange: (newValue) => {
              setConfirmPassword(newValue)
            },
            placeholder: 'Confirm Password...',
            value: confirmPassword
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
            'Registering...'
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
