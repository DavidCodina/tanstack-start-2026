import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'

import { TooltipProvider } from './TooltipProvider'
import { TooltipRoot } from './TooltipRoot'
import { TooltipTrigger } from './TooltipTrigger'
import { TooltipPortal } from './TooltipPortal'
import { TooltipPositioner } from './TooltipPositioner'
import { TooltipPopup } from './TooltipPopup'

import type { TooltipProviderProps } from './TooltipProvider'
import type { TooltipRootProps } from './TooltipRoot'
import type { TooltipTriggerProps } from './TooltipTrigger'
import type { TooltipPortalProps } from './TooltipPortal'
import type { TooltipPositionerProps } from './TooltipPositioner'
import type { TooltipPopupProps } from './TooltipPopup'

type TooltipPopupChildren = TooltipPopupProps['children']

export type TooltipProps = {
  children?: TooltipPopupChildren
  tooltipProviderProps?: TooltipProviderProps
  tooltipRootProps?: TooltipRootProps
  tooltipTriggerProps?: TooltipTriggerProps
  tooltipPortalProps?: TooltipPortalProps
  tooltipPositionerProps?: TooltipPositionerProps
  tooltipPopupProps?: TooltipPopupProps
}

// https://base-ui.com/react/components/tooltip#detached-triggers
export const createTooltipHandle = () => {
  return TooltipPrimitive.createHandle()
}

/* ========================================================================

======================================================================== */

export const Tooltip = ({
  children,
  tooltipProviderProps = {},
  tooltipRootProps = {},
  tooltipTriggerProps = {},
  tooltipPortalProps = {},
  tooltipPositionerProps = {},
  tooltipPopupProps = {}
}: TooltipProps) => {
  /* ======================
        renderTrigger()
  ====================== */

  const renderTrigger = () => {
    // If tooltipTriggerProps contains children or a render prop, then
    // it's reasonable to assume that the consumer's intention is to
    // use the internal TooltipTrigger, rather than a detached one.
    const shouldRenderTrigger =
      tooltipTriggerProps.children || tooltipTriggerProps.render

    if (!shouldRenderTrigger) return null

    return <TooltipTrigger {...tooltipTriggerProps} />
  }

  /* ======================
          return
  ====================== */

  return (
    <TooltipProvider {...tooltipProviderProps}>
      <TooltipRoot {...tooltipRootProps}>
        {renderTrigger()}

        <TooltipPortal {...tooltipPortalProps}>
          <TooltipPositioner {...tooltipPositionerProps}>
            <TooltipPopup children={children} {...tooltipPopupProps} />
          </TooltipPositioner>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
