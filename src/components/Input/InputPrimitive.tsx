import { Input } from '@base-ui/react/input'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

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

const FILE_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:file:text-success-foreground
not-group-data-validating/root:data-valid:not-data-disabled:file:bg-success
not-group-data-validating/root:data-valid:not-data-disabled:file:border-success

not-group-data-validating/root:data-invalid:not-data-disabled:file:text-destructive-foreground
not-group-data-validating/root:data-invalid:not-data-disabled:file:bg-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:file:border-destructive

data-disabled:file:text-white
data-disabled:file:bg-neutral-400
data-disabled:file:border-neutral-400
`

// The padding and border radius match that of the Button component.
const baseClasses = `
flex bg-card
w-full min-w-0
[&:not([type='file'])]:px-[0.5em]
[&:not([type='file'])]:py-[0.25em]
rounded-[0.375em]
border outline-none
placeholder:text-muted-foreground
file:text-primary-foreground
file:bg-primary
file:border-r
file:border-border
file:font-medium
file:px-[0.5em]
file:py-[0.25em]
file:inline-flex
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
${FILE_MIXIN}
`

/* ======================
      inputVariants
====================== */
// ⚠️ Gotcha: input elements have browser-based intrinsic sizing that
// can't be fully overridden without explicitly setting height.
// From experimentation, it seems to be creating a line-height
// of 1.5 (at least for Poppins). However, this isn't reflected
// in Chrome devtools computed styles, which makes it confusing.
// In any case, this is why we set leading-[1.5] to make it explicit.

const inputVariants = cva(baseClasses, {
  variants: {
    fieldSize: {
      xs: 'text-xs leading-[1.5] file:text-xs file:leading-[1.5]',
      sm: 'text-sm leading-[1.5] file:text-sm file:leading-[1.5]',
      md: 'text-base leading-[1.5] file:text-base file:leading-[1.5]',
      lg: 'text-lg leading-[1.5] file:text-lg file:leading-[1.5]',
      xl: 'text-xl leading-[1.5] file:text-xl file:leading-[1.5]'
    },
    defaultVariants: {
      fieldSize: 'md'
    }
  }
})

export type InputPrimitiveProps = Input.Props &
  VariantProps<typeof inputVariants>

/* ========================================================================

======================================================================== */
// Field.Control is the low-level, general-purpose primitive for building form controls,
// while Input is a semantically-specific component for text inputs.
// Use Field.Control when you need maximum flexibility or are building custom form controls

export const InputPrimitive = ({
  defaultValue,
  onValueChange,
  className,
  style,
  render,
  fieldSize,
  ...otherProps
}: InputPrimitiveProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Input
      autoCapitalize='none'
      // Browsers often ignore autoComplete='off'
      // Even with 'new-password', Chrome still auto completes values.
      // ❌ autoComplete='off'
      autoComplete='new-password'
      autoCorrect='off'
      spellCheck={false}
      {...otherProps}
      data-slot='input'
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={(fieldRootState) => {
        if (typeof className === 'function') {
          className = className(fieldRootState) || ''
        }
        return cn(inputVariants({ fieldSize }), className)
      }}
      style={style}
      render={render}
    />
  )
}
