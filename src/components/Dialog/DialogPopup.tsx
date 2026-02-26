import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/utils'

export type DialogPopupProps = Dialog.Popup.Props

const baseClasses = `
relative 
flex flex-col w-full bg-card
border border-(--dialog-accent-color) rounded-(--dialog-border-radius)
shadow-[0_3px_10px_rgb(0,0,0,0.35)]
pointer-events-auto
transition-all duration-150
focus:outline-none
not-group-data-fullscreen:data-[ending-style]:scale-90
not-group-data-fullscreen:data-[ending-style]:opacity-0
not-group-data-fullscreen:data-[starting-style]:scale-90
not-group-data-fullscreen:data-[starting-style]:opacity-0
`

/* ========================================================================

======================================================================== */

export const DialogPopup = ({
  className = '',
  initialFocus = false,
  ...otherProps
}: DialogPopupProps) => {
  return (
    <Dialog.Popup
      initialFocus={initialFocus}
      {...otherProps}
      data-slot='dialog-popup'
      className={(dialogPopupState) => {
        if (typeof className === 'function') {
          className = className(dialogPopupState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
