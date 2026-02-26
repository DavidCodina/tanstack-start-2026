import { Popover } from '@base-ui/react/popover'
import { cn } from '@/utils'

export type PopoverPopupProps = Popover.Popup.Props

///////////////////////////////////////////////////////////////////////////
//
// Using min() is a great way to conditionally set the max width
// without ever explicitly setting a width.
//
//   max-w-[min(600px,var(--available-width))]
//
// Why not just do this:
//
//   max-w-[calc(100vw-var(--spacing)*8)]
//
// Because that won't constrain the width until you hit the viewport.
// Similarly, if we just do this:
//
//   max-w-[600px]
//
// Then the Positioner won't necessarily constrain itself when we DO hit the viewport.
// Another, more sophisticated alternative is to do something like this:
//
//   max-w-[min(600px,calc(100vw-var(--spacing)*12))]
//
// The Popup has no way of indicating that there's additional scrollable
// content. For that reason, it may be better to omit a max height,
// and instead allow the browser window to become scrollable.
//
///////////////////////////////////////////////////////////////////////////

const WIDTH_HEIGHT_MIXIN = `max-w-[min(500px,var(--available-width))]`

// Modified Derek: https://ui.aceternity.com/tools/box-shadows
const SHADOW_MIXIN = `
shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.03),0px_3px_3px_-1.5px_rgba(0,0,0,0.03),_0px_6px_6px_-3px_rgba(0,0,0,0.03),0px_12px_12px_-6px_rgba(0,0,0,0.03),0px_24px_24px_-12px_rgba(0,0,0,0.03)]
`

const baseClasses = `
[--popover-bg-color:var(--color-card)]
[--popover-border-color:var(--color-border)]
bg-(--popover-bg-color) 
border border-(--popover-border-color)
p-4 text-sm rounded-lg 
${WIDTH_HEIGHT_MIXIN}
${SHADOW_MIXIN}
transition-[transform,scale,opacity]
origin-[var(--transform-origin)]
data-[ending-style]:scale-90
data-[ending-style]:opacity-0
data-[starting-style]:scale-90
data-[starting-style]:opacity-0
`

const arrowClasses = `
h-2 w-0
border-x-8 border-x-transparent
border-b-8 border-b-(--popover-bg-color)
data-[side=bottom]:-top-[6.5px]
data-[side=top]:-bottom-[6.5px]
data-[side=top]:rotate-180
data-[side=left]:right-[-10px]
data-[side=left]:rotate-90
data-[side=right]:left-[-10px]
data-[side=right]:-rotate-90
filter-[drop-shadow(0px_-1px_0px_var(--popover-border-color))]
`
// _drop-shadow(0px_-2px_1px_rgba(0,0,0,0.15))

/* ========================================================================

======================================================================== */

export const PopoverPopup = ({
  children,
  className = '',
  initialFocus = false,
  ...otherProps
}: PopoverPopupProps) => {
  return (
    <Popover.Popup
      {...otherProps}
      data-slot='popover-popup'
      className={(popoverPopupState) => {
        if (typeof className === 'function') {
          className = className(popoverPopupState) || ''
        }
        return cn(baseClasses, className)
      }}
      initialFocus={initialFocus}
    >
      <Popover.Arrow data-slot='popover-arrow' className={arrowClasses} />

      {children}
    </Popover.Popup>
  )
}
