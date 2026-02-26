import { Combobox } from '@base-ui/react/combobox'
import { cn } from '@/utils'

export type ComboboxEmptyProps = Combobox.Empty.Props

const baseClasses = `
p-4 leading-4 text-center empty:m-0 empty:p-0
`

/* ========================================================================

======================================================================== */

export const ComboboxEmpty = ({
  children = 'No items found',
  className,
  ...otherProps
}: ComboboxEmptyProps) => {
  return (
    <Combobox.Empty
      children={children}
      {...otherProps}
      data-slot='combobox-empty'
      className={(comboboxEmptyState) => {
        if (typeof className === 'function') {
          className = className(comboboxEmptyState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
