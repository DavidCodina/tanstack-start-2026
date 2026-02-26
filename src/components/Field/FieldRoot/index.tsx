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
}

// ⚠️ DO NOT add baseClasses beyond `group/root`. This component is used
// by several other Base UI components (e.g., Checkbox, CheckboxGroup, etc.)
const baseClasses = `group/root`

/* ========================================================================

======================================================================== */
// https://github.com/mui/base-ui/blob/master/packages/react/src/field/root/FieldRoot.tsx

export const FieldRoot = ({
  name,
  dirty,
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

  // See https://github.com/mui/base-ui/issues/3777
  // invalid={false} before validation does nothing.
  // invalid={undefined} after validation falls back
  // to the internal validity state. Ultimately, this
  // means that the invalid prop is NOT the final arbiter
  // of the field's data-valid/data-invalid attributes.
  // This hack attempts to correct for that.

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
      {...otherProps}
    />
  )
}
