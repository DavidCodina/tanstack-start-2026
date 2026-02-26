import { Dialog } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/utils'

export type InternalDialogCloseProps = Dialog.Close.Props & {
  closeButton?: boolean
}

const FOCUS_MIXIN = `
focus-visible:ring-[2px]
focus-visible:ring-(--dialog-accent-color)/50
focus-visible:outline-none
`

const baseClasses = `
appearance-none
inline-flex items-center justify-center
absolute top-3 right-3
rounded-full cursor-pointer
text-(--dialog-accent-color)
opacity-80 transition-opacity
hover:opacity-100
data-disabled:pointer-events-none
[&_svg]:pointer-events-none
[&_svg]:shrink-0
[&_svg:not([class*='size-'])]:size-6
${FOCUS_MIXIN}
`

/* ========================================================================

======================================================================== */

export const InternalDialogClose = ({
  closeButton = true,
  className = '',
  ...otherProps
}: InternalDialogCloseProps) => {
  /* ======================
          return
  ====================== */

  if (!closeButton) {
    return null
  }

  if (closeButton === true) {
    return (
      <Dialog.Close
        {...otherProps}
        aria-label='Close'
        data-slot='internal-dialog-close'
        className={(dialogCloseState) => {
          if (typeof className === 'function') {
            className = className(dialogCloseState) || ''
          }
          return cn(baseClasses, className)
        }}
      >
        <XIcon />
        <span className='sr-only'>Close</span>
      </Dialog.Close>
    )
  }
}
