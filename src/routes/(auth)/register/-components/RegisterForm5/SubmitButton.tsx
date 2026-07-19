import { TriangleAlert } from 'lucide-react'

import { useFormContext } from './utils'
import { Button } from '@/components'
import { tanstackFormGetFieldErrors } from '@/utils'

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
        const fieldErrors = tanstackFormGetFieldErrors(state.fieldMeta)

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
            onClick={form.handleSubmit}
            size='sm'
            type='button'
            variant={param.isFieldErrors ? 'destructive' : 'primary'}
          >
            {param.isSubmitting ? (
              'Registering...'
            ) : !param.canSubmit && !param.isFieldsValidating ? (
              <>
                <TriangleAlert /> Please Correct Errors...
              </>
            ) : (
              'Register'
            )}
          </Button>
        )
      }}
    </form.Subscribe>
  )
}
