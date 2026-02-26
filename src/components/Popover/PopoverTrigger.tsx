import { Popover } from '@base-ui/react/popover'
import { cn } from '@/utils'

export type PopoverTriggerProps = Popover.Trigger.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const PopoverTrigger = ({
  className,
  ...otherProps
}: PopoverTriggerProps) => {
  return (
    <Popover.Trigger
      {...otherProps}
      data-slot='popover-trigger'
      className={(popoverTriggerState) => {
        if (typeof className === 'function') {
          className = className(popoverTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
