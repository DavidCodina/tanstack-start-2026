import { Tooltip } from '@base-ui/react/tooltip'
import { cn } from '@/utils'

export type TooltipPortalProps = Tooltip.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */
// A portal element that moves the popup to a different part of the DOM.
// By default, the portal element is appended to <body>. Renders a <div> element.

export const TooltipPortal = ({
  className,
  ...otherProps
}: TooltipPortalProps) => {
  return (
    <Tooltip.Portal
      {...otherProps}
      data-slot='tooltip-portal'
      className={(tooltipPortalState) => {
        if (typeof className === 'function') {
          className = className(tooltipPortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
