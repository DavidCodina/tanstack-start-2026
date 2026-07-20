import { z } from 'zod'
import { formOptions, withForm } from './utils'
import { FormSchema } from './schema'

/* ========================================================================

======================================================================== */
// https://tanstack.com/form/latest/docs/framework/react/guides/form-composition#breaking-big-forms-into-smaller-pieces

export const ConfirmPasswordField = withForm({
  ...formOptions,
  props: {},
  render: (ctx) => {
    const { /* children, */ form } = ctx

    return (
      <form.AppField
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
    )
  }
})
