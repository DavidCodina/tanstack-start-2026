import { Select } from '@base-ui/react/select'
import { cn } from '@/utils'

export type SelectPositionerProps = Select.Positioner.Props

const baseClasses = `
outline-none select-none z-49
`

/* ========================================================================

======================================================================== */

export const SelectPositioner = ({
  className = '',
  ...otherProps
}: SelectPositionerProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Select.Positioner
      alignItemWithTrigger={false} // Set to false for sideOffset to work.
      // side='bottom'
      // align='end'
      // positionMethod='absolute'
      // alignOffset={50}
      sideOffset={10}
      {...otherProps}
      data-slot='select-positioner'
      className={(selectPositionerState) => {
        if (typeof className === 'function') {
          className = className(selectPositionerState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
