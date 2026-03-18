import { Field } from '@base-ui/react/field'
import { Slider } from '@base-ui/react/slider'

/* ========================================================================

======================================================================== */
// See: https://github.com/mui/base-ui/issues/4090
// This was happening as of  "@base-ui/react": "^1.2.0"
// It seems to be fixed as of version 1.3.0.

export const SliderBugDemo = () => {
  return (
    <Field.Root
      validate={(value, _formValues) => {
        console.log('validating value:', value)
        if (typeof value !== 'number') {
          return 'Invalid type.'
        }

        if (value < 50) {
          return 'Value must be 50 or greater.'
        }

        return null
      }}
    >
      <Slider.Root defaultValue={50}>
        <Slider.Control className='flex touch-none items-center py-3 select-none'>
          <Slider.Track className='h-1 w-full rounded bg-gray-200 shadow-[inset_0_0_0_1px] shadow-gray-200 select-none'>
            <Slider.Indicator className='rounded bg-gray-700 select-none data-invalid:bg-red-500 data-valid:bg-green-500' />
            <Slider.Thumb
              aria-label='Volume'
              className='size-4 rounded-full bg-white outline-1 outline-gray-300 select-none has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue-800'
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </Field.Root>
  )
}
