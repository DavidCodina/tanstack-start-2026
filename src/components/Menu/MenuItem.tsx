import { Menu } from '@base-ui/react/menu'
import { cn } from '@/utils'

export type MenuItemProps = Menu.Item.Props

const baseClasses = `
flex p-1
text-sm leading-4 cursor-default
outline-none select-none
data-[highlighted]:relative
data-[highlighted]:z-0
data-[highlighted]:before:absolute
data-[highlighted]:before:inset-x-0
data-[highlighted]:before:inset-y-0
data-[highlighted]:before:bg-accent
data-[highlighted]:before:rounded
data-[highlighted]:before:outline
data-[highlighted]:before:outline-border
data-[highlighted]:before:-outline-offset-1
data-[highlighted]:before:z-[-1]
`

/* ========================================================================

======================================================================== */

export const MenuItem = ({ className = '', ...otherProps }: MenuItemProps) => {
  return (
    <Menu.Item
      {...otherProps}
      data-slot='menu-item'
      className={(menuItemState) => {
        if (typeof className === 'function') {
          className = className(menuItemState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
