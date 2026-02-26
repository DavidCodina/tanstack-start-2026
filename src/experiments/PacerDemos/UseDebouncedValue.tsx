import * as React from 'react'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { Input } from '@/components/Input'

/* ========================================================================

======================================================================== */
// https://tanstack.com/pacer/latest/docs/framework/react/examples/useDebouncedValue

// Implement useDebouncedValue when you need access to the value AND the debounced value.
// This is great for controlled inputs where you need the value to update immediately, but
// the debounced value to update after a delay. Why? Again, maybe it's a search input where
// the search functionality is triggered by a useEffect() whenenver deboundedValue changes.

export const UseDebouncedValue = () => {
  const [value, setValue] = React.useState('')
  const [debouncedValue] = useDebouncedValue(value, {
    wait: 1000
  })

  return (
    <div className='mx-auto max-w-[600px] space-y-6'>
      <Input
        fieldRootProps={{
          className: ''
        }}
        inputProps={{
          className: 'shadow',
          fieldSize: 'sm',
          onValueChange: (value, _eventDetails) => {
            setValue(value)
          },

          value: value
        }}
        fieldLabelProps={{
          children: 'Search'
        }}
      />

      <div className='bg-card space-y-2 rounded-lg border p-2 shadow'>
        <div>
          <span className='text-primary font-semibold'>value: </span>
          <span className='text-pink-500'>{value}</span>
        </div>

        <div>
          <span className='text-primary font-semibold'>debouncedValue: </span>
          <span className='text-pink-500'>{debouncedValue}</span>
        </div>
      </div>
    </div>
  )
}
