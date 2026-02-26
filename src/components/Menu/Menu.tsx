import { Menu as MenuPrimitive } from '@base-ui/react/menu'

import { MenuRoot } from './MenuRoot'
import { MenuTrigger } from './MenuTrigger'
import { MenuPortal } from './MenuPortal'
import { MenuPositioner } from './MenuPositioner'
import { MenuPopup } from './MenuPopup'

import type { MenuRootProps } from './MenuRoot'
import type { MenuTriggerProps } from './MenuTrigger'
import type { MenuPortalProps } from './MenuPortal'
import type { MenuPositionerProps } from './MenuPositioner'
import type { MenuPopupProps } from './MenuPopup'

// https://base-ui.com/react/components/menu#detached-triggers
export const createMenuHandle = () => {
  return MenuPrimitive.createHandle()
}

type MenuPopupChildren = MenuPopupProps['children']

export type MenuProps = {
  children?: MenuPopupChildren
  menuRootProps?: MenuRootProps
  menuTriggerProps?: MenuTriggerProps
  menuPortalProps?: MenuPortalProps
  menuPositionerProps?: MenuPositionerProps
  menuPopupProps?: MenuPopupProps
}

/* ========================================================================

======================================================================== */
// This is still a very basic menu. There's several other components.
// However, many of them would be passed in as children when consuming.

export const Menu = ({
  children,
  menuRootProps = {},
  menuTriggerProps = {},
  menuPortalProps = {},
  menuPositionerProps = {},
  menuPopupProps = {}
}: MenuProps) => {
  /* ======================
      renderTrigger()
  ====================== */

  const renderTrigger = () => {
    const shouldRenderTrigger =
      menuTriggerProps.children || menuTriggerProps.render

    if (!shouldRenderTrigger) return null
    return <MenuTrigger {...menuTriggerProps} />
  }

  /* ======================
          return
  ====================== */

  return (
    <MenuRoot {...menuRootProps}>
      {renderTrigger()}

      <MenuPortal {...menuPortalProps}>
        <MenuPositioner {...menuPositionerProps}>
          <MenuPopup children={children} {...menuPopupProps} />
        </MenuPositioner>
      </MenuPortal>
    </MenuRoot>
  )
}
