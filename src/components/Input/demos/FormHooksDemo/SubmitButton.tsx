import { Button } from '../../../Button'
import { getFieldErrors } from '../getFieldErrors'
import { useFormContext } from './utils'

/* ========================================================================

======================================================================== */

export const SubmitButton = () => {
  const form = useFormContext()

  /* ======================
          return
  ====================== */

  return (
    <form.Subscribe
      selector={(state) => {
        const fieldErrors = getFieldErrors(state.fieldMeta)

        return {
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          isFieldsValidating: state.isFieldsValidating,
          formErrors: state.errors,
          fieldErrors: fieldErrors,
          isFieldErrors: !state.isFieldsValid
        }
      }}
    >
      {(param) => {
        return (
          <Button
            className='flex w-full'
            disabled={!param.canSubmit}
            loading={param.isSubmitting}
            onClick={() => {
              const submitMeta = {}
              form.handleSubmit(submitMeta)
            }}
            size='sm'
            type='button'
            variant='success'
          >
            {param.isSubmitting
              ? 'Submitting...'
              : !param.canSubmit && !param.isFieldsValidating
                ? 'Please Correct Errors...'
                : 'Submit'}
          </Button>
        )
      }}
    </form.Subscribe>
  )
}
