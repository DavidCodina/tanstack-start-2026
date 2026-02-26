import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { NumberField } from '../.'
import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const NumberFieldDemo1 = () => {
  const actionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  // const [value, setValue] = React.useState<number | null>(0)

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

        console.log('formValues:', formValues)
        if (typeof formValues.amount === 'number' && formValues.amount > 100) {
          formErrors.amount = "That's too high of an amount"
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
      <NumberField
        // hideControls
        fieldRootProps={{
          id: 'number-field-root-id',
          name: 'amount',
          // className: (_fieldRootState) => {
          //   return ''
          // },

          // disabled: true,
          forceValidity: false,
          validating: submitting,
          // invalid: true,

          validate: (value, _formValues) => {
            if (typeof value !== 'number') {
              return 'Required'
            }

            if (value <= 0) {
              return 'Value must be greater than 0'
            }

            return null
          }
        }}
        fieldLabelProps={{
          children: 'Amount',
          labelRequired: true
        }}
        numberFieldRootProps={
          {
            ///////////////////////////////////////////////////////////////////////////
            //
            // For more info on formatting, see my own formatCurrency.ts
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format
            //
            ///////////////////////////////////////////////////////////////////////////
            // format: { style: 'currency', currency: 'USD' },
            // No '$' in UI.
            // format: {
            //   minimumIntegerDigits: 1,
            //   minimumFractionDigits: 2,
            //   maximumFractionDigits: 2
            // },
            // Do this if you only want integers on blur.
            // format: { maximumFractionDigits: 0 },
            ///////////////////////////////////////////////////////////////////////////
            //
            // Do this if you wan a percent between 0 - 100% that prohibits fractional percents.
            // The actual ouput value will be a number between 0 - 1.
            //
            //   format: {
            //     style: 'percent',
            //     maximumFractionDigits: 2
            //   },
            //   min: 0,
            //   max: 1,
            //   step: 0.01,
            //   smallStep: 0.01,
            //   largeStep: 0.01,
            //
            ///////////////////////////////////////////////////////////////////////////
            // snapOnStep: true,
            // className: 'outline outline-dashed outline-pink-500'
            // defaultValue: 50,
            // Suppose you had a format of { maximumFractionDigits: 0 }
            // I you entered 1.9, internally it would be 2 before you even blurred.
            // Then when you blurred, it would be 2 in the UI.
            // This happens in both controlled and uncontrolled implementations.
            // onValueChange: (valueNumber, _eventDetails) => {
            //   console.log('onValueChange:', valueNumber)
            //   setValue(valueNumber)
            // },
            // value: value
            // Runs when you stop scrubbing.
            // onValueCommitted: (_valueNumber, _eventDetails) => {
            //   console.log('onValueCommitted:', _valueNumber)
            // }
          }
        }
        numberFieldGroupProps={{
          fieldSize: 'sm'
        }}
        numberFieldInputProps={{
          placeholder: 'Enter A Number...'
        }}
        fieldErrorProps={{}}
        fieldDescriptionProps={{
          children: 'Select an amount'
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
