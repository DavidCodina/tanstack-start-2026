import { DrawerPreview as Drawer } from '@base-ui/react/drawer'
import { cn } from '@/utils'

export type DrawerTitleProps = Drawer.Title.Props

const baseClasses = `mb-1 text-xl font-medium`

/* ========================================================================

======================================================================== */

export const DrawerTitle = ({
  children,
  className = '',
  ...otherProps
}: DrawerTitleProps) => {
  if (!children) {
    return null
  }

  return (
    <Drawer.Title
      {...otherProps}
      children={children}
      data-slot='drawer-title'
      className={(drawerTitleState) => {
        if (typeof className === 'function') {
          className = className(drawerTitleState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
