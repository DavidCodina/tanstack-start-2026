import { Drawer } from '@base-ui/react/drawer'

import { cn } from '@/utils'

export type DrawerBackdropProps = Drawer.Backdrop.Props & {
  show?: boolean
}

//# Review and update styles
//! Not sure about the bleed.
//! I got rid of that ifn DrawerPopup already.
const baseClasses = `
[--backdrop-opacity:0.2]
bg-black
fixed inset-0 min-h-dvh 
opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))]
transition-opacity duration-[450ms]
ease-[cubic-bezier(0.32,0.72,0,1)]

[--bleed:3rem]
data-[ending-style]:opacity-0
data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]
data-[starting-style]:opacity-0
data-[swiping]:duration-0
supports-[-webkit-touch-callout:none]:absolute
dark:[--backdrop-opacity:0.7]
`

/* ========================================================================

======================================================================== */

export const DrawerBackdrop = ({
  className = '',
  show = true,
  ...otherProps
}: DrawerBackdropProps) => {
  if (!show) {
    return null
  }

  return (
    <Drawer.Backdrop
      {...otherProps}
      data-slot='drawer-backdrop'
      className={(drawerBackdropState) => {
        if (typeof className === 'function') {
          className = className(drawerBackdropState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
