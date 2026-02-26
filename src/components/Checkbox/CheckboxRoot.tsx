import { Checkbox } from '@base-ui/react/checkbox'
import { cn } from '@/utils'

export type CheckboxRootProps = Checkbox.Root.Props & {}

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
not-group-data-validating/root:data-valid:not-data-disabled:data-indeterminate:bg-success
not-group-data-validating/root:data-valid:not-data-disabled:data-checked:bg-success
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:border-destructive
not-group-data-validating/root:data-invalid:focus-visible:ring-destructive/40
not-group-data-validating/root:data-invalid:not-data-disabled:data-indeterminate:bg-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:data-checked:bg-destructive
`

const FIELD_DISABLED_MIXIN = `
data-disabled:data-unchecked:border-neutral-400
data-disabled:data-indeterminate:bg-neutral-400
data-disabled:data-checked:bg-neutral-400
`

// size-[1.25em] matches that sets the relative size of the checkbox based
// on the font size. In order to make the checkbox and label scale together,
// set font-size on the CheckboxFieldRoot.

const baseClasses = `
flex items-center justify-center
m-0 p-0 size-[1.25em] rounded-[0.25em] cursor-pointer
outline-none
data-indeterminate:bg-primary
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

export const CheckboxRoot = ({
  name,
  defaultChecked,
  checked,
  onCheckedChange,
  indeterminate,
  value,
  nativeButton,
  parent,
  uncheckedValue,
  disabled,
  readOnly,
  required,
  inputRef,
  id,
  className = '',
  style,
  render,
  ...otherProps
}: CheckboxRootProps) => {
  return (
    <Checkbox.Root
      {...otherProps}
      data-slot='checkbox-root'
      name={name}
      defaultChecked={defaultChecked}
      checked={checked}
      onCheckedChange={onCheckedChange}
      indeterminate={indeterminate}
      nativeButton={nativeButton}
      parent={parent}
      ///////////////////////////////////////////////////////////////////////////
      //
      //   uncheckedValue: 'no'
      //   value: 'yes',
      //
      // When uncheckedValue is provided and the checkbox is unchecked,
      // Base UI adds a hidden <input type="hidden" name="my-checkbox" value="no">
      // FormData.get() returns the first input it finds with that name when
      // iterating through the form's inputs in DOM order.
      //
      //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      //     e.preventDefault()
      //     const formData = new FormData(e.currentTarget)
      //     const checkboxValue = formData.get('my-checkbox') // 'yes' or 'no'
      //     console.log('Checkbox value:', checkboxValue)
      //   }
      //
      // Unchecked checkboxes are excluded from FormData (native behavior).
      // However, the hidden input is not a checkbox, so it always submits.
      // uncheckedValue is a form submission feature, not a state value.
      // Moreover, it's only accessible through the FormData hack, which necessarily
      // requires a <form> to wrap the checkbox. Base UI doesn’t expose it because
      // it’s only used to manage the hidden input during form submission.
      //
      // Ultimately, uncheckedValue is kind of hacky.
      // In practice it's much easier to derive such a value by doing
      // something like this in onCheckedChange:
      //
      //   const value = checked ? 'yes' : 'no'
      //
      ///////////////////////////////////////////////////////////////////////////

      uncheckedValue={uncheckedValue}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      inputRef={inputRef}
      id={id}
      style={style}
      render={render}
      className={(checkboxRootState) => {
        if (typeof className === 'function') {
          className = className(checkboxRootState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
