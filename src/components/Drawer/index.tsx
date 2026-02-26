import { DrawerRoot } from './DrawerRoot'
import { DrawerTrigger } from './DrawerTrigger'
import { DrawerMenu } from './DrawerMenu'

import type { DrawerRootProps } from './DrawerRoot'
import type { DrawerTriggerProps } from './DrawerTrigger'
import type { DrawerPortalProps } from './DrawerPortal'
import type { DrawerBackdropProps } from './DrawerBackdrop'
import type { DrawerViewportProps } from './DrawerViewport'
import type { DrawerPopupProps } from './DrawerPopup'
import type { DrawerCloseProps } from './DrawerClose'
import type { DrawerContentProps } from './DrawerContent'
import type { DrawerTitleProps } from './DrawerTitle'
import type { DrawerDescriptionProps } from './DrawerDescription'

type DrawerContentChildren = DrawerContentProps['children']

export type DrawerProps = {
  children?: DrawerContentChildren
  drawerRootProps?: DrawerRootProps
  drawerTriggerProps?: DrawerTriggerProps
  drawerPortalProps?: DrawerPortalProps
  drawerBackdropProps?: DrawerBackdropProps
  drawerViewportProps?: DrawerViewportProps
  drawerPopupProps?: DrawerPopupProps
  drawerCloseProps?: DrawerCloseProps
  drawerContentProps?: DrawerContentProps
  drawerTitleProps?: DrawerTitleProps
  drawerDescriptionProps?: DrawerDescriptionProps
}

/* ========================================================================

======================================================================== */
//# Currently, we're not using Drawer.Provider, but that may be useful in the future.

export const Drawer = ({
  children,
  drawerRootProps = {},
  drawerTriggerProps = {},
  drawerPortalProps = {},
  drawerBackdropProps = {},
  drawerViewportProps = {},
  drawerPopupProps = {},
  drawerCloseProps = {},
  drawerContentProps = {},
  drawerTitleProps = {},
  drawerDescriptionProps = {}
}: DrawerProps) => {
  return (
    <DrawerRoot {...drawerRootProps}>
      <DrawerTrigger {...drawerTriggerProps} />

      <DrawerMenu
        drawerPortalProps={drawerPortalProps}
        drawerBackdropProps={drawerBackdropProps}
        drawerViewportProps={drawerViewportProps}
        drawerPopupProps={drawerPopupProps}
        drawerCloseProps={drawerCloseProps}
        drawerContentProps={{ children, ...drawerContentProps }}
        drawerTitleProps={drawerTitleProps}
        drawerDescriptionProps={drawerDescriptionProps}
      />
    </DrawerRoot>
  )
}
