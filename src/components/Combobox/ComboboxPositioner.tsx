import { Combobox } from '@base-ui/react/combobox'
import { cn } from '@/utils'

export type ComboboxPositionerProps = Combobox.Positioner.Props

const baseClasses = `outline-none select-none z-49`

/* ========================================================================

======================================================================== */

export const ComboboxPositioner = ({
  className,
  ...otherProps
}: ComboboxPositionerProps) => {
  return (
    <Combobox.Positioner
      sideOffset={10}
      {...otherProps}
      data-slot='combobox-positioner'
      className={(comboboxPositionerState) => {
        if (typeof className === 'function') {
          className = className(comboboxPositionerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
