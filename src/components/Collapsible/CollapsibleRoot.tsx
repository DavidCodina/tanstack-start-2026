import { Collapsible } from '@base-ui/react/collapsible'
import { cn } from '@/utils'

export type CollapsibleRootProps = Collapsible.Root.Props

const baseClasses = `[--collapsible-radius:0.25em] relative`

/* ========================================================================

======================================================================== */

export const CollapsibleRoot = ({
  className = '',
  ...otherProps
}: CollapsibleRootProps) => {
  return (
    <Collapsible.Root
      {...otherProps}
      data-slot='collapsible-root'
      className={(collapsibleRootState) => {
        if (typeof className === 'function') {
          className = className(collapsibleRootState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
