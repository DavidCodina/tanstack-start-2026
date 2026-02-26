import { Select } from '@base-ui/react/select'
import { cn } from '@/utils'

export type SelectPortalProps = Select.Portal.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const SelectPortal = ({
  className = '',
  ...otherProps
}: SelectPortalProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Select.Portal
      {...otherProps}
      data-slot='select-portal'
      className={(selectPortalState) => {
        if (typeof className === 'function') {
          className = className(selectPortalState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
