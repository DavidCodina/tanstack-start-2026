import * as React from 'react'
import { cn } from '@/utils'

export type CollapsibleContentProps = React.ComponentProps<'div'>

// Modified Derek: https://ui.aceternity.com/tools/box-shadows
const SHADOW_MIXIN = `
shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]
`

const baseClasses = `
flex flex-col gap-[0.5em]
bg-card p-[0.5em] border 
rounded-(--collapsible-radius) 
${SHADOW_MIXIN}
`

/* ========================================================================

======================================================================== */

export const CollapsibleContent = ({
  className = '',
  ...otherProps
}: CollapsibleContentProps) => {
  return (
    <div
      {...otherProps}
      data-slot='collapsible-content'
      className={cn(baseClasses, className)}
    />
  )
}
