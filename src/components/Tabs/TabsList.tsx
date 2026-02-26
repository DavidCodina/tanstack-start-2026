import { Tabs } from '@base-ui/react/tabs'
import { cn } from '@/utils'

export type TabsListProps = Tabs.List.Props

// relative and z-0 work in conjunction with absolute and z-[-1] on the TabsIndicator.
const baseClasses = `
relative flex gap-1 px-1
border-t border-x
rounded-t-(--tabs-radius)
z-0
`

/* ========================================================================

======================================================================== */

export const TabsList = ({ className = '', ...otherProps }: TabsListProps) => {
  return (
    <Tabs.List
      {...otherProps}
      data-slot='tabs-list'
      className={(tabsListState) => {
        if (typeof className === 'function') {
          className = className(tabsListState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
