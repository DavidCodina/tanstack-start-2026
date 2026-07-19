import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import * as z from 'zod'

import { register } from '../../-server-functions/register'
import { FormSchema } from './schema'
import { formOptions, useCustomForm } from './utils'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This version builds on RegisterForm4. It implements createFormHook and
// createFormHookContexts in the local utils.ts. This then allows us to
// create and abstract the following components:
//
//   - InputField
//   - InputPasswordField
//   - SubmitButton
//
//  In this way we accomplish two goals:
//
// 1. Bloat reduction through abstraction.
// 2. Reusability through making the field components generic.
//    That said, if we truly intend to reuse them in other fields, we should
//    move their location to the top-level components folder.
//
///////////////////////////////////////////////////////////////////////////

export const RegisterForm5 = () => {
  const navigate = useNavigate()
  const [formResetKey, setFormResetKey] = React.useState(0)

  /* ======================
        useForm()
  ====================== */

  const form = useCustomForm({
    ...formOptions,

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
        <form.AppField
          name='name'
          validators={{
            onBlur: FormSchema.shape.name
          }}
        >
          {(field) => (
            <field.InputField
              fieldLabelProps={{
                children: 'Full Name',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                placeholder: 'Full Name...'
              }}
            />
          )}
        </form.AppField>

        <form.AppField
          name='email'
          validators={{
            onBlur: FormSchema.shape.email
          }}
        >
          {(field) => (
            <field.InputField
              fieldLabelProps={{
                children: 'Email',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                placeholder: 'Email...'
              }}
            />
          )}
        </form.AppField>

        <form.AppField
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
          {(field) => (
            <field.InputPasswordField
              fieldLabelProps={{
                children: 'Password',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                placeholder: 'Password...'
              }}
            />
          )}
        </form.AppField>

        <form.AppField
          name='confirmPassword'
          validators={{
            // There's also an onChangeListenTo, but that's not the one we want.
            onBlurListenTo: ['password'],

            onBlur: ({ value, fieldApi }) => {
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
          {(field) => (
            <field.InputPasswordField
              fieldLabelProps={{
                children: 'Confirm Password',
                labelRequired: true
              }}

              inputProps={{
                fieldSize: 'sm',
                placeholder: 'Confirm Password...'
              }}
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton />
        </form.AppForm>
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
