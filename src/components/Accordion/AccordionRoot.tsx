import { Accordion } from '@base-ui/react/accordion'
import { cn } from '@/utils'

export type AccordionRootProps = Accordion.Root.Props

const baseClasses = `
[--accordion-radius:0.5em]
[--accordion-border-color:var(--color-border)]
rounded-(--accordion-radius)
border border-(--accordion-border-color)
`

/* ========================================================================

======================================================================== */
// Groups all parts of the accordion. Renders a <div> element.

export const AccordionRoot = ({
  className = '',
  ...otherProps
}: AccordionRootProps) => {
  return (
    <Accordion.Root
      {...otherProps}
      data-slot='accordion-root'
      className={(accordionRootState) => {
        if (typeof className === 'function') {
          className = className(accordionRootState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
