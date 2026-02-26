import { Collapsible } from '@base-ui/react/collapsible'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

export type CollapsibleTriggerProps = Collapsible.Trigger.Props

// hover:bg-primary
// active:bg-primary
const baseClasses = `
group flex items-center gap-[0.25em] 
w-full px-[0.5em] py-[0.25em] 
bg-card font-medium
border rounded-(--collapsible-radius)
cursor-pointer
outline-none
focus-visible:border-primary
focus-visible:ring-[3px]
focus-visible:ring-primary/50

`

/* ========================================================================

======================================================================== */

export const CollapsibleTrigger = ({
  children,
  className = '',
  ...otherProps
}: CollapsibleTriggerProps) => {
  return (
    <Collapsible.Trigger
      {...otherProps}
      data-slot='collapsible-trigger'
      className={(collapsibleTriggerState) => {
        if (typeof className === 'function') {
          className = className(collapsibleTriggerState) || ''
        }
        return cn(baseClasses, className)
      }}
    >
      <ChevronRight className='size-[1.25em] transition-all ease-out group-data-panel-open:rotate-90' />
      {children}
    </Collapsible.Trigger>
  )
}
