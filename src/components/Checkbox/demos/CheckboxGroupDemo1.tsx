import * as React from 'react'
import { toast } from 'sonner'
import { FieldItem, FieldLabel } from '../../Field'

import { CheckboxGroup, CheckboxIndicator, CheckboxRoot } from '../.'
import { Button } from '@/components'
import { sleep } from '@/utils'

const checkboxes = [
  { id: '1', value: 'peanut', label: 'Peanut' },
  { id: '2', value: 'hazelnut', label: 'Hazelnut' },
  { id: '3', value: 'pistachio nut', label: 'Pistachio Nut' },
  { id: '4', value: 'red pistachio nut', label: 'Red Pistachio Nut' }
]

/* ========================================================================

======================================================================== */

export const CheckboxGroupDemo1 = () => {
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)

  /* ======================

  ====================== */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const checkboxValues = formData.getAll('nuts')

    await sleep(1000)
    toast.success(`Checkbox values: [${checkboxValues.join(', ')}]`)

    setResetKey((v) => v + 1)
    setSubmitting(false)
  }

  /* ======================
          return
  ====================== */

  return (
    <form
      noValidate
      key={resetKey}
      className='bg-card mx-auto max-w-[250px] space-y-2 rounded-lg border p-2 shadow'
      onSubmit={handleSubmit}
    >
      <CheckboxGroup
        fieldRootProps={{
          // validating: true,
          invalid: undefined,
          name: 'nuts' // This will pass name="nuts" to all child <input> elements.
        }}
        checkboxGroupProps={{
          // children: (
          //   <>
          //     {checkboxes.map((item) => {
          //       return (
          //         <FormCheck key={item.id}>
          //           <CheckboxRoot id={item.id} value={item.value}>
          //             <CheckboxIndicator />
          //           </CheckboxRoot>
          //           <CheckboxFieldLabel htmlFor={item.id}>
          //             {item.label}
          //           </CheckboxFieldLabel>
          //         </FormCheck>
          //       )
          //     })}
          //   </>
          // ),
          defaultValue: [],
          // For onValueChange to work, CheckboxGroup needs either:
          // value (controlled) — you manage state and pass it in
          // defaultValue (uncontrolled) — Base UI manages state internally
          // Without one of these, Base UI doesn’t initialize its state tracking, so onValueChange won’t fire.
          onValueChange: (value, _eventDetails) => {
            console.log('onValueChange:', value)
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
    </form>
  )
}
