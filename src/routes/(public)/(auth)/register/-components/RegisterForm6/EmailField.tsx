import { formOptions, withForm } from './utils'
import { FormSchema } from './schema'

/* ========================================================================

======================================================================== */
// https://tanstack.com/form/latest/docs/framework/react/guides/form-composition#breaking-big-forms-into-smaller-pieces

export const EmailField = withForm({
  ...formOptions,
  props: {},
  render: (ctx) => {
    const { /* children, */ form } = ctx

    return (
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
    )
  }
})
