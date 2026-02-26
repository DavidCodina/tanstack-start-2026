import { Autocomplete } from '@base-ui/react/autocomplete'
import { cn } from '@/utils'

export type AutocompletePortalProps = Autocomplete.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const AutocompletePortal = ({
  className = '',
  ...otherProps
}: AutocompletePortalProps) => {
  return (
    <Autocomplete.Portal
      {...otherProps}
      data-slot='autocomplete-portal'
      className={(autocompletePortalState) => {
        if (typeof className === 'function') {
          className = className(autocompletePortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
