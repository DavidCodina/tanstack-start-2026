import { useFieldContext } from './utils'

import type { InputProps } from '@/components/Input'
import { Input } from '@/components/Input'

/* ========================================================================

======================================================================== */

export const InputField = ({
  fieldRootProps,
  inputProps,
  fieldErrorProps,
  ...otherProps
}: InputProps) => {
  const field = useFieldContext<string>()
  const errors = field.state.meta.errors
  const isErrors = errors.length > 0
  const isBlurred = field.state.meta.isBlurred
  const isDirty = field.state.meta.isDirty
  const submissionAttempts = field.form.state.submissionAttempts
  const hasSubmitted = submissionAttempts > 0
  const isInvalid =
    isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

  /* ======================
           return
  ====================== */

  return (
    <Input
      {...otherProps}

      fieldRootProps={{
        ...fieldRootProps,
        name: field.name,
        invalid: isInvalid,
        dirty: isDirty,
        touched: isBlurred
      }}

      inputProps={{
        ...inputProps,
        value: field.state.value,
        onBlur: field.handleBlur,

        onChange: (e) => {
          inputProps?.onChange?.(e)
          field.handleChange(e.target.value)
          if (isBlurred || hasSubmitted) {
            field.validate('blur')
          }
        }
      }}

      fieldErrorProps={{
        ...fieldErrorProps,
        children: isInvalid
          ? errors
              .filter(Boolean)
              .map((error) => {
                return typeof error === 'string' ? error : error.message
              })
              .join(', ')
          : undefined
      }}
    />
  )
}
