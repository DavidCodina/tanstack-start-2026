import * as React from 'react'
import { toast } from 'sonner'
import { useForm /* , useSelector */ } from '@tanstack/react-form-start'
import { z } from 'zod'
// import { Loader2Icon } from 'lucide-react'

import { Input } from '../.'
import { Button } from '../../Button'
// import type { AnyFieldApi } from '@tanstack/react-form-start'

import {
  // debounce,
  // sleep,
  tanstackFormGetFieldErrors
} from '@/utils'

const FormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters')
  // email: z.email()
})

const defaultValues: z.infer<typeof FormSchema> = {
  firstName: ''
  // email: ''
}

/* ========================================================================

======================================================================== */

export const Playground = () => {
  const [resetKey, setResetKey] = React.useState(0)
  // ❌ const [emailValidating, setEmailValidating] = React.useState(false)

  /* ======================
        useForm()
  ====================== */

  const form = useForm({
    defaultValues: defaultValues,

    // This only runs when the form validation passes...
    onSubmit: (param) => {
      const { value, formApi, meta } = param
      if (
        meta &&
        typeof meta === 'object' &&
        'toast' in meta &&
        meta.toast === true
      ) {
        toast.success('Form submitted.')
      }

      if (
        meta &&
        typeof meta === 'object' &&
        'log' in meta &&
        meta.log === true
      ) {
        console.log('Form submitted successfully:', { value, meta })
      }

      formApi.reset()
      setResetKey((v) => v + 1)
    },

    onSubmitInvalid: (/* { value, formApi, meta } */) => {
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
          onBlur: (param) => {
            const { value } = param

            const result = FormSchema.shape.firstName.safeParse(value)
            if (result.success) return
            return result.error.issues
          }
        }}
        // I don't get why I would need listeners in the first place. The normal onChange seems to work fine.
        listeners={{
          onChange: (_field) => {
            // console.log('onChange listener ran...')
          }
        }}
      >
        {(field) => {
          // const isPristine = field.form.state.isPristine

          // const isSubmitting = field.form.state.isSubmitting
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0
          // const isValid = field.state.meta.isValid
          // const isTouched = field.state.meta.isTouched
          // const isValidating = field.form.state.isValidating

          // ⚠️ Gotcha: field.state.meta.isValidating only works against field-level Tanstack Form validators.
          // const fieldValidating = field.state.meta.isValidating
          // const isSubmitted = field.form.state.isSubmitted

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

                onBlur: field.handleBlur,

                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('blur')
                  }
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

      {/* {renderEmail()} */}

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
          // console.log({
          //   // canSubmit: param.canSubmit,
          //   // isSubmitting: param.isSubmitting,
          //   // formErrors: param.formErrors,
          //   // fieldErrors: param.fieldErrors
          //   // isFieldErrors: param.isFieldErrors
          // })

          return (
            <Button
              className='flex w-full'
              disabled={!param.canSubmit}
              loading={param.isSubmitting}
              onClick={() => {
                // When calling handleSubmit() we can pass an object with anything in it.
                // Technically, submitMeta can be anything.
                // This then shows up as meta in the onSubmit:
                // onSubmit: ({ value, formApi: formApi, meta }) => { ... }
                const submitMeta = { log: true, toast: false }
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
    </form>
  )
}
