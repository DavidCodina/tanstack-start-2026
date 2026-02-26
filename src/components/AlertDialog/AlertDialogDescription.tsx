import { AlertDialog } from '@base-ui/react/alert-dialog'
import { cn } from '@/utils'

export type AlertDialogDescriptionProps = AlertDialog.Description.Props

const baseClasses = `text-muted-foreground text-sm`

/* ========================================================================

======================================================================== */

export const AlertDialogDescription = ({
  className = '',
  ...otherProps
}: AlertDialogDescriptionProps) => {
  return (
    <AlertDialog.Description
      {...otherProps}
      data-slot='alert-dialog-description'
      className={(dialogDescriptionState) => {
        if (typeof className === 'function') {
          className = className(dialogDescriptionState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
