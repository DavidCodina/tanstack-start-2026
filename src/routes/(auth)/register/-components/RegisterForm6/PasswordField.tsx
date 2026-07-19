import { formOptions, withForm } from './utils'
import { FormSchema } from './schema'

/* ========================================================================

======================================================================== */
// https://tanstack.com/form/latest/docs/framework/react/guides/form-composition#breaking-big-forms-into-smaller-pieces

export const PasswordField = withForm({
  ...formOptions,
  props: {},
  render: (ctx) => {
    const { /* children, */ form } = ctx

    return (
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
    )
  }
})
