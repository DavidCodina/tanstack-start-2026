import { Menu } from '@base-ui/react/menu'
import { cn } from '@/utils'

export type MenuTriggerProps = Menu.Trigger.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const MenuTrigger = ({
  className = '',
  ...otherProps
}: MenuTriggerProps) => {
  return (
    <Menu.Trigger
      {...otherProps}
      data-slot='menu-trigger'
      className={(triggerState) => {
        if (typeof className === 'function') {
          className = className(triggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
