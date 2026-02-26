import { Combobox } from '@base-ui/react/combobox'
import { cn } from '@/utils'

export type ComboboxPortalProps = Combobox.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const ComboboxPortal = ({
  className,
  ...otherProps
}: ComboboxPortalProps) => {
  return (
    <Combobox.Portal
      {...otherProps}
      data-slot='combobox-portal'
      className={(comboboxPortalState) => {
        if (typeof className === 'function') {
          className = className(comboboxPortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
