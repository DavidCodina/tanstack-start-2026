import { Tabs } from '@base-ui/react/tabs'
import { cn } from '@/utils'

export type TabsTabProps = Tabs.Tab.Props

const baseClasses = `
flex h-8 items-center justify-center border-0
px-2 text-sm font-medium break-keep whitespace-nowrap
text-muted-foreground
outline-none select-none cursor-pointer
before:inset-x-0
before:inset-y-1
before:rounded-sm
hover:text-accent-foreground
focus-visible:relative
focus-visible:before:absolute
focus-visible:before:ring-[1.5px]
focus-visible:before:ring-primary/50
data-[active]:text-accent-foreground
`

/* ========================================================================

======================================================================== */

export const TabsTab = ({ className = '', ...otherProps }: TabsTabProps) => {
  return (
    <Tabs.Tab
      {...otherProps}
      data-slot='tabs-tab'
      className={(tabsTabState) => {
        if (typeof className === 'function') {
          className = className(tabsTabState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
