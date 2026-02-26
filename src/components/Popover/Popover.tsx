import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { PopoverRoot } from './PopoverRoot'
import { PopoverTrigger } from './PopoverTrigger' // ???
import { PopoverPortal } from './Popover.Portal'
import { PopoverPositioner } from './PopoverPositioner'
import { PopoverPopup } from './PopoverPopup'
import { PopoverTitle } from './PopoverTitle'
import { PopoverDescription } from './PopoverDescription'

import type { PopoverRootProps } from './PopoverRoot'
import type { PopoverTriggerProps } from './PopoverTrigger' // ???
import type { PopoverPortalProps } from './Popover.Portal'
import type { PopoverPositionerProps } from './PopoverPositioner'
import type { PopoverPopupProps } from './PopoverPopup'
import type { PopoverTitleProps } from './PopoverTitle'
import type { PopoverDescriptionProps } from './PopoverDescription'

type PopoverPopupChildren = PopoverPopupProps['children']

export type PopoverProps = {
  /** A way to pass children outside of Title/Description without overwriting them. Generally, not needed. */
  children?: PopoverPopupChildren
  popoverRootProps?: PopoverRootProps
  popoverTriggerProps?: PopoverTriggerProps
  popoverPortalProps?: PopoverPortalProps
  popoverPositionerProps?: PopoverPositionerProps
  popoverPopupProps?: PopoverPopupProps
  popoverTitleProps?: PopoverTitleProps
  popoverDescriptionProps?: PopoverDescriptionProps
}

// https://base-ui.com/react/components/popover#detached-triggers
export const createPopoverHandle = () => {
  return PopoverPrimitive.createHandle()
}

/* ========================================================================

======================================================================== */

export const Popover = ({
  children,
  popoverRootProps = {},
  popoverTriggerProps = {},
  popoverPortalProps = {},
  popoverPositionerProps = {},
  popoverPopupProps = {},
  popoverTitleProps = {},
  popoverDescriptionProps = {}
}: PopoverProps) => {
  children = popoverPopupProps.children || children

  /* ======================
      renderTrigger()
  ====================== */

  const renderTrigger = () => {
    // If popoverTriggerProps contains children or a render prop, then
    // it's reasonable to assume that the consumer's intention is to
    // use the internal PopoverTrigger, rather than a detached one.
    const shouldRenderTrigger =
      popoverTriggerProps.children || popoverTriggerProps.render

    if (!shouldRenderTrigger) return null
    return <PopoverTrigger {...popoverTriggerProps} />
  }

  /* ======================
        renderTitle()
  ====================== */

  const renderTitle = () => {
    const shouldRenderTitle =
      popoverTitleProps.children || popoverTitleProps.render

    if (!shouldRenderTitle) return null
    return <PopoverTitle {...popoverTitleProps} />
  }

  /* ======================
    renderDescription()
  ====================== */

  const renderDescription = () => {
    const shouldRenderDescription =
      popoverDescriptionProps.children || popoverDescriptionProps.render

    if (!shouldRenderDescription) return null
    return <PopoverDescription {...popoverDescriptionProps} />
  }

  /* ======================
          return
  ====================== */
  // Note: PopoverRoot wraps PopoverTrigger. However, PopoverRoot itself
  // doesn’t render its own HTML element, so it's not technically 'wrapping'
  // the trigger in terms of DOM elements.

  return (
    <PopoverRoot {...popoverRootProps}>
      {renderTrigger()}

      <PopoverPortal {...popoverPortalProps}>
        <PopoverPositioner {...popoverPositionerProps}>
          <PopoverPopup
            {...popoverPopupProps}
            children={
              <>
                {renderTitle()}
                {renderDescription()}
                {children}
              </>
            }
          />
        </PopoverPositioner>
      </PopoverPortal>
    </PopoverRoot>
  )
}
