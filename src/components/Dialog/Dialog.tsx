import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { DialogRoot } from './DialogRoot'
import { DialogTrigger } from './DialogTrigger'
import { DialogPortal } from './DialogPortal'
import { DialogBackdrop } from './DialogBackdrop'

import { DialogContainer } from './DialogContainer'
import { DialogPopup } from './DialogPopup'
import { DialogHeader } from './DialogHeader'
import { DialogBody } from './DialogBody'
import { DialogFooter } from './DialogFooter'
import { InternalDialogClose } from './InternalDialogClose'

import type { DialogRootProps } from './DialogRoot'
import type { DialogTriggerProps } from './DialogTrigger'
import type { DialogPortalProps } from './DialogPortal'
import type { DialogBackdropProps } from './DialogBackdrop'

import type { DialogContainerProps } from './DialogContainer'
import type { DialogPopupProps } from './DialogPopup'
import type { DialogHeaderProps } from './DialogHeader'
import type { DialogTitleProps } from './DialogTitle'
import type { DialogDescriptionProps } from './DialogDescription'
import type { DialogBodyProps } from './DialogBody'
import type { DialogFooterProps } from './DialogFooter'

export type DialogProps = {
  children?: React.ReactNode
  centered?: boolean
  fullscreen?: boolean
  scrollable?: boolean
  closeButton?: boolean

  dialogRootProps?: DialogRootProps
  dialogTriggerProps?: DialogTriggerProps
  dialogPortalProps?: DialogPortalProps
  dialogBackdropProps?: DialogBackdropProps

  dialogContainerProps?: DialogContainerProps
  dialogPopupProps?: Omit<DialogPopupProps, 'children'>
  dialogHeaderProps?: DialogHeaderProps
  dialogTitleProps?: DialogTitleProps
  dialogDescriptionProps?: DialogDescriptionProps
  dialogBodyProps?: DialogBodyProps
  dialogFooterProps?: DialogFooterProps
}

export const createDialogHandle = () => {
  return DialogPrimitive.createHandle()
}

/* ========================================================================

======================================================================== */

export const Dialog = ({
  // children, centered, fullscree, scrollable,
  // are exposed at the top level for convenience.
  children,
  centered,
  fullscreen,
  scrollable,
  closeButton,

  dialogRootProps = {},
  dialogTriggerProps = {},
  dialogPortalProps = {},
  dialogBackdropProps = {},
  dialogContainerProps = {},
  dialogPopupProps = {},
  dialogHeaderProps = {},
  dialogTitleProps = {},
  dialogDescriptionProps = {},
  dialogBodyProps = {},
  dialogFooterProps = {}
}: DialogProps) => {
  /* ======================
      renderTrigger()
  ====================== */

  const renderTrigger = () => {
    const shouldRenderTrigger =
      dialogTriggerProps.children || dialogTriggerProps.render

    if (!shouldRenderTrigger) return null
    return <DialogTrigger {...dialogTriggerProps} />
  }

  /* ======================
          return
  ====================== */

  return (
    <DialogRoot {...dialogRootProps}>
      {renderTrigger()}

      <DialogPortal {...dialogPortalProps}>
        <DialogBackdrop {...dialogBackdropProps} />

        <DialogContainer
          centered={centered}
          fullscreen={fullscreen}
          scrollable={scrollable}
          {...dialogContainerProps}
        >
          <DialogPopup {...dialogPopupProps}>
            <DialogHeader
              {...dialogHeaderProps}
              dialogTitleProps={dialogTitleProps}
              dialogDescriptionProps={dialogDescriptionProps}
            />

            <DialogBody children={children} {...dialogBodyProps} />

            {dialogFooterProps.children && (
              <DialogFooter {...dialogFooterProps} />
            )}

            <InternalDialogClose closeButton={closeButton} />
          </DialogPopup>
        </DialogContainer>
      </DialogPortal>
    </DialogRoot>
  )
}
