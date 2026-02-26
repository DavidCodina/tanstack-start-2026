import { Select } from '@base-ui/react/select'
import { cn } from '@/utils'

export type SelectListProps = Select.List.Props

// https://base-ui.com/react/components/select#positioner
// --available-height : The available height between the trigger and the edge of the viewport.

// This version is a bit different from AutocompleteList and ComboboxList.
// Review this one against those and possibly change this one.
const baseClasses = `
relative 
max-h-[var(--available-height)]
scroll-py-6 overflow-y-auto py-1
`

/* ========================================================================

======================================================================== */

export const SelectList = ({
  className = '',
  ...otherProps
}: SelectListProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Select.List
      {...otherProps}
      data-slot='select-list'
      className={(selectListState) => {
        if (typeof className === 'function') {
          className = className(selectListState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
