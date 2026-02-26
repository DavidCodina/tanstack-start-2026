import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { useToggleGroupContext } from '../../ToggleGroup'
import { toggleVariants } from './toggleVariants'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

export type ToggleProps = TogglePrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    isIcon?: boolean
  }

const FIRST_CHILD_MIXIN = `first:rounded-s-(--toggle-radius,0.375em)`
const NOT_FIRST_CHILD_MIXIN = `not-first:border-l-0`
const LAST_CHILD_MIXIN = `last:rounded-e-(--toggle-radius,0.375em)`

/* ========================================================================

======================================================================== */

export const Toggle = ({
  className = '',
  isIcon = false,
  size,
  variant,
  ...otherProps
}: ToggleProps) => {
  const context = useToggleGroupContext()

  // When wrapped in ToggleGroup, ToggleGroupContext sets isToggleGroup: true, which
  // is then used to conditionally apply FIRST_CHILD_MIXIN, NOT_FIRST_CHILD_MIXIN,
  // and LAST_CHILD_MIXIN. No need to manually apply a prop like isGrouped when consuming.
  const isToggleGroup = context?.isToggleGroup === true ? true : false

  /* ======================
          return
  ====================== */

  return (
    <TogglePrimitive
      {...otherProps}
      data-slot='toggle'
      className={(toggleState) => {
        if (typeof className === 'function') {
          className = className(toggleState) || ''
        }
        return cn(
          toggleVariants({ size, variant }),
          isIcon && 'p-[0.375em]',
          isToggleGroup
            ? `${FIRST_CHILD_MIXIN} ${NOT_FIRST_CHILD_MIXIN} ${LAST_CHILD_MIXIN}`
            : `rounded-(--toggle-radius,0.375em)`,
          className
        )
      }}
    />
  )
}
