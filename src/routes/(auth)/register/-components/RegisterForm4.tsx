import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import * as z from 'zod'
import {
  // revalidateLogic,
  useForm
  // useSelector
} from '@tanstack/react-form-start'
import { TriangleAlert } from 'lucide-react'

import { register } from '../-server-functions/register'
import { Button } from '@/components'
import { Input } from '@/components/Input'
import { InputPassword } from '@/components/InputPassword'
import { tanstackFormGetFieldErrors } from '@/utils'

/* ======================
      Zod Schema
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: As a general rule, using abort:true is often a bad idea.
// The goal here is to not inundate the user with too many validation
// errors for password. However, when used inside a z.object(), it ends
// up short-circuitng any outer .refine()/.superRefine() calls. Normally,
// an outer .refine() might be used for confirmPassword validation. However,
// in this case we're using TanStack Form's `onBlurListenTo` feature, so we
// can get away with this kind of Zod schema configuration.
//
// A similar argument can be made for RegisterForm3 where we're abstracting
// FormSchema -> getFormSchema() and ConfirmPasswordSchema -> getConfirmPasswordSchema().
// While that approach is somewhat verbose, it also avoids the need for an outer
// .refine(), which then permits the developer to implement abort:true as desired.
//
///////////////////////////////////////////////////////////////////////////

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

const FormSchema = z.object({
  name: z
    .string()
    .min(1, { error: 'A name is required' })
    .max(100, { error: 'Name must be 100 characters or fewer' }),
  email: z.email(),
  password: PasswordSchema,
  confirmPassword: z.string().min(8, {
    error: 'Must be at least 8 characters long'
  })
})

type ZodData = z.infer<typeof FormSchema>

const defaultValues: ZodData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

/* ========================================================================

======================================================================== */

