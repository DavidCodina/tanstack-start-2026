import { DrawerPortal } from './DrawerPortal'
import { DrawerBackdrop } from './DrawerBackdrop'
import { DrawerViewport } from './DrawerViewport'
import { DrawerPopup } from './DrawerPopup'
import { DrawerClose } from './DrawerClose'
import { DrawerContent } from './DrawerContent'
import { DrawerTitle } from './DrawerTitle'
import { DrawerDescription } from './DrawerDescription'

import type { DrawerPortalProps } from './DrawerPortal'
import type { DrawerBackdropProps } from './DrawerBackdrop'
import type { DrawerViewportProps } from './DrawerViewport'
import type { DrawerPopupProps } from './DrawerPopup'
import type { DrawerCloseProps } from './DrawerClose'
import type { DrawerContentProps } from './DrawerContent'
import type { DrawerTitleProps } from './DrawerTitle'
import type { DrawerDescriptionProps } from './DrawerDescription'

export type DrawerMenuProps = {
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

export const DrawerMenu = ({
  drawerPortalProps = {},
  drawerBackdropProps = {},
  drawerViewportProps = {},
  drawerPopupProps = {},
  drawerCloseProps = {},
  drawerContentProps = {},
  drawerTitleProps = {},
  drawerDescriptionProps = {}
}: DrawerMenuProps) => {
  return (
    <DrawerPortal {...drawerPortalProps}>
      <DrawerBackdrop {...drawerBackdropProps} />
      <DrawerViewport {...drawerViewportProps}>
        <DrawerPopup {...drawerPopupProps}>
          <DrawerClose {...drawerCloseProps} />
          <DrawerContent {...drawerContentProps}>
            <DrawerTitle {...drawerTitleProps} />
            <DrawerDescription {...drawerDescriptionProps} />
            {drawerContentProps.children}
          </DrawerContent>
        </DrawerPopup>
      </DrawerViewport>
    </DrawerPortal>
  )
}
