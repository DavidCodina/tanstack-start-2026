import * as React from 'react'
import { toast } from 'sonner'
import { useForm /*, useStore  */ } from '@tanstack/react-form-start'
import { z } from 'zod'
import { Loader2Icon } from 'lucide-react'

import { Input } from '../'
import { Button } from '../../Button'
import { getFieldErrors } from './getFieldErrors'
// import type { FieldRootActions } from '@base-ui/react'
import { DebugForm } from './DebugForm'

import { /*debounce,*/ sleep } from '@/utils'

const FormSchema = z.object({
  // firstName: z.string().min(2, 'First name must be at least 2 characters')

  // firstName: z.string().refine(
  //   async (value) => {
  //     console.log('Validating firstName asynchronously...')
  //     await sleep(1000)
  //     return value.length >= 2
  //   },
  //   {
  //     error: 'First name must be at least 2 characters'
  //   }
  // )

  // ⚠️ Gotcha: When you pass an async function to Zod's .refine(), Zod runs it twice:
  // This is determined specifically by the `async` keyword.
  // Solution: Skip Zod for async validation (Recommended)

  firstName: z.string().superRefine(async (value, ctx) => {
    console.log('Validating firstName asynchronously...')
    await sleep(1000)
    if (value.length < 2) {
      ctx.addIssue({
        code: 'custom',
        error: 'First name must be at least 2 characters'
      })
    }
  })

  // lastName: z.string().refine(
  //   async (value) => {
  //     await sleep(2000)
  //     return value.length >= 2
  //   },
  //   { error: 'Last name must be at least 2 characters' }
  // )
})

// If you only want onSubmitAsync validators and still need debounced
// validation on change, your current approach with the custom debouncedValidate
// function is actually the correct and cleanest solution.

// const _debouncedValidate = debounce(
//   async (field: any) => {
//     await field.validate('submit')
//   },
//   500,
//   { leading: false, cancelOnLeading: false }
// )

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This demo is all about async validation.
// See Ali Alaa at 1:01:00 : https://www.youtube.com/watch?v=H2T21r5wu3g
//
// Initially, I tried using form-level: validators: { onSubmitAsync: FormSchema }
// However, the gotcha there is that field-level field.state.meta.isValidating will
// not work. To fix that, I added custom state in the onBlur:
//
//   setFirstNameValidating(true)
//   await field.validate('submit')
//   setFirstNameValidating(false)
//
// However, I later changed to field-level validators.
// The next issue was that onSubmitAsync doesn't have its own onSubmitAsyncDebounceMs.
// There is a asyncDebounceMs outside of validators, but it doesn't apply to onSubmitAsync.
// Consequently, I had to add my own debouncedValidate(field) inside of the onChange.
//
//   const debouncedValidate = debounce(
//     async (field: any) => {
//       await field.validate('submit')
//     }, 500, { leading: false, cancelOnLeading: false }
//   )
//
// However, there's actually a workaround. We can instead use field-level
// onBlurAsync + onBlurAsyncDebounceMs
//
///////////////////////////////////////////////////////////////////////////

export const AsyncDemo = () => {
  // const actionsRef = React.useRef<FieldRootActions>(null)
  const [resetKey, setResetKey] = React.useState(0)
  //` const [firstNameValidating, setFirstNameValidating] = React.useState(false)

  /* ======================
        useForm()
  ====================== */

  const form = useForm({
    defaultValues: {
      firstName: ''
      // lastName: ''
    },
    validators: {
      //` onSubmitAsync: FormSchema // Always use onSubmit or onSubmitAsync.
    },

    // This only runs when the form validation passes...
    onSubmit: ({ value, formApi: formApi, meta: _meta }) => {
      toast.success('Form submitted.')
      console.log('Form submitted with:', value)
      formApi.reset()
      setResetKey((v) => v + 1)
    },

    onSubmitInvalid: (/* { value, formApi, meta } */) => {
      toast.error('Submission failed.')
      // if (actionsRef.current) { actionsRef.current.validate() }
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
          onBlurAsyncDebounceMs: 1000,
          onBlurAsync: FormSchema.shape.firstName

          // If you have both onBlur and onBlurAsync, onBlurAsync
          // will short-circuit if onBlur returns an error.
          // If you prefer to always have the onBlurAsync run, then
          // pass asyncAlways={true}. This seems to result in the async
          // validation overriding whatever the result of the sync validation was.

          // onBlur: (_field) => {
          //   console.log('Synchronous onBlur validator ran...')
          //   return 'Nope'
          // }
        }}
        // asyncAlways={true}
        // asyncDebounceMs={1000} // Does not apply to onSubmitAsync
      >
        {(field) => {
          const errors = field.state.meta.errors
          const isErrors = errors.length > 0

          // ⚠️ Gotcha: field.state.meta.isValidating only works against field-level Tanstack Form validators.
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
                validating: fieldValidating, //` firstNameValidating,
                // actionsRef: actionsRef,
                name: field.name,
                invalid: isInvalid,
                dirty: isDirty,
                touched: isBlurred
                // style: { outline: fieldValidating ? '2px dashed deeppink' : '' }
              }}
              inputProps={{
                value: field.state.value,

                onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)

                  if (isBlurred || hasSubmitted) {
                    //` debouncedValidate(field)
                    field.validate('blur')
                  }
                },

                //# Forturnately, we can do this in the custom component one time.
                onBlur: /* async */ () => {
                  field.handleBlur()

                  //` setFirstNameValidating(true)
                  //` await field.validate('submit')
                  //` setFirstNameValidating(false)
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
  // In order for Base UI Field to show styles, you have to wrap it in a Form, and
  // call actionsRef.current.validate() or trigger the submit through a button press.
  // Alternatively, you can call actionsRef.current.validate() for each field, or
  // programmatically touch each field. However, I've also hacked FieldError to
  // get this behavior based off of invalid and validating props. Ultimately, we
  // shouldn't need to use <Form />.

  return (
    <form
      // actionsRef={actionsRef}
      key={resetKey}
      className='bg-card relative mx-auto max-w-[800px] space-y-6 rounded-lg border p-6 shadow'
      onSubmit={async (e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <DebugForm className='absolute top-1 right-1' form={form} size='xs' />
      {renderFirstName()}

      <form.Subscribe
        selector={(state) => {
          const fieldErrors = getFieldErrors(state.fieldMeta)

          return {
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,

            formErrors: state.errors,
            fieldErrors: fieldErrors,
            isFieldErrors: !state.isFieldsValid,
            isFieldsValidating: state.isFieldsValidating
            // isValidating: state.isValidating,
            // isFormValidating: state.isFormValidating,
          }
        }}
      >
        {(param) => {
          // console.log({
          //   // canSubmit: param.canSubmit,
          //   // isSubmitting: param.isSubmitting,
          //   // formErrors: param.formErrors,
          //   // fieldErrors: param.fieldErrors,
          //   // isFieldErrors: param.isFieldErrors,
          //   // isFieldsValidating: param.isFieldsValidating
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
