import { Tabs } from '@base-ui/react/tabs'
import { cn } from '@/utils'

export type TabsIndicatorProps = Tabs.Indicator.Props

// absolute and z-[-1] work in conjunction with relative and z-0 on the TabsList.
const baseClasses = `
absolute top-1/2 left-0 h-6
bg-accent
w-(--active-tab-width)
translate-x-(--active-tab-left)
-translate-y-1/2
rounded-sm 
transition-all
duration-200
ease-in-out
z-[-1]
`

/* ========================================================================

======================================================================== */

export const TabsIndicator = ({
  className = '',
  ...otherProps
}: TabsIndicatorProps) => {
  return (
    <Tabs.Indicator
      {...otherProps}
      data-slot='tabs-indicator'
      className={(tabsIndicatorState) => {
        if (typeof className === 'function') {
          className = className(tabsIndicatorState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
