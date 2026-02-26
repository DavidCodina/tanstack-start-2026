import { AlertDialog } from '@base-ui/react/alert-dialog'
import { cn } from '@/utils'

export type AlertDialogTriggerProps = AlertDialog.Trigger.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const AlertDialogTrigger = ({
  className = '',
  ...otherProps
}: AlertDialogTriggerProps) => {
  return (
    <AlertDialog.Trigger
      {...otherProps}
      datatype='alert-dialog-trigger'
      className={(dialogTriggerState) => {
        if (typeof className === 'function') {
          className = className(dialogTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
