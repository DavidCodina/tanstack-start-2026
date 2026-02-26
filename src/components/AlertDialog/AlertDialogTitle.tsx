import { AlertDialog } from '@base-ui/react/alert-dialog'
import { cn } from '@/utils'

export type AlertDialogTitleProps = AlertDialog.Title.Props

const baseClasses = `text-(--dialog-accent-color) text-lg leading-none font-semibold`

/* ========================================================================

======================================================================== */

export const AlertDialogTitle = ({
  className = '',
  ...otherProps
}: AlertDialogTitleProps) => {
  return (
    <AlertDialog.Title
      {...otherProps}
      data-slot='alert-dialog-title'
      className={(dialogTitleState) => {
        if (typeof className === 'function') {
          className = className(dialogTitleState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
