import { NumberField } from '@base-ui/react/number-field'
import { cn } from '@/utils'

export type NumberFieldInputProps = NumberField.Input.Props

const FIELD_FOCUS_MIXIN = `not-data-disabled:data-focused:border-primary`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:border-success
not-group-data-validating/root:data-valid:not-data-disabled:data-focused:border-success
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:data-focused:border-destructive
`

const FIELD_DISABLED_MIXIN = `
data-disabled:cursor-not-allowed
data-disabled:border-neutral-400
`

const baseClasses = `
flex-1
bg-card
w-full min-w-0
px-[0.5em] py-[0.25em]
text-center
border-y
outline-none
placeholder:text-muted-foreground
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const NumberFieldInput = ({
  className,
  ...otherProps
}: NumberFieldInputProps) => {
  /* ======================
          return
  ====================== */

  return (
    <NumberField.Input
      data-slot='number-field-input'
      {...otherProps}
      className={(numberFieldInputState) => {
        if (typeof className === 'function') {
          className = className(numberFieldInputState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
