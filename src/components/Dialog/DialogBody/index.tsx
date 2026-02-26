'use client'

import * as React from 'react'
import { cn } from '@/utils'

export type DialogBodyProps = React.ComponentProps<'div'>

const baseClasses = `
relative flex-auto p-4
rounded-[calc(var(--dialog-border-radius)-0.5px)]
`

/* ========================================================================

======================================================================== */

export const DialogBody = ({
  children,
  className,
  style,
  ...otherProps
}: DialogBodyProps) => {
  return (
    <div
      className={cn(baseClasses, className)}
      data-slot='dialog-body'
      style={style}
      {...otherProps}
    >
      {children}
    </div>
  )
}
