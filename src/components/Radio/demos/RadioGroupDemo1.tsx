'use client'

import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'

import { RadioGroup, RadioIndicator, RadioRoot } from '../.'
import { FieldItem, FieldLabel } from '../../Field'
import type { FormActions } from '@base-ui/react/form'
import { Button } from '@/components'
import { sleep } from '@/utils'

const radios = [
  { id: '1', value: 'peanut', label: 'Peanut' },
  { id: '2', value: 'hazelnut', label: 'Hazelnut' },
  { id: '3', value: 'pistachio nut', label: 'Pistachio Nut' },
  { id: '4', value: 'red pistachio nut', label: 'Red Pistachio Nut' },
  { id: '5', value: 'seasonal nut', label: 'Seasonal Nut' }
]

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// You've hit a known limitation in Base UI that was recently addressed.
// The issue you're experiencing with duplicate IDs has been fixed in
// PR #2810, which introduced the new Field.Item component that was merged on October 16, 2025.
//
// When using multiple Field.Label components within a single Field.Root, Base UI was generating
// multiple individual items in a group.
//
// The Solution: Use Field.Item
// Base UI now provides a Field.Item component specifically for this use case. Here's how to fix your code:
//
// Key Points
//
// Wrap each radio in Field.Item: This creates a separate Field context for each individual radio button
// No need for Fieldset: You can use it for grouping semantics, but it's not required to fix the duplicate ID issue
// Each Field.Item gets its own ID context: This prevents the duplicate ID problem you were experiencing
//
// Based on my research, the duplicate ID issue affects BOTH Checkbox and Radio equally. The GitHub issue #2172
// specifically mentions both components in its title: "[field][checkbox][radio group] Enable label and description on individual controls".
//
///////////////////////////////////////////////////////////////////////////

export const RadioGroupDemo1 = () => {
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

        const nut = formValues.nut
        await sleep(1000)

        // Conceptually, this mocks out the idea that a call to the server was made
        // and seasonal nuts were out of stock.
        if (nut === 'seasonal nut') {
          formErrors.nut = 'The seasonal nut is currently unavailable.'
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
      // validationMode='onBlur'
    >
      <RadioGroup
        fieldRootProps={{
          // disabled: true,
          forceValidity: false,
          validating: submitting,
          name: 'nut', // This will pass name="nut" to all child <input> elements.

          validate: (value, _formValues) => {
            if (!value) return 'You must select a nut.'
            if (value === 'seasonal nut') {
              return 'The seasonal nut is currently unavailable.'
            }
            return null
          }
        }}
        radioGroupProps={{
          // defaultValue: 'hazelnut'
          onValueChange: (value, _eventDetails) => {
            console.log('onValueChange:', value)
          }
        }}
        radioGroupLabelProps={{
          children: 'Nuts'
        }}
        fieldDescriptionProps={{
          children: 'Select a nut'
        }}
      >
        {radios.map((item) => {
          return (
            <FieldItem key={item.id}>
              <RadioRoot
                // ❌ id={item.id}
                value={item.value}
              >
                <RadioIndicator />
              </RadioRoot>
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
      </RadioGroup>

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
