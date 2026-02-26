import { Popover } from '@base-ui/react/popover'
import { cn } from '@/utils'

export type PopoverDescriptionProps = Popover.Description.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const PopoverDescription = ({
  className = '',
  ...otherProps
}: PopoverDescriptionProps) => {
  return (
    <Popover.Description
      {...otherProps}
      data-slot='popover-description'
      className={(popoverDescriptionState) => {
        if (typeof className === 'function') {
          className = className(popoverDescriptionState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
