import { ScrollArea } from '@base-ui/react/scroll-area'
import { cn } from '@/utils'

export type ScrollAreaScrollbarProps = ScrollArea.Scrollbar.Props

const baseClasses = `
flex 
data-[orientation=vertical]:justify-center
data-[orientation=horizontal]:items-center 
m-1
data-[orientation=vertical]:w-0.5
data-[orientation=horizontal]:h-0.5
bg-accent rounded opacity-0
pointer-events-none  
transition-opacity 
data-hovering:pointer-events-auto
data-hovering:opacity-100
data-hovering:delay-0
data-scrolling:pointer-events-auto
data-scrolling:opacity-100
data-scrolling:duration-0
`

/* ========================================================================

======================================================================== */

export const ScrollAreaScrollbar = ({
  className = '',
  ...otherProps
}: ScrollAreaScrollbarProps) => {
  return (
    <ScrollArea.Scrollbar
      {...otherProps}
      data-slot='scroll-area-scrollbar'
      className={(scrollAreaScrollbarState) => {
        if (typeof className === 'function') {
          className = className(scrollAreaScrollbarState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
