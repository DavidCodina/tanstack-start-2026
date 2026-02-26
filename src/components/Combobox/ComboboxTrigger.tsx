import { Combobox } from '@base-ui/react/combobox'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils'

export type ComboboxTriggerProps = Combobox.Trigger.Props

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:text-success
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:text-destructive
`

const FIELD_DISABLED_MIXIN = `
data-disabled:text-neutral-400
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
// Clicking on the Combobox.Input or Combobox.Trigger will open the menu.

export const ComboboxTrigger = ({
  className,
  ...otherProps
}: ComboboxTriggerProps) => {
  return (
    <Combobox.Trigger
      children={<ChevronDown className='mx-[0.125em] size-[1.25em]' />}
      {...otherProps}
      aria-label='Open popup'
      data-slot='combobox-trigger'
      className={(comboboxTriggerState) => {
        if (typeof className === 'function') {
          className = className(comboboxTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
