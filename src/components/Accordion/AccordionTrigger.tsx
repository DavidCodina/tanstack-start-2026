import { Accordion } from '@base-ui/react/accordion'
import { Plus } from 'lucide-react'
import { cn } from '@/utils'

export type AccordionTriggerProps = Accordion.Trigger.Props

const baseClasses = `
group flex justify-between items-center gap-4
relative w-full py-1 pr-1 pl-3
bg-accent text-acccent-foreground
text-left font-medium cursor-pointer
rounded-[inherit] data-panel-open:rounded-b-none
focus-visible:outline
focus-visible:outline-primary
focus-visible:ring-[3px] 
focus-visible:ring-primary/50
focus-visible:z-1
`

const iconClasses = `
mr-2 size-[1.25em] shrink-0 pointer-events-none
group-data-panel-open:scale-110
group-data-panel-open:rotate-45
transition-all ease-out
`

/* ========================================================================

======================================================================== */

export const AccordionTrigger = ({
  children,
  className = '',
  ...otherProps
}: AccordionTriggerProps) => {
  return (
    <Accordion.Trigger
      {...otherProps}
      data-slot='accordion-trigger'
      className={(accordionTriggerState) => {
        if (typeof className === 'function') {
          className = className(accordionTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    >
      {children}
      <Plus strokeWidth={1.5} className={iconClasses} />
    </Accordion.Trigger>
  )
}
