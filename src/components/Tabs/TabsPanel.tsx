import { Tabs } from '@base-ui/react/tabs'
import { cn } from '@/utils'

export type TabsPanelProps = Tabs.Panel.Props

const baseClasses = `
outline-none
rounded-b-(--tabs-radius)
overflow-auto
focus-visible:border-primary
focus-visible:ring-[3px] 
focus-visible:ring-primary/50
border

`

/* ========================================================================

======================================================================== */

export const TabsPanel = ({
  className = '',
  ...otherProps
}: TabsPanelProps) => {
  return (
    <Tabs.Panel
      {...otherProps}
      data-slot='tabs-panel'
      className={(state) => {
        if (typeof className === 'function') {
          className = className(state) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
