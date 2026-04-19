import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'

import { Checkbox } from '../../.'
import type { FormActions } from '@base-ui/react/form'
// import type { ButtonOnClickEvent } from '@/components/Button'
import { Button } from '@/components'
import { randomFail, sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const SingleCheckDemo2 = () => {
  const actionsRef = React.useRef<FormActions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  /* ======================
    handleSubmitOnClick()
  ====================== */

  // const _handleSubmitOnClick = async (_e: ButtonOnClickEvent) => {
  //   setSubmitting(true)

  //   const form = formRef.current
  //   if (!form) return

  //   const formData = new FormData(form)
  //   const termsValue = formData.get('terms') // 'yes' or 'no'

  //   await sleep(1000)

  //   const formErrors: Record<string, string> = {}

  //   if (termsValue === 'no') {
  //     formErrors.terms = 'You must agree to the terms.'
  //   }

  //   const isErrors = Object.keys(formErrors).length > 0

  //   if (actionsRef.current) {
  //     actionsRef.current.validate()
  //   }

  //   if (isErrors) {
  //     setErrors(formErrors)
  //     setSubmitting(false)
  //     toast.error(`Please fix form errors.`)
  //     return
  //   }

  //   toast.success(`Form submitted successfully.`)

  //   setSubmitting(false)
  //   setTimeout(() => {
  //     setResetKey((v) => v + 1)
  //   }, 2000)
  // }

  /* ======================
          return
  ====================== */

  return (
    <>
      <button onClick={(e) => e} type='button'></button>
      <Form
        noValidate
        actionsRef={actionsRef}
        ref={formRef}
        key={resetKey}
        className='bg-card mx-auto w-[250px] space-y-2 rounded-lg border p-2 shadow'
        // onSubmit={(e) => {
        //   e.preventDefault()
        //   e.stopPropagation()
        // }}

        ///////////////////////////////////////////////////////////////////////////
        //
        // onFormSubmit will give the formValues back, but it validates IMMEDIATELY!
        // What we need is a way to wait until submitting has completed. For this,
        // we can call handleSumbit() through onClick, and then trigger
        // actionsRef.current.validate() only AFTER the mock async call has completed.
        // However, if you set the Form's validationMode to 'onBlur', then clicking the
        // checkbox and then clicking the submit will also trigger validation before
        // the submitting completes.
        //
        // The alternative is to implement the useValidationHack() hook.
        //
        ///////////////////////////////////////////////////////////////////////////

        onFormSubmit={async (_formValues, _eventDetails) => {
          setSubmitting(true)
          setErrors({})
          const formErrors: Record<string, string> = {}

          ///////////////////////////////////////////////////////////////////////////
          //
          // Note for a single checkbox (i.e., not CheckboxGroup), formValues will store
          // a boolean representing the checked state. Thus, formValues.terms will always
          // be true | false, and never be 'yes' | 'no' or otherwise... Conversely, when
          // one uses a CheckboxGroup formValues for that group will always be an array of
          // value strings for all checked checkboxes.
          //
          // To get the actual value/uncheckedValue, you have to use FormData.
          //
          ///////////////////////////////////////////////////////////////////////////

          // const currentTarget = eventDetails.event.target as HTMLFormElement
          // const formData = new FormData(currentTarget)
          // const termsValue = formData.get('terms') // 'yes' or 'no'

          await sleep(1000)

          // In practice, it makes no sense to have this check duplicated at the form-level.
          // However, this is just a practice example.
          // if (termsValue === 'no') { formErrors.terms = 'You must agree to the terms.' }
          if (randomFail()) {
            formErrors.terms = 'Random failure'
          }

          const isErrors = Object.keys(formErrors).length > 0

          if (isErrors) {
            setErrors(formErrors)
            setSubmitting(false)
            toast.error(`Please fix form errors.`)
            return
          }

          toast.success(`Form submitted successfully.`)

          setSubmitting(false)
          setTimeout(() => {
            setResetKey((v) => v + 1)
          }, 2000)
        }}
        errors={errors}
      >
        <Checkbox
          fieldRootProps={{
            forceValidity: false,
            validating: submitting,
            // disabled: true,
            // invalid: invalid,
            name: 'terms',

            ///////////////////////////////////////////////////////////////////////////
            //
            // Field-level validation will prevent onFormSubmit from running when invalid.
            // It's also crucial to have field-level validation AFTER submitting. Otherwise,
            // any change made to a field will immediately result in a data-valid state.
            // Conversely, if you have field-level validation, then it will automatically run
            // onChange after submit.
            //
            // So... When using <Form> (i.e., not using Tanstack Form), field-level validators
            // should be on EVERYTHING, and form-level errors should only be used for
            // errors that come back from the server.
            //
            ///////////////////////////////////////////////////////////////////////////

            validate: (value) => {
              if (value === false) {
                return 'You must agree to the terms.'
              }

              return null
            }
          }}
          checkboxRootProps={{
            onCheckedChange: (/* checked, { event } */) => {},
            value: 'yes',
            uncheckedValue: 'no'
          }}
          checkboxIndicatorProps={{}}
          fieldLabelProps={{
            children: 'Agree To Terms',
            labelRequired: true
          }}
          fieldDescriptionProps={{
            children: 'This is required'
          }}
        />

        <Button
          className='flex w-full'
          loading={submitting}
          // onClick={handleSubmitOnClick}
          size='sm'
          // type='button'
          type='submit'
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
    </>
  )
}
