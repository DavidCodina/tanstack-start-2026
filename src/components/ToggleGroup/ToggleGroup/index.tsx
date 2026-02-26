import * as React from 'react'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { cn } from '@/utils'

export type ToggleGroupProps = ToggleGroupPrimitive.Props

const baseClasses = `
[--toggle-radius:0.375em]
inline-flex items-center justify-center w-fit align-top
rounded-(--toggle-radius)
data-disabled:cursor-not-allowed
`

type ToggleGroupContextValue = {
  isToggleGroup: boolean
}

const ToggleGroupContext = React.createContext<
  ToggleGroupContextValue | undefined
>(undefined)

/* ========================================================================

======================================================================== */

export const ToggleGroup = ({
  className = '',
  ...otherProps
}: ToggleGroupProps) => {
  return (
    <ToggleGroupContext
      value={{
        isToggleGroup: true
      }}
    >
      <ToggleGroupPrimitive
        {...otherProps}
        data-slot='toggle-group'
        className={(toggleGroupState) => {
          if (typeof className === 'function') {
            className = className(toggleGroupState) || ''
          }
          return cn(baseClasses, className)
        }}
      />
    </ToggleGroupContext>
  )
}

/* ========================================================================
             
======================================================================== */
// Used by Toggle to conditionally apply FIRST_CHILD_MIXIN,
// NOT_FIRST_CHILD_MIXIN, and LAST_CHILD_MIXIN.
//
// Base UI could bake this into their own implementation by having a data-grouped
// attribute that is added to Toggle children when wrapped in ToggleGroup. Possibly,
// create a feature request for this later.

export const useToggleGroupContext = () => {
  const context = React.use(ToggleGroupContext)
  return context
}
