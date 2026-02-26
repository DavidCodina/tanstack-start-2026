import { Checkbox } from '@base-ui/react/checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/utils'

export type CheckboxIndicatorProps = Checkbox.Indicator.Props

const baseClasses = `
group flex items-center justify-center
text-white data-unchecked:hidden
`

/* ========================================================================

======================================================================== */

export const CheckboxIndicator = ({
  children,
  className,
  keepMounted,
  style,
  ...otherProps // render, etc.
}: CheckboxIndicatorProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Checkbox.Indicator
      data-slot='checkbox-indicator'
      className={(checkboxIndicatorState) => {
        if (typeof className === 'function') {
          className = className(checkboxIndicatorState) || ''
        }
        return cn(baseClasses, className)
      }}
      keepMounted={keepMounted}
      render={(props, state) => {
        // Note state.valid does not change based entirely on the Field.Root invalid prop.
        // Rather, it's dependent on the internal validity state.
        if (state.indeterminate) {
          return (
            <span {...props}>
              <Minus
                // No need for fancy className when using state.
                // className='hidden group-data-indeterminate:block'
                size='100%'
                strokeWidth={2}
              />
            </span>
          )
        }

        return (
          <span {...props}>
            {children ? (
              children
            ) : (
              <Check
                // No need for fancy className when using state.
                // className='group-data-indeterminate:hidden'
                size='100%'
                strokeWidth={2}
              />
            )}
          </span>
        )
      }}
      style={style}
      {...otherProps}
    />
  )
}
