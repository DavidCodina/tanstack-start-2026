import * as React from 'react'
import { toast } from 'sonner'
import { revalidateLogic } from '@tanstack/react-form-start'
import { z } from 'zod'

import { formOptions, useCustomForm } from './utils'
import { LastNameField } from './LastNameField'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This example abstracts first name and last name field logic into their own
// separate components. These components are then registered as fieldComponents
// within createFormHook() in hooks.ts.
//
// Note: In this case, FirstName and LastName are not generally reusable because
// most all of their props are hardcoded internally. However, treating them as
// fieldComponents is still useful because it allows us to reduce the bloat in
// this file by abstracting them away.
//
///////////////////////////////////////////////////////////////////////////

export const FormHooksDemo = () => {
  const [resetKey, setResetKey] = React.useState(0)

  /* ======================
        useCustomForm()
  ====================== */

  const form = useCustomForm({
    // defaultValues: { firstName: '', lastName: ''},
    ...formOptions,

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

    onSubmitInvalid: (/* { value, formApi, meta } */) => {
      toast.error('Submission failed.')
    }
  })

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
      <form.AppField
        name='firstName'
        validators={{
          onDynamic: z
            .string()
            .min(2, 'First name must be at least 2 characters')
        }}
      >
        {(field) => <field.FirstName />}
      </form.AppField>

      {/* Here we can go a step further and abstract away the form.AppField logic:
      
        <form.AppField
          name='lastName'
          validators={{
            onDynamic: z.string().min(2, 'Last name must be at least 2 characters')
          }}
        >{(field) => <field.LastName />}</form.AppField> 

      Instead we can use a LastNameField component with the help of withForm(). */}

      <LastNameField form={form} />

      {/* What is form.AppForm for?
      It provides context to any component that uses const form = useFormContext().
      Without it you'd get this error from the actual component:
      
        formContext` only works when within a `formComponent` passed to `createFormHook` 
        
      I've also seen people wrap the ENTIRE form such that:

      <form.AppForm>
        <form>...</form>
      </form.AppForm>
      
      */}
      <form.AppForm>
        <form.SubmitButton />
      </form.AppForm>
    </form>
  )
}
