import { Drawer } from '@base-ui/react/drawer'

import { cn } from '@/utils'

export type DrawerPopupProps = Drawer.Popup.Props

//# Review and update styles
const baseClasses = `
relative
bg-card p-6 h-full w-[350px]
touch-auto overflow-y-auto overscroll-contain
shadow-[inset_2px_0px_8px_rgba(0,0,0,0.15)] dark:shadow-[inset_2px_0px_8px_rgba(0,0,0,0.85)]

outline outline-primary

[transform:translateX(var(--drawer-swipe-movement-x))]
transition-transform
ease-linear
duration-200

data-[starting-style]:[transform:translateX(calc(100%+var(--viewport-padding)))]
data-[ending-style]:[transform:translateX(calc(100%+var(--viewport-padding)))]
data-[swiping]:select-none

supports-[-webkit-touch-callout:none]:mr-0
supports-[-webkit-touch-callout:none]:w-[20rem]
supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)]
supports-[-webkit-touch-callout:none]:rounded-[10px]
supports-[-webkit-touch-callout:none]:pr-6
supports-[-webkit-touch-callout:none]:[--bleed:0px]
`

/* ========================================================================

======================================================================== */

export const DrawerPopup = ({
  className = '',
  ...otherProps
}: DrawerPopupProps) => {
  return (
    <Drawer.Popup
      {...otherProps}
      data-slot='drawer-popup'
      className={(drawerPopupState) => {
        if (typeof className === 'function') {
          className = className(drawerPopupState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
