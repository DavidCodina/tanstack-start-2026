import { formOptions, withForm } from './utils'

/* ========================================================================

======================================================================== */

export const AppFormSubmitButton = withForm({
  ...formOptions,
  props: {},
  render: (ctx) => {
    const { form } = ctx

    return (
      <form.AppForm>
        <form.SubmitButton />
      </form.AppForm>
    )
  }
})
