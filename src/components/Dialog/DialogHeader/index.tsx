'use client'

import * as React from 'react'
import { DialogTitle } from '../DialogTitle'
import { DialogDescription } from '../DialogDescription'

import type { DialogTitleProps } from '../DialogTitle'
import type { DialogDescriptionProps } from '../DialogDescription'

import { cn } from '@/utils'

export type DialogHeaderProps = React.ComponentProps<'div'>

// Do we need shrink-0 here?
const baseClasses = `
flex shrink-0 flex-col gap-2 px-4 pt-4 pb-2 text-center sm:text-left
rounded-t-[calc(var(--dialog-border-radius)-0.5px)]
`

/* ========================================================================

======================================================================== */

export const DialogHeader = ({
  className = '',
  dialogTitleProps = {},
  dialogDescriptionProps = {},
  ...otherProps
}: DialogHeaderProps & {
  dialogTitleProps?: DialogTitleProps
  dialogDescriptionProps?: DialogDescriptionProps
}) => {
  /* ======================
          return
  ====================== */

  if (!dialogTitleProps.children && !dialogDescriptionProps.children) {
    return null
  }

  return (
    <div
      // This allows children to be entirely overwritten by the consumer.
      children={
        <>
          {dialogTitleProps.children && <DialogTitle {...dialogTitleProps} />}

          {dialogDescriptionProps.children && (
            <DialogDescription {...dialogDescriptionProps} />
          )}
        </>
      }
      {...otherProps}
      data-slot='dialog-header'
      className={cn(baseClasses, className)}
    />
  )
}
