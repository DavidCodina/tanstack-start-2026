import * as React from 'react'
import { toast } from 'sonner'
import { useForm /* , useSelector */ } from '@tanstack/react-form-start'
import { z } from 'zod'
import { Loader2Icon } from 'lucide-react'

import { Input } from '../.'
import { Button } from '../../Button'
import type { AnyFieldApi } from '@tanstack/react-form-start'

import { debounce, sleep, tanstackFormGetFieldErrors } from '@/utils'

const EmailSchema = z.email().refine(
  async (value) => {
    // const now = new Date()
    // const time =
    //   now.toLocaleTimeString('en-US', {
    //     hour12: true,
    //     hour: 'numeric',
    //     minute: '2-digit',
    //     second: '2-digit'
    //   }) +
    //   '.' +
    //   now.getMilliseconds().toString().padStart(3, '0')
    // console.log(`Validating email asynchronously... ${time}`)
    await sleep(2000)
    return value !== 'david@example.com'
  },
  {
    error: "You can't use that email."
  }
)

// .superRefine(async (value, ctx) => {
//   const now = new Date()
//   const time =
//     now.toLocaleTimeString('en-US', {
//       hour12: true,
//       hour: 'numeric',
//       minute: '2-digit',
//       second: '2-digit'
//     }) +
//     '.' +
//     now.getMilliseconds().toString().padStart(3, '0')
//   console.log(`Validating email asynchronously... ${time}`)
//   await sleep(1500)
//   if (value === 'david@example.com') {
//     ctx.addIssue({
//       code: 'custom',
//       error: "You can't use that email!!!"
//     })
//   }
// })

const FormSchema = z.object({
  firstName: z
    .string()
    .min(1, { error: 'A name is required' })
    .max(100, { error: 'Name must be 100 characters or fewer' }),
  email: EmailSchema
})

const defaultValues: z.infer<typeof FormSchema> = {
  firstName: '',
  email: ''
}

const debouncedValidateOnBlur = debounce(
  async (field: AnyFieldApi) => {
    await field.validate('blur')
  },
  500,
  { leading: false, cancelOnLeading: false }
)

/* ========================================================================

======================================================================== */

export const AsyncDemo2 = () => {
  const [resetKey, setResetKey] = React.useState(0)
  // ❌ const [emailValidating, setEmailValidating] = React.useState(false)

  /* ======================
        useForm()
  ====================== */

  const form = useForm({
    defaultValues: defaultValues,

    // This only runs when the form validation passes...
    onSubmit: (param) => {
      const { value, formApi /* , meta  */ } = param
      console.log('Form submitted successfully:', value)

      formApi.reset()
      setResetKey((v) => v + 1)
    },

    onSubmitInvalid: (/* { value, formApi, meta } */) => {
      toast.error('Submission failed.')
    }
  })

  // const emailErrors = useSelector(form.store, (state) => state.fieldMeta.email?.errors)
  // console.log('Email errors:', emailErrors)

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
      renderEmail()
  ====================== */

  const renderEmail = () => {
    return (
      <form.Field
        name='email'
        validators={{
          // If you have both onBlur and onBlurAsync, onBlurAsync
          // will short-circuit if onBlur returns an error.
          // If you prefer to always have the onBlurAsync run, then
          // pass asyncAlways={true}. This seems to result in the async
          // validation overriding whatever the result of the sync validation was.
          onBlur: z.email(),

          ///////////////////////////////////////////////////////////////////////////
          //
          // ⚠️ Gotcha: This will debounce the entire onBlurAsync function.
          // However, the MOMENT field.validate('blur') is called, it
          // clears the errors. This causes problems because we now have
          // an input that thinks it might be valid. A better solution is to
          // not use this debounce at all. Instead have a debounce directly
          // within the onChange handler that calls field.validate('blur').
          //
          ///////////////////////////////////////////////////////////////////////////
          // ❌ onBlurAsyncDebounceMs: 1000,

          ///////////////////////////////////////////////////////////////////////////
          //
          // Zod's async refine / superRefine called twice when used with
          // TanStack Form's onSubmitAsync validator
          // https://github.com/TanStack/form/issues/1431
          //
          //   ❌ onBlurAsync: FormSchema.shape.email
          //
          // Why: TanStack Form's Standard Schema adapter seems to call into the schema's
          // validation path more than once internally when the schema itself resolves
          // asynchronously (as superRefine/refine with an async callback does).
          //
          // The workaround that's been reported to fix it: don't hand the raw Zod schema (or .shape.email)
          // straight to the validator prop. Instead, wrap it in your own async function and call
          // safeParseAsync yourself.
          //
          ///////////////////////////////////////////////////////////////////////////
          onBlurAsync: async (param) => {
            const { fieldApi, value } = param
            // console.log('onBlurAsync called...')

            // ❌ setEmailValidating(true)
            fieldApi.setMeta((prev) => ({
              ...prev,
              isValidating: true
            }))

            try {
              const result = await FormSchema.shape.email.safeParseAsync(value)
              if (result.success) return
              return result.error.issues
            } finally {
              fieldApi.setMeta((prev) => ({
                ...prev,
                isValidating: false
              }))
              // ❌ setEmailValidating(false)
            }
          }
        }}
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0

          // ⚠️ Gotcha: field.state.meta.isValidating only works against field-level Tanstack Form validators.
          // Moreover, it's not triggered when manually calling field.validate('blur') from within onChange.
          const fieldValidating = field.state.meta.isValidating
          const isBlurred = field.state.meta.isBlurred
          const isDirty = field.state.meta.isDirty
          const submissionAttempts = field.form.state.submissionAttempts
          const hasSubmitted = submissionAttempts > 0
          const isInvalid = fieldValidating
            ? undefined
            : isBlurred || hasSubmitted
              ? isErrors
                ? true
                : false
              : undefined

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
                // actionsRef: actionsRef,
                name: field.name,
                invalid: isInvalid,
                dirty: isDirty,
                touched: isBlurred
                // style: {
                //   outline: fieldValidating ? '2px dashed deeppink' : ''
                // }
              }}
              inputProps={{
                value: field.state.value,

                onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)

                  if (isBlurred || hasSubmitted) {
                    ///////////////////////////////////////////////////////////////////////////
                    //
                    // ⚠️ Gotcha: field.state.meta.isValidating won't update when calling field.validate('blur')
                    //
                    // What's actually happening: field.handleBlur() triggers validation for the 'blur' cause
                    // — that's the natural, first-class path, so isValidating tracks it correctly.
                    //
                    // But field.validate('blur') again on does not. In practice, once you're re-triggering
                    // the 'blur' cause from onChange, the internal bookkeeping for "is this cause currently
                    // validating" doesn't reliably re-arm — so subsequent calls run the async function fine
                    // (your fix works, the validator's still doing its job), but the isValidating flag doesn't
                    // reflect it.
                    //
                    // One solution would entail custom emailValidating state. However, the issue there is that
                    // state.isFieldsValidating will no longer be in sync. The actual solution is to manualy set
                    // isValidating on the field. This is done from within the onBlurAsync function.
                    //
                    //   fieldApi.setMeta((prev) => ({...prev, isValidating: true }))
                    //
                    ///////////////////////////////////////////////////////////////////////////

                    // ❌ field.validate('blur')
                    debouncedValidateOnBlur(field)
                  }
                },

                onBlur: () => {
                  // Since we're already using onChange once we've blurred, then no need for this
                  // after we've blurred
                  if (isBlurred || hasSubmitted) return
                  field.handleBlur()
                },

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

      {renderEmail()}

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
                form.handleSubmit()
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
