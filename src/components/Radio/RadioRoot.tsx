import { Radio } from '@base-ui/react/radio'
import { cn } from '@/utils'

export type RadioRootProps = Radio.Root.Props

const FIELD_BOX_SHADOW_MIXIN = `
shadow-xs
`

// ⚠️ Gotcha: In some Base UI components, I've opted for data-focused
// over focus-visible for the Tailwind modifier. However, in the case of
// CheckboxGroup and RadioGroup, data-focused applies to all checks/radios
// when ANY check/radio is focused. That's not what we want.
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
not-group-data-validating/root:data-valid:not-data-disabled:data-checked:bg-success
`

// This assumes FIELD_FOCUS_VISIBLE_MIXIN is already
// being used, and so only modifies border and ring.
const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:ring-destructive/40
not-group-data-validating/root:data-invalid:not-data-disabled:data-checked:bg-destructive
`

const FIELD_DISABLED_MIXIN = `
data-disabled:data-unchecked:border-neutral-400
data-disabled:data-indeterminate:bg-neutral-400
data-disabled:data-checked:bg-neutral-400
`

const baseClasses = `
flex items-center justify-center
m-0 p-0 size-[1.25em] rounded-full cursor-pointer
outline-none
data-unchecked:border
data-unchecked:border-primary
data-unchecked:bg-transparent
data-checked:bg-primary
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const RadioRoot = ({
  value,
  nativeButton,
  disabled,
  readOnly,
  required,
  inputRef,
  className,
  style,
  render,
  id,
  ...otherProps
}: RadioRootProps) => {
  return (
    <Radio.Root
      {...otherProps} // e.g., children
      data-slot='radio-root'
      id={id}
      className={(checkboxRootState) => {
        if (typeof className === 'function') {
          className = className(checkboxRootState) || ''
        }
        return cn(baseClasses, className)
      }}
      value={value}
      nativeButton={nativeButton}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      inputRef={inputRef}
      style={style}
      render={render}
    />
  )
}
