import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { Apple } from 'lucide-react'

import { Select } from '../Select'
import { SelectItem } from '../SelectItem'
import type { FormActions } from '@base-ui/react/form'
import type { Select as SelectPrimitive } from '@base-ui/react/select'
import { Button } from '@/components'
import { sleep } from '@/utils'

const items = [
  { label: 'Gala Apple', value: 'gala' },
  {
    label: (
      <span className='flex items-center gap-1'>
        <Apple className='size-[1em]' /> Fuji Apple
      </span>
    ),
    value: 'fuji'
  },
  { label: 'Honeycrisp Apple', value: 'honeycrisp' },
  { label: 'Granny Smith Apple', value: 'granny-smith' },
  { label: 'Pink Lady Apple', value: 'pink-lady' },
  {
    label: `Red Delicious Apple With A Very Long Label For Testing Purposes - The tex will wrap when it needs to.`,
    value: 'red-delicious'
  },
  { label: 'Seasonal Apple', value: 'seasonal' },
  //...
  { label: 'Gala Pink Apple', value: 'gala-pink' },
  { label: 'Fuji Pink Apple', value: 'fuji-pink' },
  { label: 'Honeycrisp Pink Apple', value: 'honeycrisp-pink' },
  { label: 'Granny Smith Pink Apple', value: 'granny-smith-pink' },
  { label: 'Pink Lady Pink Apple', value: 'pink-lady-pink' }
]

/* ========================================================================

======================================================================== */

// Bonus: Review Base UI Select props in general.
// https://base-ui.com/react/components/select#object-values
//
// Unexamined Base UI Select components:
// Select.Backdrop
// Select.Group
// Select.GroupLabel
// Select.Separator

export const SelectDemo1 = () => {
  const actionsRef = React.useRef<FormActions>(null)
  // actionsRef.current: {unmount: ƒ}
  // unmount: When specified, the select will not be unmounted when closed.
  // Instead, the unmount function must be called to unmount the select manually.
  // Useful when the select's animation is controlled by an external library.
  // So unmount is purely an animation lifecycle escape hatch.
  const selectActionsRef = React.useRef<SelectPrimitive.Root.Actions>(null)

  const formRef = React.useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  /* ======================
        renderItems()
  ====================== */

  const renderItems = () => {
    return items.map(({ label, value }, index) => (
      <SelectItem
        // I was using label as the key, but that's not possible if one or more items is JSX.
        key={index}
        children={label}
        selectItemTextProps={{
          children: label,
          style: {}
        }}
        selectItemIndicatorProps={{}}
        value={value}
      />
    ))
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <Form
        noValidate
        actionsRef={actionsRef}
        ref={formRef}
        key={resetKey}
        className='bg-card mx-auto max-w-[600px] space-y-2 rounded-lg border p-2 shadow'
        // onSubmit={(e) => {
        //   e.preventDefault()
        //   e.stopPropagation()
        // }}

        onFormSubmit={async (formValues, _eventDetails) => {
          setSubmitting(true)
          setErrors({})
          const formErrors: Record<string, string> = {}

          const apple = formValues.apple
          await sleep(1000)

          if (apple === 'seasonal') {
            formErrors.apple = 'The seasonal apple is currently unavailable.'
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
        // validationMode='onChange'
      >
        <Select
          fieldRootProps={{
            id: 'select-field-root-id',
            name: 'apple',
            className: (_fieldRootState) => {
              return ''
            },

            // disabled: true,
            forceValidity: false,
            validating: submitting,

            validate: (value, _formValues) => {
              if (!value) return 'You must select a value.'
              // if (value === 'seasonal') {
              //   return 'The seasonal apple is currently unavailable.'
              // }
              return null
            }
          }}
          fieldLabelProps={{
            children: 'Apples',
            labelRequired: true
          }}
          selectRootProps={{
            actionsRef: selectActionsRef,
            id: 'select-trigger-id',
            ///////////////////////////////////////////////////////////////////////////
            //
            // When specified, <Select.Value> renders the label of the selected item instead of the raw value.
            // Above, renderItems() sets the label for the associated menu item, but to actually get it to the
            // Select.Value, within the SelectTrigger implementation we need this extra step. In theory, it's
            // possible to build an implementation that internally reads from the selectItemTextProp.children,
            // and then sets the Select.Value accordingly. However, Base UI did not implement this internally.
            // Instead, they rely on this external measure.
            //
            ///////////////////////////////////////////////////////////////////////////
            items: items
            // modal: true,
            // multiple: true
          }}
          selectTriggerProps={{
            placeholder: 'Select An Apple'
          }}
          selectPortalProps={{}}
          selectPositionerProps={{
            // Causes data-side="none" and can use group-data-[side=none]: ... on itemBaseClasses.
            // alignItemWithTrigger: true
            side: 'top'
          }}
          selectPopupProps={{}}
          selectListProps={{}}
          fieldErrorProps={{}}
          fieldDescriptionProps={{
            children: 'Select an apple'
          }}
        >
          {renderItems()}
        </Select>

        <Button
          loading={submitting}
          className='flex w-full'
          type='submit'
          size='sm'
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
    </>
  )
}
