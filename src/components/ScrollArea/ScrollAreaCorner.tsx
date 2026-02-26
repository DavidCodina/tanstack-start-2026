import { ScrollArea } from '@base-ui/react/scroll-area'
import { cn } from '@/utils'

export type ScrollAreaCornerProps = ScrollArea.Corner.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const ScrollAreaCorner = ({
  className = '',
  ...otherProps
}: ScrollAreaCornerProps) => {
  return (
    <ScrollArea.Corner
      {...otherProps}
      data-slot='scroll-area-corner'
      className={(scrollAreaCornerState) => {
        if (typeof className === 'function') {
          className = className(scrollAreaCornerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
