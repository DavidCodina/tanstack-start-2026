import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/utils'

export type DialogBackdropProps = Dialog.Backdrop.Props

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

export const DialogBackdrop = ({
  className = '',
  ...otherProps
}: DialogBackdropProps) => {
  return (
    <Dialog.Backdrop
      {...otherProps}
      data-slot='dialog-backdrop'
      className={(dialogBackdropState) => {
        if (typeof className === 'function') {
          className = className(dialogBackdropState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
