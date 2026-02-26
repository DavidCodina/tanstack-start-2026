import { Menu } from '@base-ui/react/menu'
import { cn } from '@/utils'

export type MenuPositionerProps = Menu.Positioner.Props

const baseClasses = `outline-none`

/* ========================================================================

======================================================================== */

export const MenuPositioner = ({
  className = '',
  ...otherProps
}: MenuPositionerProps) => {
  return (
    <Menu.Positioner
      sideOffset={12}
      {...otherProps}
      data-slot='menu-positioner'
      className={(menuPositionerState) => {
        if (typeof className === 'function') {
          className = className(menuPositionerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
