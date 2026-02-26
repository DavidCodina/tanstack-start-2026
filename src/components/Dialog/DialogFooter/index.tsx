'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type DialogFooterProps = React.ComponentProps<'div'>

const baseClasses = `
flex items-center justify-center shrink-0 flex-wrap gap-2 px-4 py-2
rounded-b-[calc(var(--dialog-border-radius)-0.5px)]
`

/* ========================================================================

======================================================================== */

export const DialogFooter = ({
  className = '',
  ...otherProps
}: DialogFooterProps) => {
  /* ======================
          return
  ====================== */

  return (
    <div
      {...otherProps}
      data-slot='dialog-footer'
      className={cn(baseClasses, className)}
    />
  )
}
