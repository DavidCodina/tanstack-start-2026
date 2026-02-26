import { Combobox } from '@base-ui/react/combobox'
import { cn } from '@/utils'

export type ComboboxPopupProps = Combobox.Popup.Props

// relative was added for the custom scroll down/up arrrows
// in the ComboboxMenu component.

const baseClasses = `
bg-card rounded
w-[var(--anchor-width)]
max-w-[var(--available-width)]
origin-[var(--transform-origin)]
outline-1 shadow-lg
transition-[transform,scale,opacity]
overflow-hidden
data-[starting-style]:scale-98
data-[starting-style]:opacity-0
data-[ending-style]:scale-98
data-[ending-style]:opacity-0
`

/* ========================================================================

======================================================================== */

export const ComboboxPopup = ({
  className,
  ...otherProps
}: ComboboxPopupProps) => {
  return (
    <Combobox.Popup
      {...otherProps}
      data-slot='combobox-popup'
      className={(comboboxPopupState) => {
        if (typeof className === 'function') {
          className = className(comboboxPopupState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
