import { formOptions, withForm } from './utils'
import { FormSchema } from './schema'

/* ========================================================================

======================================================================== */
// https://tanstack.com/form/latest/docs/framework/react/guides/form-composition#breaking-big-forms-into-smaller-pieces

export const NameField = withForm({
  ...formOptions,

  props: {},
  render: (ctx) => {
    const { /* children, */ form } = ctx

    return (
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
    )
  }
})
