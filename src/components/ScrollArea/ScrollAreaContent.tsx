import { ScrollArea } from '@base-ui/react/scroll-area'
import { cn } from '@/utils'

export type ScrollAreaContentProps = ScrollArea.Content.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const ScrollAreaContent = ({
  className = '',
  ...otherProps
}: ScrollAreaContentProps) => {
  return (
    <ScrollArea.Content
      {...otherProps}
      data-slot='scroll-area-content'
      className={(scrollAreaContentState) => {
        if (typeof className === 'function') {
          className = className(scrollAreaContentState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
