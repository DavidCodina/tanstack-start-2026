'use client'

import * as React from 'react'
import { AlertDialogTitle } from '../AlertDialogTitle'
import { AlertDialogDescription } from '../AlertDialogDescription'

import type { AlertDialogTitleProps } from '../AlertDialogTitle'
import type { AlertDialogDescriptionProps } from '../AlertDialogDescription'

import { cn } from '@/utils'

export type AlertDialogHeaderProps = React.ComponentProps<'div'>

// Do we need shrink-0 here?
const baseClasses = `
flex shrink-0 flex-col gap-2 px-4 pt-4 pb-2 text-center sm:text-left
rounded-t-[calc(var(--dialog-border-radius)-0.5px)]
`

/* ========================================================================

======================================================================== */

export const AlertDialogHeader = ({
  className = '',
  alertDialogTitleProps = {},
  alertDialogDescriptionProps = {},
  ...otherProps
}: AlertDialogHeaderProps & {
  alertDialogTitleProps?: AlertDialogTitleProps
  alertDialogDescriptionProps?: AlertDialogDescriptionProps
}) => {
  /* ======================
          return
  ====================== */

  if (
    !alertDialogTitleProps.children &&
    !alertDialogDescriptionProps.children
  ) {
    return null
  }

  return (
    <div
      // This allows children to be entirely overwritten by the consumer.
      children={
        <>
          {alertDialogTitleProps.children && (
            <AlertDialogTitle {...alertDialogTitleProps} />
          )}

          {alertDialogDescriptionProps.children && (
            <AlertDialogDescription {...alertDialogDescriptionProps} />
          )}
        </>
      }
      {...otherProps}
      data-slot='alert-dialog-header'
      className={cn(baseClasses, className)}
    />
  )
}
