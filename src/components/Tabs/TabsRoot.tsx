import { Tabs } from '@base-ui/react/tabs'
import { cn } from '@/utils'

export type TabsRootProps = Tabs.Root.Props

const baseClasses = `
[--tabs-radius:0.5rem]
bg-card
rounded-(--tabs-radius)
`

/* ========================================================================

======================================================================== */

export const TabsRoot = ({ className = '', ...otherProps }: TabsRootProps) => {
  return (
    <Tabs.Root
      {...otherProps}
      data-slot='tabs-root'
      className={(tabsRootState) => {
        if (typeof className === 'function') {
          className = className(tabsRootState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
