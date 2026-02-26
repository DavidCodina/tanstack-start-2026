import {
  createFormHook,
  createFormHookContexts,
  formOptions as formOpts
} from '@tanstack/react-form-start'

import { FirstName } from './FirstName'
import { LastName } from './LastName'
import { SubmitButton } from './SubmitButton'

/* ========================================================================

======================================================================== */

const defaultValues = {
  firstName: '',
  lastName: ''
}

export const formOptions = formOpts({
  defaultValues
})

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

const {
  useAppForm: useCustomForm,
  withForm
  // See Ali Alaa at 2:12:30 - https://www.youtube.com/watch?v=H2T21r5wu3g
  // withFieldGroup,
} = createFormHook({
  fieldComponents: {
    FirstName,
    LastName
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})

export { useCustomForm, withForm }
