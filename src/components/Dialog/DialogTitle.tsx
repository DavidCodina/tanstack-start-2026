import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/utils'

export type DialogTitleProps = Dialog.Title.Props

const baseClasses = `text-(--dialog-accent-color) text-lg leading-none font-semibold`

/* ========================================================================

======================================================================== */

export const DialogTitle = ({
  className = '',
  ...otherProps
}: DialogTitleProps) => {
  return (
    <Dialog.Title
      {...otherProps}
      data-slot='dialog-title'
      className={(dialogTitleState) => {
        if (typeof className === 'function') {
          className = className(dialogTitleState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