export const RegisterForm4 = () => {
  const navigate = useNavigate()
  const [formResetKey, setFormResetKey] = React.useState(0)

  /* ======================
        useForm()
  ====================== */
  //# ???
  //# transform() {},

  const form = useForm({
    defaultValues: defaultValues,

    // This only runs when the form validation passes...
    onSubmit: async (param) => {
      const { value, formApi /*, meta */ } = param

      try {
        const res = await register({
          data: {
            name: value.name,
            email: value.email,
            password: value.password,
            confirmPassword: value.confirmPassword
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
        formApi.reset()
        // Technically, setResetKey() should not be necessary since we're now manually controlling
        // the invalid prop at all times. However, it's still a good practice to wipe the form.
        // In this case, it also helps reset the InputPassword components to type="password"
        setFormResetKey((v) => v + 1)
      }
    },

    onSubmitInvalid: (/* { value, formApi, meta } */) => {
      toast.error('Submission failed.')
    }
  })

  /* ======================
        renderName()
  ====================== */

  const renderName = () => {
    return (
      <form.Field
        name='name'
        validators={{
          onBlur: FormSchema.shape.name
        }}
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0
          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0

          const isInvalid =
            isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

          return (
            <Input
              fieldRootProps={{
                name: field.name,
                invalid: isInvalid,
                dirty: isDirty,
                touched: isBlurred
              }}

              fieldLabelProps={{
                children: 'Full Name',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                value: field.state.value,
                onBlur: field.handleBlur,

                onChange: (e) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('blur')
                  }
                },

                placeholder: 'Full Name...'
              }}

              fieldDescriptionProps={{}}
              fieldErrorProps={{
                children: isInvalid
                  ? errors
                      .filter(Boolean)
                      .map((error) => {
                        return typeof error === 'string' ? error : error.message
                      })
                      .join(', ')
                  : undefined
              }}
            />
          )
        }}
      </form.Field>
    )
  }

  /* ======================
        renderEmail()
  ====================== */

  const renderEmail = () => {
    return (
      <form.Field
        name='email'
        validators={{
          onBlur: FormSchema.shape.email
        }}
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0
          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0
          const isInvalid =
            isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

          return (
            <Input
              fieldRootProps={{
                name: field.name,
                invalid: isInvalid,
                dirty: isDirty,
                touched: isBlurred
              }}

              fieldLabelProps={{
                children: 'Email',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                value: field.state.value,
                onBlur: field.handleBlur,
                onChange: (e) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('blur')
                  }
                },

                placeholder: 'Email...'
              }}

              fieldDescriptionProps={{}}
              fieldErrorProps={{
                children: isInvalid
                  ? errors
                      .filter(Boolean)
                      .map((error) => {
                        return typeof error === 'string' ? error : error.message
                      })
                      .join(', ')
                  : undefined
              }}
            />
          )
        }}
      </form.Field>
    )
  }

  /* ======================
      renderPassword()
  ====================== */

  const renderPassword = () => {
    return (
      <form.Field
        name='password'
        validators={{
          onBlur: (param) => {
            const { value } = param
            const result = FormSchema.shape.password.safeParse(value)
            if (result.success) return
            return result.error.issues
          }
        }}
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0
          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0
          const isInvalid =
            isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

          return (
            <InputPassword
              fieldRootProps={{
                name: field.name,
                invalid: isInvalid,
                dirty: isDirty,
                touched: isBlurred
              }}

              fieldLabelProps={{
                children: 'Password',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                value: field.state.value,
                onBlur: field.handleBlur,

                onChange: (e) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('blur')
                  }
                },

                placeholder: 'Password...'
              }}

              fieldDescriptionProps={{}}
              fieldErrorProps={{
                children: isInvalid
                  ? errors
                      .filter(Boolean)
                      .map((error) => {
                        return typeof error === 'string' ? error : error.message
                      })
                      .join(', ')
                  : undefined
              }}
            />
          )
        }}
      </form.Field>
    )
  }

  /* ======================
  renderConfirmPassword()
  ====================== */

  const renderConfirmPassword = () => {
    return (
      <form.Field
        name='confirmPassword'
        validators={{
          // There's also an onChangeListenTo, but that's not the one we want.

          onBlurListenTo: ['password'],

          onBlur: ({ value, fieldApi }) => {
            const isBlurred = fieldApi.state.meta.isBlurred
            // ⚠️ Gotcha: Prevent password field from validating if confirmPassword isn't blurred.
            if (!isBlurred) return

            const password = fieldApi.form.getFieldValue('password')
            const result = FormSchema.shape.confirmPassword
              // ⚠️ Why do we need .pipe() here? Because...
              // Property 'literal' does not exist on type 'ZodString'.
              .pipe(z.literal(password, 'The passwords must match'))
              .safeParse(value)
            if (result.success) return
            return result.error.issues
          }
        }}
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0
          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0
          const isInvalid =
            isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

          return (
            <InputPassword
              fieldRootProps={{
                name: field.name,
                invalid: isInvalid,
                dirty: isDirty,
                touched: isBlurred
              }}

              fieldLabelProps={{
                children: 'Confirm Password',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                value: field.state.value,
                onBlur: field.handleBlur,
                onChange: (e) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('blur')
                  }
                },

                placeholder: 'Confirm Password...'
              }}

              fieldDescriptionProps={{}}
              fieldErrorProps={{
                children: isInvalid
                  ? errors
                      .filter(Boolean)
                      .map((error) => {
                        return typeof error === 'string' ? error : error.message
                      })
                      .join(', ')
                  : undefined
              }}
            />
          )
        }}
      </form.Field>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        className='bg-card mx-auto mb-2 max-w-lg space-y-4 rounded-lg border p-4 shadow'
        key={formResetKey}
        noValidate
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {renderName()}
        {renderEmail()}
        {renderPassword()}
        {renderConfirmPassword()}

        <form.Subscribe
          selector={(state) => {
            const fieldErrors = tanstackFormGetFieldErrors(state.fieldMeta)

            return {
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
              isFieldsValidating: state.isFieldsValidating,
              formErrors: state.errors,
              fieldErrors: fieldErrors,
              isFieldErrors: !state.isFieldsValid
            }
          }}
        >
          {(param) => {
            return (
              <Button
                className='flex w-full'

                disabled={!param.canSubmit}
                loading={param.isSubmitting}
                onClick={form.handleSubmit}
                size='sm'
                type='button'
                variant={param.isFieldErrors ? 'destructive' : 'primary'}
              >
                {param.isSubmitting ? (
                  'Registering...'
                ) : !param.canSubmit && !param.isFieldsValidating ? (
                  <>
                    <TriangleAlert /> Please Correct Errors...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            )
          }}
        </form.Subscribe>
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
