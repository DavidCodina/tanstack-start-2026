import { NumberField } from '@base-ui/react/number-field'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `
shadow-xs
`

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: Using the data-focused attribute as a Tailwind modifier
// may seem more idiomatic to Base UI (i.e., data-focused: ...).
// However, data-focused doesn't remove itself when data-disabled is applied.
// In fact, it often seems to get stuck on the DOM element when data-disabled,
// even after the element no longer truly has focus. Consequently, focus styles
// can potentially persist when they shouldn't. For this reason, it's better to
// stick with the focus-visible: ... modifier.
//
// However, unlike with Combobox, Autocomplete, Input, etc., the NumberField.Group focus
// styles can't simply be applied using the focus-visible: ... modifier. Thus
// continue using data-focused, but also add not-data-disabled.
//# Might be able to use focus-within: instead.
//
// See: https://github.com/mui/base-ui/issues/3987
//      https://github.com/mui/base-ui/pull/3996
//
// This issue still persists as of the latest v1.3.0 update:
// Do this to test:
// React.useEffect(() => { setTimeout(() => { setDisabled(true) }, 5000) })
//
///////////////////////////////////////////////////////////////////////////

const FIELD_FOCUS_MIXIN = `
not-data-disabled:data-focused:shadow-none
not-data-disabled:data-focused:border-primary
not-data-disabled:data-focused:ring-[3px]
not-data-disabled:data-focused:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:border-success
not-group-data-validating/root:data-valid:not-data-disabled:data-focused:border-success
not-group-data-validating/root:data-valid:not-data-disabled:data-focused:ring-success/40
`

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ The data-invalid attribute doesn't seem to be getting applied to NumberField.Group.
// See GitHub issue #3908 : https://github.com/mui/base-ui/issues/3908
//
// const FIELD_INVALID_MIXIN = `
// not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
// not-group-data-validating/root:data-invalid:data-focused:border-destructive
// not-group-data-validating/root:data-invalid:data-focused:ring-destructive/40 `
//
// For now, the workaround is to use group-data-invalid/root: ... instead.
//
// const FIELD_INVALID_MIXIN = `
// not-group-data-validating/root:group-data-invalid/root:not-data-disabled:border-destructive
// not-group-data-validating/root:group-data-invalid/root:not-data-disabled:data-focused:border-destructive
// not-group-data-validating/root:group-data-invalid/root:not-data-disabled:data-focused:ring-destructive/40
// `
//
// Fixed in v1.2.0.
//
///////////////////////////////////////////////////////////////////////////

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid/root:not-data-disabled:border-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:data-focused:border-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:data-focused:ring-destructive/40
`

// items-stretch causes the Increment/Decrement to take full height.
const baseClasses = `
flex items-stretch
w-full min-w-0
outline-none
rounded-[0.375em]
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
`

/* ======================
numberFieldGroupVariants
====================== */

const numberFieldGroupVariants = cva(baseClasses, {
  variants: {
    fieldSize: {
      xs: 'text-xs leading-[1.5]',
      sm: 'text-sm leading-[1.5]',
      md: 'text-base leading-[1.5]',
      lg: 'text-lg leading-[1.5]',
      xl: 'text-xl leading-[1.5]'
    },
    defaultVariants: {
      fieldSize: 'md'
    }
  }
})

// Normally, I've been adding fieldSize to fieldControlProps, selectTriggerProps, etc.
// In this case, it's less obvious to the consumer that fieldSize would be located within
// numberFieldGroupProps. However, this IS the correct location for fieldSize.
type NumberFieldGroupVariants = VariantProps<typeof numberFieldGroupVariants>
export type NumberFieldGroupProps = NumberField.Group.Props &
  NumberFieldGroupVariants

/* ========================================================================

======================================================================== */

export const NumberFieldGroup = ({
  className = '',
  fieldSize,
  ...otherProps
}: NumberFieldGroupProps) => {
  /* ======================
          return
  ====================== */

  return (
    <NumberField.Group
      {...otherProps}
      data-slot='number-field-group'
      className={(numberFieldGroupState) => {
        if (typeof className === 'function') {
          className = className(numberFieldGroupState) || ''
        }
        return cn(numberFieldGroupVariants({ fieldSize }), className)
      }}
    />
  )
}
