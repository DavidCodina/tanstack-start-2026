import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/utils'

export type DialogDescriptionProps = Dialog.Description.Props

const baseClasses = `text-muted-foreground text-sm`

/* ========================================================================

======================================================================== */

export const DialogDescription = ({
  className = '',
  ...otherProps
}: DialogDescriptionProps) => {
  return (
    <Dialog.Description
      {...otherProps}
      data-slot='dialog-description'
      className={(dialogDescriptionState) => {
        if (typeof className === 'function') {
          className = className(dialogDescriptionState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
