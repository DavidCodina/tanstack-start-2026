import { Menu } from '@base-ui/react/menu'
import { cn } from '@/utils'

export type MenuSeparatorProps = Menu.Separator.Props

const baseClasses = `mx-4 my-2 h-px bg-border`

/* ========================================================================

======================================================================== */

export const MenuSeparator = ({
  className = '',
  ...otherProps
}: MenuSeparatorProps) => {
  return (
    <Menu.Separator
      {...otherProps}
      data-slot='menu-separator'
      className={(menuSeparatorState) => {
        if (typeof className === 'function') {
          className = className(menuSeparatorState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
