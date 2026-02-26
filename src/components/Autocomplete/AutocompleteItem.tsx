import { Autocomplete } from '@base-ui/react/autocomplete'
import { cn } from '@/utils'

export type AutocompleteItemProps = Autocomplete.Item.Props

const baseClasses = `
flex items-center gap-2 
py-[0.25em] px-4
cursor-pointer
text-sm leading-[1.5] select-none outline-none 
data-highlighted:relative
data-highlighted:text-white
data-highlighted:z-0
data-highlighted:before:absolute
data-highlighted:before:inset-x-2 
data-highlighted:before:inset-y-0
data-highlighted:before:bg-primary
data-highlighted:before:rounded
data-highlighted:before:z-[-1]
`

/* ========================================================================

======================================================================== */

export const AutocompleteItem = ({
  className,
  ...otherProps
}: AutocompleteItemProps) => {
  return (
    <Autocomplete.Item
      {...otherProps}
      data-slot='autocomplete-item'
      className={(autocompleteItemState) => {
        if (typeof className === 'function') {
          className = className(autocompleteItemState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
