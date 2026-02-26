import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { FieldItem, FieldLabel } from '../../Field'

import { CheckboxGroup, CheckboxIndicator, CheckboxRoot } from '../.'
import type { FormActions } from '@base-ui/react/form'
import { Button } from '@/components'
import { sleep } from '@/utils'

const checkboxes = [
  { id: '1', value: 'peanut', label: 'Peanut' },
  { id: '2', value: 'hazelnut', label: 'Hazelnut' },
  { id: '3', value: 'pistachio nut', label: 'Pistachio Nut' },
  { id: '4', value: 'red pistachio nut', label: 'Red Pistachio Nut' },
  { id: '5', value: 'seasonal nut', label: 'Seasonal Nut' }
]

/* ========================================================================

======================================================================== */

export const CheckboxGroupDemo2 = () => {
  const actionsRef = React.useRef<FormActions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  /* ======================
          return
  ====================== */

  return (
    <Form
      noValidate
      actionsRef={actionsRef}
      ref={formRef}
      key={resetKey}
      className='bg-card mx-auto max-w-[250px] space-y-2 rounded-lg border p-2 shadow'
      // onSubmit={(e) => {
      //   e.preventDefault()
      //   e.stopPropagation()
      // }}

      onFormSubmit={async (formValues, _eventDetails) => {
        setSubmitting(true)
        setErrors({})
        const formErrors: Record<string, string> = {}

        // formValues.nuts will be an array of the actual values from checked checkboxes,
        // so there's generally no need to do this kind of thing:
        // const currentTarget = eventDetails.event.target as HTMLFormElement
        // const formData = new FormData(currentTarget)
        // const checkedValues = formData.getAll('nuts')

        const nuts = formValues.nuts
        await sleep(1000)

        // Conceptually, this mocks out the idea that a call to the server was made
        // and seasonal nuts were out of stock.
        if (Array.isArray(nuts) && nuts.includes('seasonal nut')) {
          formErrors.nuts = 'The seasonal nut is currently unavailable.'
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
        }, 2000)
      }}
      errors={errors}
    >
      <CheckboxGroup
        fieldRootProps={{
          forceValidity: false,
          validating: submitting,
          // invalid: undefined,
          name: 'nuts', // This will pass name="nuts" to all child <input> elements.

          ///////////////////////////////////////////////////////////////////////////
          //
          // Field-level validation will prevent onFormSubmit from running when invalid.
          // It's also crucial to have field-level validation AFTER submitting. Otherwise,
          // any change made to a field will immediately result in a data-valid state.
          // Conversely, if you have field-level validation, then it will automatically run
          // onChange after submit.
          //
          // So... When using <Form> (i.e., not using Tanstack Form), field-level validators
          // should be on EVERYTHING, and form-level errors should only be used for
          // errors that come back from the server.
          //
          ///////////////////////////////////////////////////////////////////////////

          validate: (value, _formValues) => {
            if (!Array.isArray(value)) {
              return 'Invalid type'
            }

            if (value.length === 0) {
              return 'You must select at least one nut.'
            }

            return null
          }
        }}
        checkboxGroupProps={{
          defaultValue: [],
          // For onValueChange to work, CheckboxGroup needs either:
          // value (controlled) — you manage state and pass it in
          // defaultValue (uncontrolled) — Base UI manages state internally
          // Without one of these, Base UI doesn’t initialize its state tracking, so onValueChange won’t fire.
          // Here value will be an array of the actual values of checked checkboxes.
          onValueChange: (_value, _eventDetails) => {
            // console.log('onValueChange:', value)
          }
        }}
        checkboxGroupLabelProps={{
          children: 'Nuts'
        }}
        fieldDescriptionProps={{
          children: 'Select you nuts'
        }}
      >
        {/* Here we can use the data-driven approach from the outside.
        However, I've intentionally omitted the ability to pass a data object
        into the CheckboxGroup to have it do the mapping internally.
        It's more flexible and less convoluted to simply have the consumer
        pass in their own implementations. */}
        {checkboxes.map((item) => {
          return (
            <FieldItem key={item.id}>
              <CheckboxRoot
                // ❌ id={item.id}
                value={item.value}
              >
                <CheckboxIndicator />
              </CheckboxRoot>
              <FieldLabel
                // ⚠️ Gotcha: text-[0.875em] actually will reset the line-height to 1.5.
                // so you need to explicitly set leading-none again.
                className='text-[0.875em] leading-none'
                // FieldLabel is not wrapping RadioRoot like in many of the documentation examples.
                // However, as long as you have FieldItem, the assoication will be handled internally
                // by Base UI.
                // ❌ htmlFor={item.id}
              >
                {item.label}
              </FieldLabel>
            </FieldItem>
          )
        })}
      </CheckboxGroup>

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
