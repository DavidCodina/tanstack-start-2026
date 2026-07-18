import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import * as z from 'zod'
import { TriangleAlert } from 'lucide-react'

import { register } from '../-server-functions/register'
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
// This version of the RegisterForm works WITHOUT: import { Form } from '@base-ui/react/form'
// The primary changes are the use of:
//
//   const getInvalid = (error: keyof typeof errors, touched: boolean) => {
//     const isError = Boolean(errors[error])
//     if (!touched) return undefined
//     return isError
//   }
//
//
// And the following logic in each Input:
//
//   fieldRootProps={{
//     invalid: getInvalid('name', nameTouched),
//     touched: nameTouched
//   }}
//
//   fieldErrorProps={{
//     children: errors.name
//   }}
//
// Overall, there's a little bit more code we have to manage manually.
// And, this version absolutely depends on `invalid` plus the useValidationHack()
// hook in the FieldControl definition. However, it's actually better than the
// original version with <Form /> because we have COMPLETE control over the
// invalid prop (e.g., can be invalid or not invalid on mount).
//
// This version is probably as close as good as we can get without actually
// moving to TanStack form.
//
///////////////////////////////////////////////////////////////////////////

export const RegisterForm3 = () => {
  const navigate = useNavigate()

  /* ======================
        state & refs
  ====================== */

  const formRef = React.useRef<HTMLFormElement>(null)

  const [name, setName] = React.useState('')
  const [nameTouched, setNameTouched] = React.useState(false)

  const [email, setEmail] = React.useState('')
  const [emailTouched, setEmailTouched] = React.useState(false)

  const [password, setPassword] = React.useState('')
  const [passwordTouched, setPasswordTouched] = React.useState(false)

  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    React.useState(false)

  const [errors, setErrors] = React.useState<FormErrors>({})
  // const isErrors = Object.keys(errors).length > 0
  const isErrors = Object.values(errors).some((value) => !!value)

  const [formPending, startFormTransition] = React.useTransition()
  const [resetKey, setResetKey] = React.useState(0)

  const FormSchema = getFormSchema(password)

  /* ======================
        validateName()
  ====================== */

  const validateName = (value?: string): void => {
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
      const newErrors: FormErrors = { ...prev }
      delete newErrors.name
      return newErrors
    })
  }

  /* ======================
      validateEmail()
  ====================== */

  const validateEmail = (value?: string): void => {
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
      const newErrors: FormErrors = { ...prev }
      delete newErrors.email
      return newErrors
    })
  }

  /* ======================
      validatePassword()
  ====================== */

  const validatePassword = (value?: string): void => {
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
      const newErrors: FormErrors = { ...prev }
      delete newErrors.password
      return newErrors
    })
  }

  /* ======================
  validateConfirmPassword()
  ====================== */

  const validateConfirmPassword = (value?: string, pass?: string): void => {
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
      }
      return
    }

    setErrors((prev) => {
      const newErrors: FormErrors = { ...prev }
      delete newErrors.confirmPassword
      return newErrors
    })
  }

  /* ======================
        getInvalid()
  ====================== */

  const getInvalid = (error: keyof typeof errors, touched: boolean) => {
    const isError = Boolean(errors[error])
    if (!touched) return undefined
    return isError
  }

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (zodData: ZodData) => {
    startFormTransition(async () => {
      try {
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
        // Technically, setResetKey() should not be necessary since we're now manually controlling
        // the invalid prop at all times. However, it's still a good practice to wipe the form.
        // In this case, it also helps reset the InputPassword components to type="password"
        setResetKey((v) => v + 1)
      }
    })
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {/* <Button
        className='mx-auto mb-6 flex'
        onClick={() => {
          setName('')
          setNameTouched(false)
          setEmail('')
          setEmailTouched(false)
          setPassword('')
          setPasswordTouched(false)
          setConfirmPassword('')
          setConfirmPasswordTouched(false)
          setErrors({})
          // setResetKey((v) => v + 1)
        }}
        size='sm'
        variant='success'
      >
        Clear Form Values
      </Button> */}
      <form
        className='bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow'
        key={resetKey}
        noValidate
        onSubmit={async (e) => {
          e.preventDefault()

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
        ref={formRef}
      >
        <Input
          fieldRootProps={{
            // ⚠️ In order for the invalid prop to be responsive on mount, and after
            // clearing all form values, we need forceValidity: true, which is already
            // the default. This, in turn, triggers the useValidationHack() hook.
            // Unfortunately, Base UI's FieldControl and Input will not work 100% of the
            // time without this due to the limitations of its own internal Constraint
            // Validation API.
            invalid: getInvalid('name', nameTouched),
            touched: nameTouched
          }}

          fieldLabelProps={{
            children: 'Full Name',
            labelRequired: true
          }}

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

          fieldErrorProps={{
            children: errors.name
          }}
        />

        <Input
          fieldRootProps={{
            invalid: getInvalid('email', emailTouched),
            touched: emailTouched
          }}

          fieldLabelProps={{
            children: 'Email',
            labelRequired: true
          }}

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

          fieldErrorProps={{
            children: errors.email
          }}
        />

        <InputPassword
          fieldRootProps={{
            invalid: getInvalid('password', passwordTouched),
            touched: passwordTouched
          }}

          fieldLabelProps={{
            children: 'Password',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'password',

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
              if (confirmPasswordTouched) {
                validateConfirmPassword(undefined, newValue)
              }
            },
            placeholder: 'Password...',
            value: password
          }}

          fieldErrorProps={{
            children: errors.password
          }}
        />

        <InputPassword
          fieldRootProps={{
            invalid: getInvalid('confirmPassword', confirmPasswordTouched),
            touched: confirmPasswordTouched
          }}

          fieldLabelProps={{
            children: 'Confirm Password',
            labelRequired: true
          }}

          inputProps={{
            fieldSize: 'sm',
            name: 'confirmPassword',

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

          fieldErrorProps={{
            children: errors.confirmPassword
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
    </>
  )
}
