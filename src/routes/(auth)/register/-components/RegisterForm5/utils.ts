import {
  createFormHook,
  createFormHookContexts,
  formOptions as formOpts
} from '@tanstack/react-form-start'

import { InputField } from './InputField'
import { InputPasswordField } from './InputPasswordField'
import { SubmitButton } from './SubmitButton'

import type { ZodData } from './schema'

/* ========================================================================

======================================================================== */

const defaultValues: ZodData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export const formOptions = formOpts({
  defaultValues
})

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

/* ========================================================================

======================================================================== */

const {
  useAppForm: useCustomForm,
  withForm
  // See Ali Alaa at 1:50:15, 2:12:30 - https://www.youtube.com/watch?v=H2T21r5wu3g
  // withFieldGroup,
} = createFormHook({
  fieldComponents: {
    InputField,
    InputPasswordField
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})

export { useCustomForm, withForm }
