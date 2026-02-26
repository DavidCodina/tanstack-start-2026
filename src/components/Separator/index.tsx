import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { cn } from '@/utils'

export type SeparatorProps = SeparatorPrimitive.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */

export const Separator = ({
  className = '',
  orientation = 'horizontal',
  ...otherProps
}: SeparatorProps) => {
  return (
    <SeparatorPrimitive
      {...otherProps}
      data-slot='separator'
      className={(separatorState) => {
        if (typeof className === 'function') {
          className = className(separatorState) || ''
        }
        return cn(
          baseClasses,
          orientation === 'vertical' && 'w-px',
          orientation === 'horizontal' && 'h-px w-full',
          className
        )
      }}
      orientation={orientation}
    />
  )
}
