import * as React from 'react'
import { toast } from 'sonner'
import { useForm /* , useStore */ } from '@tanstack/react-form-start'

import { CirclePlus, Trash2 } from 'lucide-react'

import { z } from 'zod'
import { Input } from '../'
import { Button } from '../../Button'
import { DebugForm } from './DebugForm'

const FormSchema = z.object({
  skills: z.array(z.string().min(2, 'Skill must be at least 2 characters'))
})

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This demo is all about dynamic arrays and sub-fields in Tanstack Form.
// https://tanstack.com/form/latest/docs/framework/react/guides/arrays
//
// Dev Leonardo does a good job of explaining this here;
// https://www.youtube.com/watch?v=0IPPHdjvrzk&list=PLOQjd5dsGSxInTKUWTxyqSKwZCjDIUs0Y&index=4
// At 4:00 minutes in he then demonstrates how to do something similar, but with an
// array of objects. I have skipped that for now.
//
// See also Ali Alaa: https://www.youtube.com/watch?v=H2T21r5wu3g
//
///////////////////////////////////////////////////////////////////////////

export const ArraysDemo = () => {
  const [resetKey, setResetKey] = React.useState(0)

  /* ======================
        useForm()
  ====================== */

  const form = useForm({
    defaultValues: {
      skills: [] as string[]
    },

    validators: {},

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
        renderSkills
  ====================== */

  const renderSkills = () => {
    return (
      <form.Field
        name='skills'
        mode='array'
        children={(field) => {
          return (
            <section>
              <div className='mb-2 flex items-center gap-2'>
                <h3 className='flex-1 text-lg font-medium'>Skills</h3>

                <DebugForm form={form} />

                <Button
                  isIcon
                  onClick={() => {
                    field.pushValue('')
                  }}
                  size='sm'
                  title='Add'
                  type='button'
                  variant='success'
                >
                  <CirclePlus />
                  <span className='sr-only'>Add</span>
                </Button>
              </div>

              {field.state.value.length === 0 && (
                <p className='-mt-2 text-center font-medium'>
                  Click Add To Add A Skill
                </p>
              )}

              {field.state.value.map((_item, index) => {
                return (
                  <div key={index} className='mb-4 flex items-center gap-2'>
                    <form.Field
                      name={`skills[${index}]`}
                      validators={{
                        onSubmit: FormSchema.shape.skills.element
                      }}
                      children={(subField) => {
                        // This is where all subField specific logic goes...
                        const submissionAttempts =
                          subField.form.state.submissionAttempts
                        const hasSubmitted = submissionAttempts > 0

                        const errors = subField.state.meta.errors
                        const isErrors = errors.length > 0
                        const isBlurred = subField.state.meta.isBlurred
                        const isDirty = subField.state.meta.isDirty

                        const isInvalid =
                          isBlurred || hasSubmitted
                            ? isErrors
                              ? true
                              : false
                            : undefined

                        return (
                          <Input
                            fieldRootProps={{
                              name: subField.name,
                              invalid: isInvalid,
                              dirty: isDirty,
                              touched: isBlurred,
                              className: 'flex-1'
                            }}
                            inputProps={{
                              value: subField.state.value,

                              onBlur: () => {
                                subField.handleBlur()
                                subField.validate('submit')
                              },

                              onChange: (
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                subField.handleChange(e.target.value)
                                if (isBlurred || hasSubmitted) {
                                  subField.validate('submit')
                                }
                              },

                              placeholder: `Skill ${index + 1}...`,
                              fieldSize: 'sm'
                            }}
                            fieldDescriptionProps={{}}
                            fieldErrorProps={{
                              children: isInvalid
                                ? errors
                                    .filter(Boolean)
                                    .map((error) => {
                                      return typeof error === 'string'
                                        ? error
                                        : error.message
                                    })
                                    .join(', ')
                                : undefined
                            }}
                          />
                        )
                      }}
                    />

                    <Button
                      className='self-start'
                      onClick={() => {
                        field.removeValue(index)
                      }}
                      isIcon
                      size='sm'
                      title='Remove'
                      type='button'
                      variant='destructive'
                    >
                      <Trash2 />
                      <span className='sr-only'>Remove</span>
                    </Button>
                  </div>
                )
              })}
            </section>
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
      {renderSkills()}

      <form.Subscribe
        selector={(state) => {
          return {
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
            formErrors: state.errors,
            isFieldErrors: !state.isFieldsValid,
            isFieldsValidating: state.isFieldsValidating
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
