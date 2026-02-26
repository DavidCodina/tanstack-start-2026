import { Popover } from '@base-ui/react/popover'
import { cn } from '@/utils'

export type PopoverPositionerProps = Popover.Positioner.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const PopoverPositioner = ({
  className = '',
  ...otherProps
}: PopoverPositionerProps) => {
  return (
    <Popover.Positioner
      sideOffset={12}
      {...otherProps}
      data-slot='popover-positioner'
      className={(popoverPositionerState) => {
        if (typeof className === 'function') {
          className = className(popoverPositionerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
