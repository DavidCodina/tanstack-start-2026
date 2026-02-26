import * as React from 'react'
// import { Form } from '@base-ui/react/form'
import { createFormHook, useStore } from '@tanstack/react-form-start'

import { z } from 'zod'
import {
  SubmitButton,
  TanStackInput,
  fieldContext,
  formContext
} from './FormComponents'

const { useAppForm: useBaseUIForm } = createFormHook({
  fieldComponents: {
    TanStackInput
  },
  formComponents: {
    SubmitButton
  },
  fieldContext,
  formContext
})

const FormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters')
})

/* ========================================================================

======================================================================== */

export const Demo6 = () => {
  const form = useBaseUIForm({
    defaultValues: {
      firstName: ''
    },
    validators: {
      onBlur: FormSchema
    },
    onSubmit: (parameter) => {
      const { value, formApi: _formApi } = parameter
      console.log('Form submitted with:', value)
    }
  })

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: Accessing form.state.submissionAttempts & form.state.isSubmitSuccessful directly
  // will not listen to changes. When you do const { state } = form, you're getting a snapshot
  // of the state at that moment. It won't automatically re-render when the state changes.
  // useStore creates a subscription that causes your component to re-render whenever the selected
  // state changes, similar to how you're already using it for field errors
  //
  ///////////////////////////////////////////////////////////////////////////

  const isSubmitSuccessful = useStore(
    form.store,
    (state) => state.isSubmitSuccessful
  )
  const submissionAttempts = useStore(
    form.store,
    (state) => state.submissionAttempts
  )

  /* ======================
        useEffect()
  ====================== */

  const formReset = React.useEffectEvent(form.reset)

  React.useEffect(() => {
    if (submissionAttempts === 0) return
    if (isSubmitSuccessful) formReset()
  }, [isSubmitSuccessful, submissionAttempts])

  /* ======================
          return
  ====================== */

  return (
    <form
      className='bg-card mx-auto max-w-[800px] space-y-6 rounded-lg border p-6 shadow'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.AppField
        name='firstName'
        // While you can pass in validators at the field-level,
        // I don't do that. Instead, prefer to do it at the form-level.
        // Moreover the actual component integration already runs onChange
        // once touched. Note also that since we're already using onBlur
        // at the form-level, onChange errors would likely produce rendundancies.

        // validators={{
        //   // PedroTech demos this at 25:00 of https://www.youtube.com/watch?v=DxotbweeJqQ
        //   // onChangeListenTo: [],
        //   onChange: (parameter) => {
        //     const { value, fieldApi: _fieldApi } = parameter
        //     if (value === 'David') return 'That name is for dopenheimers'
        //     // In Base UI, you must return null for valid values.
        //     // In Tanstack Form, you return undefined.
        //     return
        //   }
        // }}
      >
        {(field) => {
          return (
            <field.TanStackInput
              fieldRootProps={
                {
                  // disabled: true
                }
              }
              inputProps={{
                placeholder: 'First Name...',
                fieldSize: 'sm',
                onChange: (e) => {
                  const target = e.target as HTMLInputElement
                  console.log('\n\nVALUE:', target.value)
                }
              }}
              fieldLabelProps={{
                children: 'First Name',
                // render: <span />,

                labelRequired: true
              }}
              fieldDescriptionProps={{
                children: 'This is a description'
              }}
            />
          )
        }}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton className='flex w-full' size='sm' variant='success'>
          Submit
        </form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
