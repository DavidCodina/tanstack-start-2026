import { Accordion } from '@base-ui/react/accordion'
import { cn } from '@/utils'

export type AccordionPanelProps = Accordion.Panel.Props

// The group class is used by AccordiontContent to implement
// group-data-open: and group-data-starting-style: modifiers
const baseClasses = `
group
bg-card 
h-(--accordion-panel-height)
border-t border-(--accordion-border-color)
rounded-b-[inherit]
overflow-hidden
transition-[height]
data-starting-style:h-0
data-ending-style:h-0
`

/* ========================================================================

======================================================================== */

export const AccordionPanel = ({
  className = '',
  ...otherProps
}: AccordionPanelProps) => {
  return (
    <Accordion.Panel
      {...otherProps}
      data-slot='accordion-panel'
      className={(accordionPanelState) => {
        if (typeof className === 'function') {
          className = className(accordionPanelState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
