import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { ComboboxMultiple, itemMappingCallback } from '../../.'
import { langs } from './ProgrammingLanguage'
// import type { ProgrammingLanguage } from './ProgrammingLanguage'

import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const ComboboxMultipleDemo1 = () => {
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
      onFormSubmit={async (formValues, _eventDetails) => {
        setSubmitting(true)
        setErrors({})
        const formErrors: Record<string, string> = {}

        await sleep(1000)

        ///////////////////////////////////////////////////////////////////////////
        //
        // ⚠️ Gotcha: formValues.languages will be string[] when derived from
        // within onFormSubmit (assuming you're not storing languages in state
        // through a controlled implementation).
        //
        //   ['{"id":"py","value":"Python"}', '{"id":"ts","value":"TypeScript"}']
        //
        // What's happening here? It seems like Base UI is attempting to serialize
        // the value. The documentation for the ComboBox.Root itemToStringValue prop
        // states:
        //
        //   When the item values are objects... this function converts the object value
        //   to a string representation for form submission. If the shape of the object is
        //   { value, label }, the value will be used automatically without needing to specify this prop.
        //
        // Okay, so... the real problem here is that in the original example the objects were
        // merely { id, value } with no label property. Consequently, Base UI doesn't implement
        // the conversion automatically.
        //
        // The solution is to either manually tell Base UI Combobox how to convert the object:
        //
        //   itemToStringValue: (itemValue: any) => { return itemValue.value }
        //
        // However, an easier solution is to always include a label property in the
        // shape of the object items. This is reflected in the definition of StrictItem,
        // but obviously that's not enforced at runtime. Nor is it a good idea to throw
        // errors with type guards against dynamic data. Ultimately, it's up to the developer
        // to remember this as a best practice.
        //
        ///////////////////////////////////////////////////////////////////////////

        if (!Array.isArray(formValues.languages)) {
          formErrors.languages = 'Invalid type'
        }

        const foundRuby = formValues.languages.find(
          (lang: any) => lang === 'ruby'
        )

        if (foundRuby) {
          formErrors.languages = 'Ruby sucks!'
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
      <ComboboxMultiple
        fieldRootProps={{
          name: 'languages',
          // disabled: true,
          forceValidity: false,
          validating: submitting,
          validationMode: 'onChange',
          validate: (value, _formValues) => {
            console.log('value from validate:', value)
            if (!Array.isArray(value)) {
              return 'Invalid type'
            }
            if (value.length === 0) {
              return 'Required'
            }
            return null
          }
        }}
        fieldLabelProps={{
          children: 'Programming Languages...',
          labelRequired: true
        }}
        comboboxRootProps={{
          items: langs,

          onValueChange: (_value, _eventDetails) => {
            // console.log('onValueChange:', value) // => {label: 'Mango', value: 'mango'}
          },

          onInputValueChange: (_inputValue, _eventDetails) => {
            // console.log('onInputValueChange:', inputValue) // => 'Mango'
          }
        }}
        comboboxChipsProps={{
          fieldSize: 'sm'
        }}
        comboboxInputProps={{
          placeholder: 'e.g. TypeScript'
        }}
        comboboxEmptyProps={{
          children: 'No languages found.'
        }}
        comboboxListProps={
          {
            // children: itemMappingCallback
          }
        }
        fieldDescriptionProps={{
          children: 'Select one or more languages.'
        }}
      >
        {itemMappingCallback}
      </ComboboxMultiple>

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
