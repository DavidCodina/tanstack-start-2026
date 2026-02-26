import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { Input } from '../'
import type { FieldRootProps } from '@base-ui/react/field'
import { Button } from '@/components'
import { sleep } from '@/utils'

// export type Errors = Record<string, string | string[]>;
// type FormErrors = Form.Props['errors']

type Validate = FieldRootProps['validate']

/* ======================
      validateFile()
  ====================== */

const _validateFile: Validate = (value, _formValues) => {
  let error = ''

  if (value === '') {
    error = 'Required'
    return error
  }

  if (!(value instanceof File)) {
    error = 'Invalid type'
    return error
  }

  // Example check: limit file size to 5MB
  if (value.size > 5 * 1024 * 1024) {
    error = 'File size must be less than 5MB'
    return error
  }

  return null
}

/* ========================================================================

======================================================================== */
// https://base-ui.com/react/components/form

export const Demo2 = () => {
  // ⚠️ Gotcha: The resetKey MUST be set on all form fields to truly reset them.
  // In other words, to reset the value, the touched state, etc.
  const actionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  return (
    <Form
      noValidate
      actionsRef={actionsRef}
      ref={formRef}
      key={resetKey}
      className='bg-card mx-auto max-w-[600px] space-y-2 rounded-lg border p-2 shadow'
      // This only runs when all the validation passes.
      // In practice, this means there's no way of externalizing errors that are triggered through
      // validate functions. That said, you can start from the other way around and run validation
      // externally through Zod.
      onFormSubmit={async (formValues, _eventDetails) => {
        // This prop calls e.preventDefault() internally.
        // The native onSubmit does NOT.

        setSubmitting(true)
        setErrors({})
        const formErrors: Record<string, string> = {}
        await sleep(1000)

        const lastName = formValues.lastName

        if (typeof lastName !== 'string') {
          formErrors.lastName = 'Invalid type.'
        } else if (lastName === 'Doe') {
          formErrors.lastName = "That's not a real last name!"
        }

        const isErrors = Object.keys(formErrors).length > 0

        if (isErrors) {
          setErrors(formErrors)
          setSubmitting(false)
          toast.error(`Please fix errors.`)
          return
        }

        toast.success(`Form submitted successfully.`)

        setSubmitting(false)
        setTimeout(() => {
          setResetKey((v) => v + 1)
        }, 4000)
      }}
      // 'onSubmit' is the default. It's a compromise between no
      // immediate 'onBlur' behavior and no constant 'onChange'.
      // validationMode='onSubmit'
      errors={errors}
    >
      <Input
        fieldRootProps={{
          // className: 'max-w-[600px] mx-auto',
          // disabled: true,
          // invalid: true,
          forceValidity: false,
          validating: submitting,
          name: 'lastName',
          validate: (value, _formValues) => {
            console.log('validate callback ran...')
            let error = ''

            if (typeof value !== 'string') {
              error = 'Invalid type'
              return error
            }

            if (!value || value.length < 2) {
              error = 'Must be at least 2 characters'
              return error
            }

            return null // You must return null to indicate no error.
          }
        }}
        inputProps={{
          fieldSize: 'sm',
          placeholder: 'Last Name'
        }}
        fieldLabelProps={{
          children: 'Last Name'
        }}
      />

      {/* <Input
        fieldRootProps={{
          name: 'my-file',
          validate: validateFile
        }}
        inputProps={{
          fieldSize: 'sm',
          type: 'file'
        }}
        fieldLabelProps={{
          children: 'Your File'
        }}
      /> */}

      <Button
        loading={submitting}
        className='flex w-full'
        type='submit'
        size='sm'
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </Form>
  )
}
