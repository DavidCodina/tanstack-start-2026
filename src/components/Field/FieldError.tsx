import { Field } from '@base-ui/react/field'

import { cn } from '@/utils'

export type FieldErrorProps = Field.Error.Props

// ⚠️ Be careful if adding additional styles. This component is used
// by several other Base UI components (e.g., Checkbox, CheckboxGroup, etc.)
// w-full forces the error onto a new line when inside of a flex flex-wrap container.
const baseClasses = `
hidden
not-group-data-validating/root:not-data-disabled:data-invalid:block
text-destructive mt-1 text-sm w-full overflow-scroll
`

/* ========================================================================

======================================================================== */

export const FieldError = ({
  className,
  match = true,
  ...otherProps
}: FieldErrorProps) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, I was wrapping the whole thing in Field.Validity, but it turns out that's
  // not necessary. The acutal Field.Error seems to know when to show/hide itself.
  //
  // return (
  //   <Field.Validity>
  //     {(state) => {
  //       // console.log(state)
  //       const { error: errorArg, errors: _errors } = state
  //
  //       if (errorArg) {
  //         return ...
  //       }
  //       return null
  //     }}
  //   </Field.Validity>
  // )
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <Field.Error
      {...otherProps}
      data-slot='field-error'
      className={(fieldRootState) => {
        if (typeof className === 'function') {
          className = className(fieldRootState) || ''
        }
        return cn(baseClasses, className)
      }}
      match={match}
    />
  )
}
