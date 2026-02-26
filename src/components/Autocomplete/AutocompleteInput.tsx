import { Autocomplete } from '@base-ui/react/autocomplete'
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
// See: https://github.com/mui/base-ui/issues/3987
//      https://github.com/mui/base-ui/pull/3996
//
// This issue still persists as of the latest v1.2 update.
//
///////////////////////////////////////////////////////////////////////////
const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-primary
focus-visible:ring-[3px]
focus-visible:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:border-success
not-group-data-validating/root:data-valid:focus-visible:border-success
not-group-data-validating/root:data-valid:focus-visible:ring-success/40
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:ring-destructive/40
`

const FIELD_DISABLED_MIXIN = `
data-disabled:cursor-not-allowed
data-disabled:border-neutral-400
`

const baseClasses = `
flex bg-card
w-full min-w-0
px-[0.5em] py-[0.25em]
rounded-[0.375em]
border outline-none
placeholder:text-muted-foreground
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ======================
autocompleteInputVariants
====================== */

export const autocompleteInputVariants = cva(baseClasses, {
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

export type AutocompleteInputProps = Autocomplete.Input.Props &
  VariantProps<typeof autocompleteInputVariants>

/* ========================================================================

======================================================================== */

export const AutocompleteInput = ({
  className,
  fieldSize,
  ...otherProps
}: AutocompleteInputProps) => {
  return (
    <Autocomplete.Input
      {...otherProps}
      data-slot='autocomplete-input'
      className={(autocompleteInputState) => {
        if (typeof className === 'function') {
          className = className(autocompleteInputState) || ''
        }
        return cn(autocompleteInputVariants({ fieldSize }), className)
      }}
    />
  )
}
