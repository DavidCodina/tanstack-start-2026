import { Autocomplete } from '@base-ui/react/autocomplete'
import { cn } from '@/utils'

export type AutocompletePopupProps = Autocomplete.Popup.Props

// Not sure if I even want data-[side=none] styles.
//# Why bg-clip-padding?
//# ComboboxList uses just w-[var(--anchor-width)] ???
//# Should we change this here or there?
const baseClasses = `
group
bg-card rounded
bg-clip-padding
min-w-[var(--anchor-width)]
max-w-[var(--available-width)]
origin-[var(--transform-origin)]
outline-1 shadow-lg
transition-[transform,scale,opacity]
overflow-hidden

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

export const AutocompletePopup = ({
  className = '',
  ...otherProps
}: AutocompletePopupProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Autocomplete.Popup
      {...otherProps}
      data-slot='autocomplete-popup'
      className={(autocompletePopupState) => {
        if (typeof className === 'function') {
          className = className(autocompletePopupState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
