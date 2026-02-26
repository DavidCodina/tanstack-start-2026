import { Autocomplete } from '@base-ui/react/autocomplete'
import { cn } from '@/utils'

export type AutocompletePositionerProps = Autocomplete.Positioner.Props

const baseClasses = `
outline-none select-none z-49
`

/* ========================================================================

======================================================================== */

export const AutocompletePositioner = ({
  className = '',
  ...otherProps
}: AutocompletePositionerProps) => {
  return (
    <Autocomplete.Positioner
      sideOffset={10}
      {...otherProps}
      data-slot='autocomplete-positioner'
      className={(state) => {
        if (typeof className === 'function') {
          className = className(state) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
