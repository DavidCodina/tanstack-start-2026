import { Tooltip } from '@base-ui/react/tooltip'
import { cn } from '@/utils'

export type TooltipTriggerProps = Tooltip.Trigger.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const TooltipTrigger = ({
  className,
  ...otherProps
}: TooltipTriggerProps) => {
  return (
    <Tooltip.Trigger
      {...otherProps}
      data-slot='tooltip-trigger'
      className={(tooltipTriggerState) => {
        if (typeof className === 'function') {
          className = className(tooltipTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
