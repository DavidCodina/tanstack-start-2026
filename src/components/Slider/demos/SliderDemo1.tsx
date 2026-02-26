import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { Slider } from '../.'
import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */
// Note: As of v1.2.0, there seems to be a bug where Slider validation occurs
// immediately after clicking and dragging the thumb.
// https://github.com/mui/base-ui/issues/4090

export const SliderDemo1 = () => {
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

        const range = formValues.range

        if (!Array.isArray(range)) {
          formErrors.range = 'Invalid type.'
        } else {
          const [min, max] = range

          if (typeof min !== 'number' || typeof max !== 'number') {
            formErrors.range = 'Invalid type.'
          } else if (min < 40 || max > 60) {
            formErrors.range = 'The range must be between 40 and 60.'
          }
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
      <Slider
        fieldRootProps={{
          //  disabled: true,
          name: 'range',
          // validationMode: 'onSubmit', // - not respected due to bug.
          forceValidity: false,
          validating: submitting,
          //This validate function assumes an array of two numbers.
          validate: (value, _formValues) => {
            if (!Array.isArray(value)) {
              return 'Invalid type.'
            }

            const [min, max] = value

            if (typeof min !== 'number' || typeof max !== 'number') {
              return 'Invalid type.'
            }

            if (min < 25 || max > 75) {
              return 'The range must be between 25 and 75.'
            }

            return null
          }
        }}
        fieldLabelProps={{
          children: 'Amount',
          labelRequired: true
        }}
        sliderRootProps={{
          // defaultValue: 50,
          defaultValue: [25, 75],
          // defaultValue: [25, 50, 75]
          min: 0,
          max: 100,

          onValueCommitted: (value, _eventDetails) => {
            console.log('onValueCommitted:', value)
          }
        }}
        sliderThumbProps={{
          'aria-label': ['Minimum Amount', 'Maximum Amount']
          // showValue: false
        }}
        fieldDescriptionProps={{
          children: 'Select a range'
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
