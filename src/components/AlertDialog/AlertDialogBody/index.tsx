'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type AlertDialogBodyProps = React.ComponentProps<'div'>

const baseClasses = `
relative flex-auto p-4
rounded-[calc(var(--dialog-border-radius)-0.5px)]
`

/* ========================================================================

======================================================================== */

export const AlertDialogBody = ({
  children,
  className,
  style,
  ...otherProps
}: AlertDialogBodyProps) => {
  return (
    <div
      className={cn(baseClasses, className)}
      data-slot='alert-dialog-body'
      style={style}
      {...otherProps}
    >
      {children}
    </div>
  )
}
