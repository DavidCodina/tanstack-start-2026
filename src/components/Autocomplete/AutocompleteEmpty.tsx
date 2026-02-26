import { Autocomplete } from '@base-ui/react/autocomplete'
import { cn } from '@/utils'

export type AutocompleteEmptyProps = Autocomplete.Empty.Props

const baseClasses = `
p-4 leading-4 text-center empty:m-0 empty:p-0
`

/* ========================================================================

======================================================================== */

export const AutocompleteEmpty = ({
  children = 'No items found',
  className = '',
  ...otherProps
}: AutocompleteEmptyProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Autocomplete.Empty
      children={children}
      {...otherProps}
      data-slot='autocomplete-empty'
      className={(autocompleteEmptyState) => {
        if (typeof className === 'function') {
          className = className(autocompleteEmptyState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
