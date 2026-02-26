import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { Combobox, itemMappingCallback } from '../.'
import { fruits } from './fruits'
// import type { Fruit } from './fruits'

import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const ComboboxDemo1 = () => {
  const actionsRef = React.useRef<Form.Actions>(null)
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
      className='bg-card mx-auto max-w-[600px] space-y-2 rounded-lg border p-2 shadow'
      onFormSubmit={async (formValues: { fruit: string }, _eventDetails) => {
        setSubmitting(true)
        setErrors({})
        const formErrors: Record<string, string> = {}

        await sleep(1000)

        // Form vs. Field behavior
        // The fieldRootProps.validate and comboboxRootProps.onValueChange
        // callbacks will return  {label, value } | null. For example:
        // { label: 'Grapefruit', value: 'grapefruit' }
        // However, here if no value is selected, it will be '', and
        // if a value is selected, it will be just the string.

        if (formValues.fruit === 'grapefruit') {
          formErrors.fruit = "That's disguting!"
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
      <Combobox
        fieldRootProps={{
          name: 'fruit',
          // disabled: true,
          forceValidity: false,
          validating: submitting,
          // validationMode: 'onBlur',
          validate: (value, _formValues) => {
            // Here value will be a { label, value } like { label: 'Plum', value: 'plum' }
            // If no value is selected, it will be null. However, if you're using <Form />
            // formValues.fruit will be the value string only or ''.
            if (!value) return 'Required'
            return null
          }
        }}
        comboboxRootProps={{
          items: fruits,

          onValueChange: (_value, _eventDetails) => {
            // console.log('onValueChange:', value) // => {label: 'Mango', value: 'mango'}
          },

          ///////////////////////////////////////////////////////////////////////////
          //
          // ⚠️ When the item values are objects (<Combobox.Item value={object}>), this function
          // converts the object value to a string representation for display in the input.
          // If the shape of the object is { value, label }, the label will be used automatically
          // without needing to specify this prop. Thus, it behaves like this:
          //
          //   itemToStringLabel: (itemValue: any) => itemValue.label }
          //
          // In practice, this means that the actual DOM <input> is given the label by default.
          // Consequently, the default inputValue passed to onInputValueChange will also be the label.
          //
          // This is very unintuitive, and kind of annoying, but it may be necessary in order
          // for the label shown in the UI to work.
          //
          ///////////////////////////////////////////////////////////////////////////

          // itemToStringLabel: (itemValue: any) => {
          //   return itemValue.label
          // },

          onInputValueChange: (inputValue, _eventDetails) => {
            console.log('onInputValueChange:', inputValue) // => 'Mango'
          }
        }}
        fieldLabelProps={{
          children: 'Choose a fruit',
          labelRequired: true
        }}
        comboboxInputContainerProps={{
          fieldSize: 'sm'
        }}
        comboboxInputProps={{
          placeholder: 'e.g. Apple'
        }}
        comboboxEmptyProps={{
          children: 'No fruits found'
        }}
      >
        {itemMappingCallback}
      </Combobox>

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
