'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type AlertDialogFooterProps = React.ComponentProps<'div'>

const baseClasses = `
flex items-center justify-center shrink-0 flex-wrap gap-2 px-4 py-2
rounded-b-[calc(var(--dialog-border-radius)-0.5px)]
`

/* ========================================================================

======================================================================== */

export const AlertDialogFooter = ({
  className = '',
  ...otherProps
}: AlertDialogFooterProps) => {
  /* ======================
          return
  ====================== */

  return (
    <div
      {...otherProps}
      data-slot='alert-dialog-footer'
      className={cn(baseClasses, className)}
    />
  )
}
