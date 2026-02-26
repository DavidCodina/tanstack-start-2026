import { Dialog } from '@base-ui/react/dialog'
import { cn } from '@/utils'

export type DialogTriggerProps = Dialog.Trigger.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const DialogTrigger = ({
  className = '',
  ...otherProps
}: DialogTriggerProps) => {
  return (
    <Dialog.Trigger
      {...otherProps}
      data-slot='dialog-trigger'
      className={(dialogTriggerState) => {
        if (typeof className === 'function') {
          className = className(dialogTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
