import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/utils'

export type DialogCloseProps = Dialog.Close.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const DialogClose = ({
  className = '',
  ...otherProps
}: DialogCloseProps) => {
  return (
    <Dialog.Close
      {...otherProps}
      data-slot='dialog-close'
      className={(dialogCloseState) => {
        if (typeof className === 'function') {
          className = className(dialogCloseState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
