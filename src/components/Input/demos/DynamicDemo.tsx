import * as React from 'react'
import { toast } from 'sonner'
import { revalidateLogic, useForm } from '@tanstack/react-form-start'
import { z } from 'zod'

import { Input } from '../'
import { Button } from '../../Button'
import { getFieldErrors } from './getFieldErrors'

const FormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
})

const defaultValues: z.infer<typeof FormSchema> = {
  firstName: '',
  lastName: ''
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example is all about onDynamic at the field-level + validationLogic + revalidateLogic
// at the form-level. With this approach we no longer need to manually do stuff like this:
//
//   validators={{
//     onSubmit: FormSchema.shape.firstName
//   }}
//
//   onBlur: () => {
//     field.handleBlur()
//     field.validate('submit')
//   },
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//     field.handleChange(e.target.value)
//     if (isBlurred || hasSubmitted) {
//       field.validate('submit')
//     }
//   }
//
// That said, the behavior is slightly different. In the manual approach, we actually
// got onChange validation before submitting, but now it only happens after submit.
// In order to get behavior roughly similar to the manual approach, you'd need to do:
//
//   validationLogic: revalidateLogic({
//     mode: 'change',
//     modeAfterSubmission: 'change'
//   })
//
// Then additionally do this in the field's onBlur: field.validate('change')
//
///////////////////////////////////////////////////////////////////////////

export const DynamicDemo = () => {
  const [resetKey, setResetKey] = React.useState(0)

  /* ======================
        useForm()
  ====================== */

  const form = useForm({
    defaultValues: defaultValues,
    validators: {},
    // https://tanstack.com/form/latest/docs/framework/react/guides/dynamic-validation
    // This will cause validation to run onBlur initially, but
    // also onSubmit. Then after the initial submit, it will run onChange.
    validationLogic: revalidateLogic({
      mode: 'blur',
      modeAfterSubmission: 'change' // 'change' is the default
    }),

    onSubmit: ({ value, formApi: formApi, meta }) => {
      toast.success('Form submitted.')
      console.log('Form submitted successfully:', { value, meta })
      formApi.reset()
      setResetKey((v) => v + 1)
    },

    onSubmitInvalid: () => {
      toast.error('Submission failed.')
    }
  })

  /* ======================
      renderFirstName
  ====================== */

  const renderFirstName = () => {
    return (
      <form.Field
        name='firstName'
        validators={{
          // onDynamicAsyncDebounceMs: 500,
          // onDynamicAsync: ...
          onDynamic: FormSchema.shape.firstName
        }}
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0

          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0
          const isInvalid =
            isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

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

                onBlur: () => {
                  field.handleBlur()
                },

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
        }}
      </form.Field>
    )
  }

  /* ======================
      renderLastName
  ====================== */

  const renderLastName = () => {
    return (
      <form.Field
        name='lastName'
        validators={{
          onDynamic: FormSchema.shape.lastName
        }}
        children={(field) => {
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0

          const errors = field.state.meta.errors
          const isErrors = errors.length > 0

          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty

          const isInvalid =
            isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

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

                onBlur: () => {
                  field.handleBlur()
                },

                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                },

                placeholder: 'Last Name...',
                fieldSize: 'sm'
              }}
              fieldLabelProps={{
                children: 'Last Name',
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
        }}
      />
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <form
      key={resetKey}
      className='bg-card mx-auto max-w-[800px] space-y-6 rounded-lg border p-6 shadow'
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {renderFirstName()}
      {renderLastName()}

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
          // console.log({
          //   canSubmit: param.canSubmit,
          //   isSubmitting: param.isSubmitting,
          //   formErrors: param.formErrors,
          //   fieldErrors: param.fieldErrors,
          //   isFieldErrors: param.isFieldErrors
          // })
          return (
            <Button
              className='flex w-full'
              disabled={!param.canSubmit}
              loading={param.isSubmitting}
              onClick={form.handleSubmit}
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
    </form>
  )
}
