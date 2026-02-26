import { NumberField } from '@base-ui/react/number-field'
import { Minus } from 'lucide-react'
import { cn } from '@/utils'

export type NumberFieldDecrementProps = NumberField.Decrement.Props

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
rounded-s-[calc(0.375em-1px)]
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const NumberFieldDecrement = ({
  className,
  ...otherProps
}: NumberFieldDecrementProps) => {
  /* ======================
          return
  ====================== */

  return (
    <NumberField.Decrement
      data-slot='number-field-decrement'
      children={<Minus className='size-[1.25em]' />}
      {...otherProps}
      className={(numberFieldDecrementState) => {
        if (typeof className === 'function') {
          className = className(numberFieldDecrementState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
