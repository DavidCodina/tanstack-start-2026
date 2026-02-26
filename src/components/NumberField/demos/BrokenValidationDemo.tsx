import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { NumberField } from '@base-ui/react/number-field'
import { Field } from '@base-ui/react/field'
import type { FormActions } from '@base-ui/react/form'

/* ========================================================================

======================================================================== */

export const BrokenValidationDemo = () => {
  const actionsRef = React.useRef<FormActions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [resetKey, _setResetKey] = React.useState(0)

  const id = React.useId()

  return (
    <Form
      noValidate
      actionsRef={actionsRef}
      ref={formRef}
      key={resetKey}
      className='bg-card mx-auto max-w-[600px] space-y-2 rounded-lg border p-2 shadow'
      errors={{ amount: 'This is invalid' }} // error hardcoded
    >
      <Field.Root
        data-slot='field-root'
        className='data-invalid:border-2 data-invalid:border-dashed data-invalid:border-red-500'
        name='amount'
        // validate={() => { return 'This is invalid' }}
        validationMode='onBlur'
      >
        <NumberField.Root
          data-slot='number-field-root'
          id={id}
          defaultValue={100}
          className='flex flex-col items-start gap-1 data-invalid:border-2 data-invalid:border-dashed data-invalid:border-orange-500'
        >
          <NumberField.ScrubArea
            data-slot='number-field-scrub-area'
            className='cursor-ew-resize'
          >
            <label
              htmlFor={id}
              className='cursor-ew-resize text-sm font-medium text-gray-900'
            >
              Amount
            </label>
            <NumberField.ScrubAreaCursor className='drop-shadow-[0_1px_1px_#0008] filter'>
              <CursorGrowIcon />
            </NumberField.ScrubAreaCursor>
          </NumberField.ScrubArea>

          <NumberField.Group
            data-slot='number-field-group'
            className='flex w-full data-invalid:border-2 data-invalid:border-dashed data-invalid:border-yellow-500'
          >
            <NumberField.Decrement className='flex size-10 items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100'>
              <MinusIcon />
            </NumberField.Decrement>
            <NumberField.Input className='h-10 flex-1 border-t border-b border-gray-200 text-center text-base text-gray-900 tabular-nums focus:z-1 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800' />
            <NumberField.Increment className='flex size-10 items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100'>
              <PlusIcon />
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>
      </Field.Root>
    </Form>
  )
}

function CursorGrowIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='26'
      height='14'
      viewBox='0 0 24 14'
      fill='black'
      stroke='white'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z' />
    </svg>
  )
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      stroke='currentcolor'
      strokeWidth='1.6'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M0 5H5M10 5H5M5 5V0M5 5V10' />
    </svg>
  )
}

function MinusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      stroke='currentcolor'
      strokeWidth='1.6'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d='M0 5H10' />
    </svg>
  )
}
