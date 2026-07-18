import * as React from 'react'
import { Field } from '@base-ui/react/field'
import { useValidationHack } from './useValidationHack'
import { useMergedRef } from '@/hooks'
import { cn } from '@/utils'

export type FieldRootProps = Field.Root.Props & {
  /** forceValidity is true by default. Turn it off
   * when not using a controlled invalid prop. */
  forceValidity?: boolean
  validating?: boolean
  disableEnter?: boolean
}

// ⚠️ DO NOT add baseClasses beyond `group/root`. This component is used
// by several other Base UI components (e.g., Checkbox, CheckboxGroup, etc.)
const baseClasses = `group/root`

/* ========================================================================

======================================================================== */
// https://github.com/mui/base-ui/blob/master/packages/react/src/field/root/FieldRoot.tsx

export const FieldRoot = ({
  name,
  onKeyDownCapture,
  dirty,
  disableEnter = true,
  touched,
  disabled,
  invalid,
  validate,
  validationMode,
  validationDebounceTime,
  className,
  style,
  render,
  ref,
  forceValidity = true,
  validating,
  ...otherProps
}: FieldRootProps) => {
  const internalRef = React.useRef<HTMLDivElement>(null)
  const mergedRef = useMergedRef(internalRef, ref)

  ///////////////////////////////////////////////////////////////////////////
  //
  // See https://github.com/mui/base-ui/issues/3777
  // invalid={false} before validation does nothing.
  //
  // invalid={undefined} after validation falls back
  // to the internal validity state.
  //
  // Ultimately, this means that the invalid prop is NOT the final
  // arbiter of the field's data-valid/data-invalid attributes.
  // This hack attempts to correct for that.
  //
  // Issues still exists as of v1.3.0
  //
  // Note: Before this hack, I tried rebuilding FieldRoot from the source code,
  // but it's way too complex and has many weird dependencies. An alternative
  // solution would be to allow invalid to be null (or 'initial'), then change
  // it to undefined before passing it to FieldRoot. The custom invalid
  // could then be passed to the Field.Label and Field.Error which
  // would subsequently use it to determine CSS/Tailwind styles.
  //
  // In other words, we could entirely move away from relying on the data attributes
  // for styling since they are applied in a counter-intuitive/unreliable manner.
  //
  ///////////////////////////////////////////////////////////////////////////

  useValidationHack({
    forceValidity,
    internalRef,
    invalid,
    validating
  })

  /* ======================
          return
  ====================== */

  return (
    <Field.Root
      data-slot='field-root'
      className={(fieldRootState) => {
        if (typeof className === 'function') {
          className = className(fieldRootState) || ''
        }
        return cn(baseClasses, className)
      }}
      ref={mergedRef}
      dirty={dirty}
      disabled={disabled}
      invalid={invalid}
      name={name}
      render={render}
      style={style}
      touched={touched}
      validate={validate}
      validationDebounceTime={validationDebounceTime}
      validationMode={validationMode}

      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ Gotcha: Base UI will run its own validation when Enter key is pressed.
      // Assuming you have no <Form /> and no `validate` prop on Field.Control, Input, etc.
      // it will then add a data-valid attribute. We definitely don't want that.
      // This will block Base UI from receiving the Enter keypress.
      //
      /////////////////////////////////////////////////////////////////////////////
      onKeyDownCapture={(e) => {
        onKeyDownCapture?.(e)
        if (e.key === 'Enter' && disableEnter) {
          e.stopPropagation()
        }
      }}
      {...otherProps}
    />
  )
}
