import { Popover } from '@base-ui/react/popover'
import { cn } from '@/utils'

export type PopoverPortalProps = Popover.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */
// A portal element that moves the popup to a different part of the DOM.
// y default, the portal element is appended to <body>. Renders a <div> element.

export const PopoverPortal = ({
  className = '',
  ...otherProps
}: PopoverPortalProps) => {
  return (
    <Popover.Portal
      {...otherProps}
      data-slot='popover-portal'
      className={(popoverPortalState) => {
        if (typeof className === 'function') {
          className = className(popoverPortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
