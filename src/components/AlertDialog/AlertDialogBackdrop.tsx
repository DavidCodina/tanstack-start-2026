import { AlertDialog } from '@base-ui/react/alert-dialog'
import { cn } from '@/utils'

export type AlertDialogBackdropProps = AlertDialog.Backdrop.Props

// Removed the following. Not sure what it was for.
// supports-[-webkit-touch-callout:none]:absolute
const baseClasses = `
fixed inset-0 min-h-dvh 
bg-black/50
transition-all duration-150
data-[ending-style]:opacity-0
data-[starting-style]:opacity-0
`

/* ========================================================================

======================================================================== */

export const AlertDialogBackdrop = ({
  className = '',
  ...otherProps
}: AlertDialogBackdropProps) => {
  return (
    <AlertDialog.Backdrop
      {...otherProps}
      data-slot='alert-dialog-backdrop'
      className={(dialogBackdropState) => {
        if (typeof className === 'function') {
          className = className(dialogBackdropState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
