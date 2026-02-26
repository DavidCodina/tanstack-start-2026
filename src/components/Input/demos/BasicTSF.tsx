import * as React from 'react'
// ❌ import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { useForm /* , useStore */ } from '@tanstack/react-form-start'
import { z } from 'zod'
import { Input } from '../.'
import { Button } from '../../Button'

import { getFieldErrors } from './getFieldErrors'

const AddressSchema = z.object({
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters')
})

const FormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  // I'm not a huge fan of using objects. I think validation should be flat.
  address: AddressSchema
})

const defaultValues: z.infer<typeof FormSchema> = {
  firstName: '',
  lastName: '',
  address: {
    city: '',
    state: ''
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is an example of a basic Tanstack Form setup.
// In practice, I would not generally recommend using a top-level FormSchema,
// even if it's consumed piecemeal by field-level validators. That said, in
// this case it kind of makes sense since we're using an address object.
//
///////////////////////////////////////////////////////////////////////////

export const BasicTSF = () => {
  const [resetKey, setResetKey] = React.useState(0)

  /* ======================
        useForm()
  ====================== */

  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      ///////////////////////////////////////////////////////////////////////////
      //
      // Use only form-level or only field-level validation.
      // Prefer field-level validation.
      //
      // onBlur: FormSchema
      //
      // ✅ See Ali Alaa at 57:00 for manual validator creation.
      // https://www.youtube.com/watch?v=H2T21r5wu3g
      //
      ///////////////////////////////////////////////////////////////////////////
    },

    // This only runs when the form validation passes...
    onSubmit: ({ value, formApi: formApi, meta }) => {
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

    // https://tanstack.com/form/latest/docs/framework/react/guides/submission-handling
    // You may have multiple types of submission behaviour, for example, going back
    // to the previous page or staying on the form. You can accomplish this by
    // specifying the onSubmitMeta property. This meta data will be passed to the onSubmit function.
    // onSubmitMeta: () => {
    //   return {
    //     submittedAt: new Date().toISOString(),
    //     userAgent: navigator.userAgent
    //     // Return the meta object you want to set
    //   }
    //}
  })

  // const values = useStore(form.store, (state) => state.values)
  // console.log('values:', values)

  // const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  // const errors = useStore(form.store, (state) => state.errors)
  // console.log('Top-level errors:', errors)

  /* ======================
      renderFirstName
  ====================== */

  const renderFirstName = () => {
    return (
      <form.Field
        name='firstName'
        validators={{
          ///////////////////////////////////////////////////////////////////////////
          //
          // Initially, I was of the opinion that you should always use onSubmit/onSubmitAsync + field.validate('submit')
          // - either at the form-level or at the field-level. However, I'm now of the opinion that
          // you should use onBlur/onBlurAsync + field.validate('blur'). Why? Because then you can simplify
          //
          //   onBlur: () => {
          //     field.handleBlur()
          //     field.validate('submit')
          //   }
          //
          // To just:
          //
          //   onBlur: field.handleBlur
          //
          // Also, using onBlurAsync allows you to also use onBlurAsyncDebounceMs.
          // That said, it's also extremely practical to use onDynamic/onDynamicAsync.
          //
          ///////////////////////////////////////////////////////////////////////////

          // onBlur: FormSchema.shape.firstName
          // onBlur: z.string().min(2, 'First name must be at least 2 characters!')

          // This more manual syntax likely becomes important when validating linked fields
          // in conjunction with onChangeListenTo. In the case of password validation, it
          // probably make the most sense to define the field-level schema direclty in the
          // validator.

          onBlur: ({ value }) => {
            // const result = FormSchema.shape.firstName.safeParse(value)
            const result = z
              .string()
              .min(2, 'First name must be at least 2 characters.')
              .safeParse(value)
            if (result.success) return
            // Convert Zod errors to StandardSchemaV1Issue format
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

          //# One can also do this: field.getMeta().isBlurred
          //# So... What's the difference?
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
                ///////////////////////////////////////////////////////////////////////////
                //
                // The annoying thing about Base UI is that it doesn't expose
                // a way to clear the field of it's data-attributes.
                // invalid doesn't respect undefined.
                // One MUST implement key={resetKey} on <form> / <Form> to
                // consistently clear the field of it's data-attributes.
                //
                ///////////////////////////////////////////////////////////////////////////
                invalid: isInvalid,

                dirty: isDirty,
                // touched in Tanstack Form is as soon as you type a single character,
                // but what we want is when the input blurs.
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
      renderLastName
  ====================== */

  const renderLastName = () => {
    return (
      <form.Field
        name='lastName'
        validators={{
          onBlur: FormSchema.shape.lastName
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

                onBlur: field.handleBlur,

                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('submit')
                  }
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
        renderCity()
  ====================== */

  const renderCity = () => {
    return (
      <form.Field
        name='address.city'
        validators={{
          onBlur: FormSchema.shape.address.shape.city
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

                onBlur: field.handleBlur,

                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('submit')
                  }
                },

                placeholder: 'City...',
                fieldSize: 'sm'
              }}
              fieldLabelProps={{
                children: 'City',
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
      renderState
  ====================== */

  const renderState = () => {
    return (
      <form.Field
        name='address.state'
        validators={{
          onBlur: FormSchema.shape.address.shape.state
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
                  field.validate('submit')
                },

                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  field.handleChange(e.target.value)
                  if (isBlurred || hasSubmitted) {
                    field.validate('submit')
                  }
                },

                placeholder: 'State...',
                fieldSize: 'sm'
              }}
              fieldLabelProps={{
                children: 'State',
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
  // In order for Base UI Field to show styles, you have to wrap it in a Form, and
  // call actionsRef.current.validate() or trigger the submit through a button press.
  // Alternatively, you can call actionsRef.current.validate() for each field, or
  // programmatically touch each field. However, I've also hacked FieldError to
  // get this behavior based off of invalid and validating props. Ultimately, we
  // shouldn't need to use <Form />.

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

      {renderCity()}

      {renderState()}

      {/* One could also get isSubmitting by doing this:
      const isSubmitting = useStore(form.store, (state) => state.isSubmitting) 
      form.Subscribe is essentially just a wrapper around useStore. However, by 
      implementing form.Subscribe, we're encapsulating the subscription, which 
      means we won't actually be rerendering the part outside of the form.Subscribe. */}

      <form.Subscribe
        ///////////////////////////////////////////////////////////////////////////
        //
        // ⚠️ Gotcha: If you only use form-level validation, then even when you call
        // field.validate('submit') at the field-level, the full form-level validation
        // will run. This is confirmed by:
        //
        //   - Can Dev here at 16:05: https://www.youtube.com/watch?v=00AtvK_AqUM
        //   - Ali Alaa at 1:23:25: https://www.youtube.com/watch?v=H2T21r5wu3g
        //
        // This is not necessarily problematic, but it's important to be
        // aware of. The general solution is to allow this, but mange your
        // error UI with other state like touched.
        //
        // However, if you truly don't want this to happen, then you can instead
        // use field-level validation. As a general rule, ONLY use form-level OR
        // field-level validation.
        //
        // It's important to understand that selector's state.errors here is ONLY for
        // form-level errors. Thus, any errors that occur from field-level validators
        // are not included in state.errors.
        //
        // Moreover, when a field-level validator fails, it prevents the form submission,
        // so the form-level validator never runs, which is why state.errors can be empty
        // even when you see form errors in the UI after submitting. This is still true,
        // even when you're using field.validate('submit') at the field-level.
        //
        // In order to not complicate things, you should either accept that full form-level
        // validation will run even when you call field.validate('submit') at the field-level.
        // Alternatively, you can use ONLY field-level validation, and then do this:
        //
        ///////////////////////////////////////////////////////////////////////////

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
