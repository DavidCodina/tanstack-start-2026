import { Input } from '../../'
import { useFieldContext } from './utils'

/* ========================================================================

======================================================================== */

export const FirstName = () => {
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
      fieldRootProps={{
        name: field.name,
        invalid: isInvalid,
        dirty: isDirty,
        touched: isBlurred
      }}
      inputProps={{
        value: field.state.value,

        onBlur: field.handleBlur,

        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          field.handleChange(e.target.value)
        },

        placeholder: 'First Name...',
        fieldSize: 'sm'
      }}
      fieldLabelProps={{
        children: 'First Name',
        labelRequired: true
      }}
      fieldDescriptionProps={{}}
      fieldErrorProps={{
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
