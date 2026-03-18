import { Drawer } from '@base-ui/react/drawer'
import { cn } from '@/utils'

export type DrawerViewportProps = Drawer.Viewport.Props

//# Review and update styles
const baseClasses = `
fixed inset-0 flex items-stretch justify-end
p-[var(--viewport-padding)]
[--viewport-padding:0px]
supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]
z-50
`

/* ========================================================================

======================================================================== */

export const DrawerViewport = ({
  className = '',
  ...otherProps
}: DrawerViewportProps) => {
  return (
    <Drawer.Viewport
      {...otherProps}
      data-slot='drawer-viewport'
      className={(drawerViewportState) => {
        if (typeof className === 'function') {
          className = className(drawerViewportState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
