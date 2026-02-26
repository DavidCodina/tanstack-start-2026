import { Collapsible } from '@base-ui/react/collapsible'
import { cn } from '@/utils'

export type CollapsiblePanelProps = Collapsible.Panel.Props

// The relative, width, left, and padding enable the consumer to put a box-shadow on the
const baseClasses = `
relative
-left-2
flex flex-col
h-(--collapsible-panel-height)
p-2
w-[calc(100%_+_var(--spacing)*4)]
overflow-hidden
transition-all
duration-150
ease-out
data-ending-style:h-0
data-starting-style:h-0 
[&[hidden]:not([hidden='until-found'])]:hidden
`

/* ========================================================================

======================================================================== */

export const CollapsiblePanel = ({
  className = '',
  ...otherProps
}: CollapsiblePanelProps) => {
  return (
    <Collapsible.Panel
      {...otherProps}
      data-slot='collapsible-panel'
      className={(collapsiblePanelState) => {
        if (typeof className === 'function') {
          className = className(collapsiblePanelState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
