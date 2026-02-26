import { ScrollArea } from '@base-ui/react/scroll-area'
import { cn } from '@/utils'

export type ScrollAreaViewportProps = ScrollArea.Viewport.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const ScrollAreaViewport = ({
  className = '',
  ...otherProps
}: ScrollAreaViewportProps) => {
  return (
    <ScrollArea.Viewport
      {...otherProps}
      data-slot='scroll-area-viewport'
      className={(scrollAreaViewportState) => {
        if (typeof className === 'function') {
          className = className(scrollAreaViewportState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
