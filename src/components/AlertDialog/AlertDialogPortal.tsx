import { AlertDialog } from '@base-ui/react/alert-dialog'
import { cn } from '@/utils'

export type AlertDialogPortalProps = AlertDialog.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const AlertDialogPortal = ({
  className = '',
  ...otherProps
}: AlertDialogPortalProps) => {
  return (
    <AlertDialog.Portal
      {...otherProps}
      data-slot='alert-dialog-portal'
      className={(dialogPortalState) => {
        if (typeof className === 'function') {
          className = className(dialogPortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
