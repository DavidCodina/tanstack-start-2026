import { Accordion } from '@base-ui/react/accordion'
import { cn } from '@/utils'

export type AccordionItemProps = Accordion.Item.Props

const baseClasses = `
first:rounded-t-[calc(var(--accordion-radius)-0.5px)]
last:rounded-b-[calc(var(--accordion-radius)-0.5px)]
not-last:border-b
border-(--accordion-border-color)
`

/* ========================================================================

======================================================================== */

export const AccordionItem = ({
  className = '',
  ...otherProps
}: AccordionItemProps) => {
  return (
    <Accordion.Item
      {...otherProps}
      data-slot='accordion-item'
      className={(accordionItemState) => {
        if (typeof className === 'function') {
          className = className(accordionItemState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
