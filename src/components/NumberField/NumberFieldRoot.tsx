import { NumberField } from '@base-ui/react/number-field'
import { cn } from '@/utils'

export type NumberFieldRootProps = NumberField.Root.Props

/* ========================================================================

======================================================================== */

export const NumberFieldRoot = ({
  className,
  ...otherProps
}: NumberFieldRootProps) => {
  /* ======================
          return
  ====================== */

  return (
    <NumberField.Root
      {...otherProps}
      data-slot='number-field-root'
      className={(numberFieldRootState) => {
        if (typeof className === 'function') {
          className = className(numberFieldRootState) || ''
        }

        // items-start will compress NumberFieldGroup to the left.
        // While that might make sense, right now I don't want to do that.
        return cn('flex flex-col gap-1', className)
      }}
    />
  )
}
