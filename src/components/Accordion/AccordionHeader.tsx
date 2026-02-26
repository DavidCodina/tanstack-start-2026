import { Accordion } from '@base-ui/react/accordion'
import { cn } from '@/utils'

export type AccordionHeaderProps = Accordion.Header.Props

const baseClasses = `rounded-[inherit]`

/* ========================================================================

======================================================================== */

export const AccordionHeader = ({
  className = '',
  ...otherProps
}: AccordionHeaderProps) => {
  return (
    <Accordion.Header
      {...otherProps}
      data-slot='accordion-header'
      className={(accordionHeaderState) => {
        if (typeof className === 'function') {
          className = className(accordionHeaderState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
