import { NumberField } from '@base-ui/react/number-field'
import { Plus } from 'lucide-react'
import { cn } from '@/utils'

export type NumberFieldIncrementProps = NumberField.Increment.Props

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:group-data-valid/root:not-data-disabled:bg-success
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:group-data-invalid/root:not-data-disabled:bg-destructive
`

const FIELD_DISABLED_MIXIN = `
data-disabled:cursor-not-allowed 
data-disabled:bg-neutral-400
`

const baseClasses = `
flex items-center justify-center 
bg-primary text-white bg-clip-padding 
select-none cursor-pointer
min-w-[calc(2em+2px)]
rounded-e-[calc(0.375em-1px)]
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const NumberFieldIncrement = ({
  className,
  ...otherProps
}: NumberFieldIncrementProps) => {
  /* ======================
          return
  ====================== */

  return (
    <NumberField.Increment
      data-slot='number-field-increment'
      children={<Plus className='size-[1.25em]' />}
      {...otherProps}
      className={(numberFieldIncrementState) => {
        if (typeof className === 'function') {
          className = className(numberFieldIncrementState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
