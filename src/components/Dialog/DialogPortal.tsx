import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/utils'

export type DialogPortalProps = Dialog.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */
// A portal element that moves the popup to a different part of the DOM.
// By default, the portal element is appended to <body>. Renders a <div> element.

export const DialogPortal = ({
  className = '',
  ...otherProps
}: DialogPortalProps) => {
  return (
    <Dialog.Portal
      {...otherProps}
      data-slot='dialog-portal'
      className={(dialogPortalState) => {
        if (typeof className === 'function') {
          className = className(dialogPortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
