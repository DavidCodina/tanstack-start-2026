import { z } from 'zod'
import { formOptions, withForm } from './utils'

/* ========================================================================

======================================================================== */
// https://tanstack.com/form/latest/docs/framework/react/guides/form-composition#breaking-big-forms-into-smaller-pieces

export const LastNameField = withForm({
  // Even though we're only using lastName, we still need the
  // defaultValues to match. Otherwise, we get a TypeScript error.
  // defaultValues: { firstName: '', lastName: '' },
  ...formOptions,

  props: {},
  render: (ctx) => {
    const { /* children, */ form } = ctx

    return (
      <form.AppField
        name='lastName'
        validators={{
          onDynamic: z
            .string()
            .min(2, 'Last name must be at least 2 characters')
        }}
      >
        {(field) => <field.LastName />}
      </form.AppField>
    )
  }
})
