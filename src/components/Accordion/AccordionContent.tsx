import * as React from 'react'
import { cn } from '@/utils'

export type AccordionContentProps = React.ComponentProps<'div'>

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: I wanted a spongey, vertical padding transition. Originally I tried this:
//
//   const _PADDING_MIXIN = `
//   px-4 py-0
//   group-data-open:py-4
//   group-data-starting-style:py-4
//   transition-[padding]`
//
// In some Accordion implementations that would work fine. However, the padding
// (even on an inner div) disrupts the height calculation in the AccordionPanel:
//
//   h-(--accordion-panel-height)
//
// Thus, if you want a padding-like animation, you need to use transform instead.
// Why? Transforms don't affect layout and won't corrupt the height calculation.
//
///////////////////////////////////////////////////////////////////////////

const PADDING_MIXIN = `
p-4
transition-transform 
-translate-y-4
group-data-open:translate-y-0
group-data-starting-style:-translate-y-4
`

const baseClasses = `
${PADDING_MIXIN}
`

/* ========================================================================

======================================================================== */

export const AccordionContent = ({
  className = '',
  ...otherProps
}: AccordionContentProps) => {
  return (
    <div
      {...otherProps}
      data-slot='accordion-content'
      className={cn(baseClasses, className)}
    />
  )
}
