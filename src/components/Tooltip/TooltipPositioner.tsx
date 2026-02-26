import { Tooltip } from '@base-ui/react/tooltip'
import { cn } from '@/utils'

export type TooltipPositionerProps = Tooltip.Positioner.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const TooltipPositioner = ({
  className,
  ...otherProps
}: TooltipPositionerProps) => {
  return (
    <Tooltip.Positioner
      sideOffset={12}
      {...otherProps}
      data-slot='tooltip-positioner'
      className={(tooltipPositionerState) => {
        if (typeof className === 'function') {
          className = className(tooltipPositionerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
