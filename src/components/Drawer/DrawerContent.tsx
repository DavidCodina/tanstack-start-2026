import { Drawer } from '@base-ui/react/drawer'
import { cn } from '@/utils'

export type DrawerContentProps = Drawer.Content.Props

const baseClasses = `mt-4 mx-auto w-full`

/* ========================================================================

======================================================================== */

export const DrawerContent = ({
  className = '',
  ...otherProps
}: DrawerContentProps) => {
  return (
    <Drawer.Content
      {...otherProps}
      data-slot='drawer-content'
      className={(drawerContentState) => {
        if (typeof className === 'function') {
          className = className(drawerContentState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
