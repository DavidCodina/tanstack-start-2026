import { Bug } from 'lucide-react'
import { Button } from '../../Button'
import { getFieldErrors } from './getFieldErrors'
import type { ButtonProps } from '@/components'

type DebugFormProps = Omit<
  ButtonProps,
  'children' | 'title' | 'type' | 'onClick' | 'form'
> & {
  form: any
}

/* ========================================================================

======================================================================== */

export const DebugForm = ({ form, ...otherProps }: DebugFormProps) => {
  return (
    <form.Subscribe
      selector={(state: any) => {
        const fieldMeta = state.fieldMeta
        const fieldErrors = getFieldErrors(fieldMeta)

        return {
          values: state.values,
          formErrors: state.errors,
          fieldErrors: fieldErrors,
          isFieldErrors: !state.isFieldsValid,
          canSubmit: state.canSubmit,
          fieldMeta: fieldMeta
        }
      }}
    >
      {(param: any) => {
        return (
          <Button
            isIcon
            size='sm'
            variant='info'
            {...otherProps}
            onClick={() => {
              console.log({
                values: param.values,
                formErrors: param.formErrors,
                fieldErrors: param.fieldErrors,
                isFieldErrors: param.isFieldErrors,
                canSubmit: param.canSubmit,
                fieldMeta: param.fieldMeta
              })
            }}
            title='Debug'
            type='button'
          >
            <Bug />
            <span className='sr-only'>Debug</span>
          </Button>
        )
      }}
    </form.Subscribe>
  )
}
