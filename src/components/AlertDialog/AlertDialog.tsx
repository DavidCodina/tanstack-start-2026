import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'

import { AlertDialogRoot } from './AlertDialogRoot'
import { AlertDialogTrigger } from './AlertDialogTrigger'
import { AlertDialogPortal } from './AlertDialogPortal'
import { AlertDialogBackdrop } from './AlertDialogBackdrop'

import { AlertDialogContainer } from './AlertDialogContainer'
import { AlertDialogPopup } from './AlertDialogPopup'
import { AlertDialogHeader } from './AlertDialogHeader'
import { AlertDialogBody } from './AlertDialogBody'
import { AlertDialogFooter } from './AlertDialogFooter'
import { InternalAlertDialogClose } from './InternalAlertDialogClose'

import type { AlertDialogRootProps } from './AlertDialogRoot'
import type { AlertDialogTriggerProps } from './AlertDialogTrigger'
import type { AlertDialogPortalProps } from './AlertDialogPortal'
import type { AlertDialogBackdropProps } from './AlertDialogBackdrop'

import type { AlertDialogContainerProps } from './AlertDialogContainer'
import type { AlertDialogPopupProps } from './AlertDialogPopup'
import type { AlertDialogHeaderProps } from './AlertDialogHeader'
import type { AlertDialogTitleProps } from './AlertDialogTitle'
import type { AlertDialogDescriptionProps } from './AlertDialogDescription'
import type { AlertDialogBodyProps } from './AlertDialogBody'
import type { AlertDialogFooterProps } from './AlertDialogFooter'

export type AlertDialogProps = {
  children?: React.ReactNode
  centered?: boolean
  fullscreen?: boolean
  scrollable?: boolean
  closeButton?: boolean

  alertDialogRootProps?: AlertDialogRootProps
  alertDialogTriggerProps?: AlertDialogTriggerProps
  alertDialogPortalProps?: AlertDialogPortalProps
  alertDialogBackdropProps?: AlertDialogBackdropProps

  alertDialogContainerProps?: AlertDialogContainerProps
  alertDialogPopupProps?: Omit<AlertDialogPopupProps, 'children'>
  alertDialogHeaderProps?: AlertDialogHeaderProps
  alertDialogTitleProps?: AlertDialogTitleProps
  alertDialogDescriptionProps?: AlertDialogDescriptionProps
  alertDialogBodyProps?: AlertDialogBodyProps
  alertDialogFooterProps?: AlertDialogFooterProps
}

export const createAlertDialogHandle = () => {
  return AlertDialogPrimitive.createHandle()
}

/* ========================================================================

======================================================================== */

export const AlertDialog = ({
  // children, centered, fullscree, scrollable,
  // are exposed at the top level for convenience.
  children,
  centered,
  fullscreen,
  scrollable,
  closeButton,

  alertDialogRootProps = {},
  alertDialogTriggerProps = {},
  alertDialogPortalProps = {},
  alertDialogBackdropProps = {},
  alertDialogContainerProps = {},
  alertDialogPopupProps = {},
  alertDialogHeaderProps = {},
  alertDialogTitleProps = {},
  alertDialogDescriptionProps = {},
  alertDialogBodyProps = {},
  alertDialogFooterProps = {}
}: AlertDialogProps) => {
  /* ======================
      renderTrigger()
  ====================== */

  const renderTrigger = () => {
    const shouldRenderTrigger =
      alertDialogTriggerProps.children || alertDialogTriggerProps.render

    if (!shouldRenderTrigger) return null
    return <AlertDialogTrigger {...alertDialogTriggerProps} />
  }

  /* ======================
          return
  ====================== */

  return (
    <AlertDialogRoot {...alertDialogRootProps}>
      {renderTrigger()}

      <AlertDialogPortal {...alertDialogPortalProps}>
        <AlertDialogBackdrop {...alertDialogBackdropProps} />

        <AlertDialogContainer
          centered={centered}
          fullscreen={fullscreen}
          scrollable={scrollable}
          {...alertDialogContainerProps}
        >
          <AlertDialogPopup {...alertDialogPopupProps}>
            <AlertDialogHeader
              {...alertDialogHeaderProps}
              alertDialogTitleProps={alertDialogTitleProps}
              alertDialogDescriptionProps={alertDialogDescriptionProps}
            />

            <AlertDialogBody children={children} {...alertDialogBodyProps} />

            {alertDialogFooterProps.children && (
              <AlertDialogFooter {...alertDialogFooterProps} />
            )}

            <InternalAlertDialogClose closeButton={closeButton} />
          </AlertDialogPopup>
        </AlertDialogContainer>
      </AlertDialogPortal>
    </AlertDialogRoot>
  )
}
