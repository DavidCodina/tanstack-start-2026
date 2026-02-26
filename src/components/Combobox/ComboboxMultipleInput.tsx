import { Combobox } from '@base-ui/react/combobox'
import { cn } from '@/utils'

export type ComboboxMultipleInputProps = Combobox.Input.Props

const baseClasses = `
flex flex-1
w-full min-w-0
bg-transparent
border-none outline-none
`

/* ========================================================================

======================================================================== */

export const ComboboxMultipleInput = ({
  className = '',
  ...otherProps
}: ComboboxMultipleInputProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Combobox.Input
      {...otherProps}
      data-slot='combobox-input'
      className={(comboboxInputState) => {
        if (typeof className === 'function') {
          className = className(comboboxInputState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
