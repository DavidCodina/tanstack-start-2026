import { Drawer } from '@base-ui/react/drawer'
import { cn } from '@/utils'

export type DrawerDescriptionProps = Drawer.Description.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const DrawerDescription = ({
  children,
  className = '',
  ...otherProps
}: DrawerDescriptionProps) => {
  if (!children) {
    return null
  }

  return (
    <Drawer.Description
      {...otherProps}
      children={children}
      data-slot='drawer-description'
      className={(drawerDescriptionState) => {
        if (typeof className === 'function') {
          className = className(drawerDescriptionState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
