import { Select } from '@base-ui/react/select'
import { cn } from '@/utils'

export type SelectPopupProps = Select.Popup.Props

// https://base-ui.com/react/components/select#positioner
// --anchor-width : The anchor's width.
// -- transform-origin : The coordinates that this element is anchored to. Used for animations and transitions.
// data-side : Indicates which side the popup is positioned relative to the trigger.

// Not sure if I even want data-[side=none] styles.
//# Why bg-clip-padding?
//# Do we want w-[var(--anchor-width)] instead of using min?
const baseClasses = `
group
bg-card rounded-md 
bg-clip-padding
min-w-[var(--anchor-width)]
max-w-[var(--available-width)]
origin-[var(--transform-origin)]
outline-1 shadow-lg
transition-[transform,scale,opacity]

data-[starting-style]:scale-98
data-[starting-style]:opacity-0
data-[ending-style]:scale-98
data-[ending-style]:opacity-0

data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)]
data-[side=none]:data-[ending-style]:transition-none
data-[side=none]:data-[starting-style]:scale-100
data-[side=none]:data-[starting-style]:opacity-100
data-[side=none]:data-[starting-style]:transition-none
`

/* ========================================================================

======================================================================== */

export const SelectPopup = ({
  className = '',
  ...otherProps
}: SelectPopupProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Select.Popup
      {...otherProps}
      data-slot='select-popup'
      className={(selectPopupState) => {
        if (typeof className === 'function') {
          className = className(selectPopupState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
