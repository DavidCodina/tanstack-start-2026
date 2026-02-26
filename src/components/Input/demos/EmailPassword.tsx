import * as React from 'react'
import { toast } from 'sonner'
import { revalidateLogic, useForm } from '@tanstack/react-form-start'
import { z } from 'zod'
import { Loader2Icon } from 'lucide-react'

import { Input } from '../'
import { Button } from '../../Button'
import { getFieldErrors } from './getFieldErrors'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example demonstrates how to implement email/password validation.
// For the email validation it uses both onDynamic and onDynamicAsync checks.
// The onDynamicAsync check simulates a server-side check for email uniqueness.
//
// The confirmPassword check uses onChangeListenTo:['password'] in conjunction
// with the following Zod validation:
//
//   const result = z
//     .string()
//     .min(5, 'The confirmed password must be at least 5 characters')
//     .pipe(z.literal(password, 'The passwords must match'))
//     .safeParse(value)
//
// Note that in this example, I've completely omitted a top-level Schema.
// Instead, I've fully embraced field-level definition and consumption of
// Zod validators. In my opinion, this is the best approach.
//
///////////////////////////////////////////////////////////////////////////

export const EmailPassword = () => {
  const [resetKey, setResetKey] = React.useState(0)

  /* ======================
          useForm()
  ====================== */

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validators: {},
    validationLogic: revalidateLogic({
      mode: 'blur',
      modeAfterSubmission: 'change'
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
        renderEmail
  ====================== */

  const renderEmail = () => {
    return (
      <form.Field
        name='email'
        validators={{
          onDynamic: z.email('Must be a valid email'),
          onDynamicAsyncDebounceMs: 750,
          onDynamicAsync: async ({ value }) => {
            // console.log('Validating email asynchronously...')

            // Simulate an async check on the server for email uniqueness.
            await sleep(1500)
            if (value === 'email_taken@example.com') {
              return 'That email is taken.'
            }
          }
        }}
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0
          const fieldValidating = field.state.meta.isValidating
          // const isSubmitted = field.form.state.isSubmitted

          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0
          const isInvalid =
            isBlurred || hasSubmitted ? (isErrors ? true : false) : undefined

          return (
            <Input
              compose={({
                FieldRoot,
                fieldRootProps,
                Input: InputPrimitive,
                inputProps,
                FieldLabel,
                fieldLabelProps,
                FieldError,
                fieldErrorProps,
                FieldDescription,
                fieldDescriptionProps
              }) => {
                return (
                  <FieldRoot {...fieldRootProps}>
                    <FieldLabel {...fieldLabelProps} />

                    <div className='relative'>
                      {fieldValidating && (
                        <Loader2Icon className='text-primary absolute top-1/2 right-2 -translate-y-1/2 animate-spin' />
                      )}
                      <InputPrimitive {...inputProps} />
                    </div>
                    <FieldDescription {...fieldDescriptionProps} />
                    <FieldError {...fieldErrorProps} />
                  </FieldRoot>
                )
              }}
              fieldRootProps={{
                validating: fieldValidating,
                name: field.name,
                invalid: isInvalid,
                dirty: isDirty,
                touched: isBlurred
              }}
              inputProps={{
                value: field.state.value,

                onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                },

                onBlur: field.handleBlur,

                placeholder: 'Email...',
                fieldSize: 'sm'
              }}
              fieldLabelProps={{
                children: 'Email',
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
      renderPassword
  ====================== */

  const renderPassword = () => {
    return (
      <form.Field
        name='password'
        validators={{
          onDynamic: ({ value }) => {
            const result = z
              .string()
              .min(5, 'The password must be at least 5 characters')
              .safeParse(value)
            if (result.success) return

            return result.error.issues
          }
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

                onBlur: field.handleBlur,

                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                },

                placeholder: 'Password...',
                fieldSize: 'sm'
              }}
              fieldLabelProps={{
                children: 'Password',
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
    renderConrirmPassword
  ====================== */

  const renderConrirmPassword = () => {
    return (
      <form.Field
        name='confirmPassword'
        validators={{
          onChangeListenTo: ['password'],
          onDynamic: ({ value, fieldApi }) => {
            const password = fieldApi.form.getFieldValue('password')

            ///////////////////////////////////////////////////////////////////////////
            //
            // 🤔 Alternative Approaches:
            //
            // While this approach works, it's not the cleanest solution.
            // Notice how we return [result.error.issues[0]] in order to only
            // return one issue at a time. This is  necessary because even when
            // the base validation fails it doesn't to short-circuit the refine().
            //
            //   const result = z
            //     .string()
            //     .min(5, 'The confirmed password must be at least 5 characters')
            //     .refine((value) => value === password, { error: 'The passwords must match' })
            //     .safeParse(value)
            //
            //   if (result.success) return
            //   return [result.error.issues[0]]
            //
            // Zod v3 had a fatal:true configuration option that allowed us to short-circuit the
            // .refine() validation. That was removed in Zod v4, but the behavior still exists in
            // the abort flag.
            //
            //   const result = z
            //     .string()
            //     .min(5, {
            //       abort: true,
            //       error: 'The confirmed password must be at least 5 characters'
            //     })
            //     .refine((value) => value === password, 'The passwords must match')
            //     .safeParse(value)
            //
            // In any case, the following approach is still cleaner. The .min() is still important
            // here to ensure that '' does not give us passing validation when the password is also ''.
            //
            ///////////////////////////////////////////////////////////////////////////

            const result = z
              .string()
              .min(5, 'The confirmed password must be at least 5 characters')
              // ⚠️ Why do we need .pipe() here? Because...
              // Property 'literal' does not exist on type 'ZodString'.
              .pipe(z.literal(password, 'The passwords must match'))
              .safeParse(value)

            if (result.success) return
            return result.error.issues
          }
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
                onBlur: field.handleBlur,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                },

                placeholder: 'Confirm Password...',
                fieldSize: 'sm'
              }}
              fieldLabelProps={{
                children: 'Confirm Password',
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
      {renderEmail()}
      {renderPassword()}
      {renderConrirmPassword()}

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
