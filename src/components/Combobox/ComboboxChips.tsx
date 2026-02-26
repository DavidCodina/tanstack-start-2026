import { Combobox } from '@base-ui/react/combobox'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

// Combobox.Chips does not actually receive any Base UI data attributes.
// Instead, rely on group-data-*/root: modifiers. However,
// for simple focus styles, we can use focus-within.
const FIELD_FOCUS_MIXIN = `
focus-within:shadow-none
focus-within:border-primary
focus-within:ring-[3px]
focus-within:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:group-data-valid/root:not-group-data-disabled/root:border-success
not-group-data-validating/root:group-data-valid/root:focus-within:border-success
not-group-data-validating/root:group-data-valid/root:focus-within:ring-success/40
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:group-data-invalid/root:not-group-data-disabled/root:border-destructive
not-group-data-validating/root:group-data-invalid/root:focus-within:border-destructive
not-group-data-validating/root:group-data-invalid/root:focus-within:ring-destructive/40
`

const FIELD_DISABLED_MIXIN = `
data-disabled:cursor-not-allowed 
data-disabled:border-neutral-400
`

const baseClasses = `
flex flex-wrap items-center gap-x-[0.5em]
bg-card w-full min-w-0
px-[0.5em] py-[0.25em]
border outline-none
rounded-[0.375em]
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ======================
comboboxMultipleVariants
====================== */
// ⚠️ Gotcha: input elements have browser-based intrinsic sizing that
// can't be fully overridden without explicitly setting height.
// From experimentation, it seems to be creating a line-height
// of 1.5 (at least for Poppins). However, this isn't reflected
// in Chrome devtools computed styles, which makes it confusing.
// In any case, this is why we set leading-[1.5] to make it explicit.

const comboboxMultipleVariants = cva(baseClasses, {
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
// comboboxChipsProps. A similar issue exists within numberFieldGroupProps. However,
// this IS the correct location for fieldSize.
export type ComboboxChipsProps = Combobox.Chips.Props &
  VariantProps<typeof comboboxMultipleVariants>

/* ========================================================================

======================================================================== */
/** An abstraction that chunks away Combobox.Chips, Combobox.Value,
 * Combobox.Chip, and Combobox.Input. */

export const ComboboxChips = ({
  className = '',
  fieldSize,
  ref,
  ...otherProps
}: ComboboxChipsProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Combobox.Chips
      {...otherProps}
      data-slot='combobox-chips'
      className={(comboboxChipsState) => {
        if (typeof className === 'function') {
          className = className(comboboxChipsState) || ''
        }
        return cn(comboboxMultipleVariants({ fieldSize }), className)
      }}
      // ⚠️ Don't forget to pass ref when consuming. Why? That ref is then passed
      // to comboboxPositionerProps.anchor: comboboxPositionerProps={{ anchor: anchorRef}}
      ref={ref}
    />
  )
}
