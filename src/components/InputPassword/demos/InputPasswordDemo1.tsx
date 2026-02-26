import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { InputPassword } from '../'
import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const InputPasswordDemo1 = () => {
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
      onFormSubmit={async (formValues, _eventDetails) => {
        setSubmitting(true)
        setErrors({})
        const formErrors: Record<string, string> = {}
        await sleep(1000)

        const password = formValues.password

        if (typeof password !== 'string') {
          formErrors.password = 'Invalid type.'
        } else if (password === '12345') {
          formErrors.password = 'Only an idiot would use that password!'
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
      errors={errors}
    >
      <InputPassword
        fieldRootProps={{
          // disabled: true,
          name: 'password',
          forceValidity: false,
          validating: submitting,
          validate: (value, _formValues) => {
            console.log('validate callback ran...')

            if (typeof value !== 'string') {
              return 'Invalid type.'
            }

            if (value.length < 5) {
              return 'Must be at least 5 characters.'
            }
            return null
          }
        }}
        inputProps={{
          fieldSize: 'sm',
          placeholder: 'Password...'
        }}
        fieldLabelProps={{
          children: 'Password',
          labelRequired: true
        }}
        fieldErrorProps={{}}
        fieldDescriptionProps={{
          children: 'Toggle icon to show/hide password.'
        }}
      />
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
