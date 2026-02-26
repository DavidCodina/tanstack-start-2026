import { AlertDialog } from '@base-ui/react/alert-dialog'
import { cn } from '@/utils'

export type AlertDialogCloseProps = AlertDialog.Close.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const AlertDialogClose = ({
  className = '',
  ...otherProps
}: AlertDialogCloseProps) => {
  return (
    <AlertDialog.Close
      {...otherProps}
      data-slot='alert-dialog-close'
      className={(dialogCloseState) => {
        if (typeof className === 'function') {
          className = className(dialogCloseState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
