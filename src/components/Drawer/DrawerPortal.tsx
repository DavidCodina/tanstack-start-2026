import { Drawer } from '@base-ui/react/drawer'

export type DrawerPortalProps = Drawer.Portal.Props

/* ========================================================================

======================================================================== */

export const DrawerPortal = (props: DrawerPortalProps) => {
  return <Drawer.Portal {...props} data-slot='drawer-portal' />
}
