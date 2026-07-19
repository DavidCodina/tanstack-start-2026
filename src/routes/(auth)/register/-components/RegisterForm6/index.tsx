import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { register } from '../../-server-functions/register'
import { NameField } from './NameField'
import { EmailField } from './EmailField'
import { PasswordField } from './PasswordField'
import { ConfirmPasswordField } from './ConfirmPasswordField'
import { AppFormSubmitButton } from './AppFormSubmitButton'
import { formOptions, useCustomForm } from './utils'

/* ========================================================================

======================================================================== */
// This version builds on RegisterForm5. It implements withForm() HOC
// to fully abstract away the implementation details of each field.
// See Ali Alaa at 2:07:00 - https://www.youtube.com/watch?v=H2T21r5wu3g

export const RegisterForm6 = () => {
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
        <NameField form={form} />
        <EmailField form={form} />
        <PasswordField form={form} />
        <ConfirmPasswordField form={form} />
        {/* Instead of doing this: <form.AppForm><form.SubmitButton /></form.AppForm>,
        We can also abtract the SubmitButton. However, it's a bit overkill */}
        <AppFormSubmitButton form={form} />
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
