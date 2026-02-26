import { useDebouncedCallback } from '@tanstack/react-pacer'
import { Input } from '@/components/Input'

/* ========================================================================

======================================================================== */
// https://tanstack.com/pacer/latest/docs/framework/react/examples/useDebouncedCallback
// https://tanstack.com/pacer/latest/docs/guides/debouncing

export const UseDebouncedCallback = () => {
  const handleChange = (value: unknown) => {
    console.log('new value:', value)
  }

  const debouncedHandleChange = useDebouncedCallback(handleChange, {
    enabled: true, // Defaults to true.
    wait: 1000,
    leading: false // Defaults to false
  })

  return (
    <>
      <Input
        fieldRootProps={{
          className: 'max-w-[600px] mx-auto'
        }}
        inputProps={{
          fieldSize: 'sm',
          onValueChange: (value, _eventDetails) => {
            debouncedHandleChange(value)
          }
        }}
        fieldLabelProps={{
          children: 'Search'
        }}
      />
    </>
  )
}
