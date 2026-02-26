import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { Field } from '@base-ui/react/field'
import { Input } from '@base-ui/react/input'

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-blue-500
focus-visible:ring-[3px]
focus-visible:ring-blue-500/40
`

const FIELD_VALID_MIXIN = `
data-valid:not-data-disabled:border-green-500
data-valid:focus-visible:border-green-500
data-valid:focus-visible:ring-green-500/40
`

const FIELD_INVALID_MIXIN = `
data-invalid:not-data-disabled:border-red-500
data-invalid:focus-visible:border-red-500
data-invalid:focus-visible:ring-red-500/40
`

const inputClasses = `
flex bg-card
w-full min-w-0
px-[0.5em] py-[0.25em]
rounded-[0.375em]
border border-neutral-400 outline-none
placeholder:text-muted-foreground
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
`

/* ========================================================================

======================================================================== */
// This bug exists as of v1.2.0.
//# See here: https://github.com/mui/base-ui/issues/4095

export const ValidationBugDemo = () => {
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  return (
    <Form
      noValidate
      key={resetKey}
      className='mx-auto max-w-[600px] space-y-2 rounded-lg border border-neutral-400 bg-white p-2 shadow'
      onFormSubmit={(formValues, _eventDetails) => {
        setSubmitting(true)
        setErrors({})
        const formErrors: Record<string, string> = {}

        const lastName = formValues.lastName

        if (typeof lastName !== 'string') {
          formErrors.lastName = 'Invalid type.'
        } else if (lastName === 'abcde') {
          formErrors.lastName = 'abcde is not a real last name!'
        }

        const isErrors = Object.keys(formErrors).length > 0

        if (isErrors) {
          setErrors(formErrors)
          setSubmitting(false)
          return
        }

        setSubmitting(false)
        setResetKey((v) => v + 1)
      }}
      errors={errors}
    >
      <Field.Root
        name='lastName'
        validate={(value, _formValues) => {
          console.log('validate callback ran...')
          let error = ''

          if (typeof value !== 'string') {
            error = 'Invalid type'
            return error
          }

          if (!value || value.length === 0) {
            error = 'Required'
            return error
          }

          if (value.toLocaleLowerCase() === 'abcd') {
            return 'abcd is not a real last name!'
          }

          if (value.toLocaleLowerCase() === 'abc') {
            return 'abc is not a real last name!'
          }

          return null
        }}
      >
        <Input
          autoCapitalize='none'
          autoCorrect='off'
          spellCheck={false}
          data-slot='input'
          className={inputClasses}
        />
        <Field.Error className='text-sm text-red-500' />
      </Field.Root>

      <button
        className='w-full cursor-pointer rounded-[0.375em] border border-blue-700 bg-blue-500 px-2 py-1 font-medium text-white uppercase'
        disabled={submitting}
        type='submit'
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </Form>
  )
}
