import { Drawer } from '@base-ui/react/drawer'

export type DrawerRootProps = Drawer.Root.Props

/* ========================================================================

======================================================================== */
// Groups all parts of the drawer. Doesn't render its own HTML element.

export const DrawerRoot = (props: DrawerRootProps) => {
  return (
    <Drawer.Root
      {...props}
      // ❌ data-slot='drawer-root'
    />
  )
}
