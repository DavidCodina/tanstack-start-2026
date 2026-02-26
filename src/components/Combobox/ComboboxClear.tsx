import { Combobox } from '@base-ui/react/combobox'
import { X } from 'lucide-react'
import { cn } from '@/utils'

export type ComboboxClearProps = Combobox.Clear.Props

// Combobox.Clear does not set data-valid/invalid/disabled,
// so we need to check higher up in the component hierarchy.
const FIELD_VALID_MIXIN = `
not-group-data-validating/root:group-data-valid/root:not-group-data-disabled/root:text-success
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:group-data-invalid/root:not-group-data-disabled/root:text-destructive
`

const FIELD_DISABLED_MIXIN = `
group-data-disabled/root:text-neutral-400
`

const baseClasses = `
flex items-center justify-center h-full
p-0 cursor-pointer
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const ComboboxClear = ({
  className,
  ...otherProps
}: ComboboxClearProps) => {
  return (
    <Combobox.Clear
      children={<X className='mx-[0.125em] size-[1em]' />}
      {...otherProps}
      aria-label='Clear selection'
      data-slot='combobox-clear'
      className={(comboboxClearState) => {
        if (typeof className === 'function') {
          className = className(comboboxClearState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
