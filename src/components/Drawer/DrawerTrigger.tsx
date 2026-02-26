import { DrawerPreview as Drawer } from '@base-ui/react/drawer'
import { PanelRightOpen } from 'lucide-react'
import { cn } from '@/utils'

export type DrawerTriggerProps = Drawer.Trigger.Props

//# Fix/Review focus and active styles.
//# We should probably default to the left, then make it on the right in the demo.
const baseClasses = `
fixed top-2 right-2 p-1
rounded-md select-none cursor-pointer
hover:bg-accent

focus-visible:outline
focus-visible:outline-2
focus-visible:-outline-offset-1
focus-visible:outline-blue-800
z-49
`

/* ========================================================================

======================================================================== */

export const DrawerTrigger = ({
  children = <PanelRightOpen />,
  className = '',
  ...otherProps
}: DrawerTriggerProps) => {
  return (
    <Drawer.Trigger
      {...otherProps}
      children={children}
      data-slot='drawer-trigger'
      className={(drawerTriggerState) => {
        if (typeof className === 'function') {
          className = className(drawerTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
