import { ScrollArea } from '@base-ui/react/scroll-area'
import { cn } from '@/utils'

export type ScrollAreaRootProps = ScrollArea.Root.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const ScrollAreaRoot = ({
  className = '',
  ...otherProps
}: ScrollAreaRootProps) => {
  return (
    <ScrollArea.Root
      {...otherProps}
      data-slot='scroll-area-root'
      className={(scrollAreaRootState) => {
        if (typeof className === 'function') {
          className = className(scrollAreaRootState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
