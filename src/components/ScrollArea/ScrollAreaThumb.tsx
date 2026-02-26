import { ScrollArea } from '@base-ui/react/scroll-area'
import { cn } from '@/utils'

export type ScrollAreaThumbProps = ScrollArea.Thumb.Props

const baseClasses = `
data-[orientation=vertical]:w-full
data-[orientation=horizontal]:h-full
rounded bg-primary
`

/* ========================================================================

======================================================================== */

export const ScrollAreaThumb = ({
  className = '',
  ...otherProps
}: ScrollAreaThumbProps) => {
  return (
    <ScrollArea.Thumb
      {...otherProps}
      data-slot='scroll-area-thumb'
      className={(scrollAreaThumbState) => {
        if (typeof className === 'function') {
          className = className(scrollAreaThumbState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
