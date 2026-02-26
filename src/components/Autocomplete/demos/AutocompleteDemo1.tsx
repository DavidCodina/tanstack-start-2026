import * as React from 'react'
import { Form } from '@base-ui/react/form'
import { toast } from 'sonner'
import { Autocomplete, AutocompleteItem } from '../.'
import { tags } from './tags'
import type { Tag } from './tags'
import { Button } from '@/components'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const AutocompleteDemo1 = () => {
  const actionsRef = React.useRef<Form.Actions>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  return (
    <Form
      noValidate
      actionsRef={actionsRef}
      ref={formRef}
      key={resetKey}
      className='bg-card mx-auto max-w-[600px] space-y-2 rounded-lg border p-2 shadow'
      onFormSubmit={async (formValues, _eventDetails) => {
        setSubmitting(true)
        setErrors({})
        const formErrors: Record<string, string> = {}

        await sleep(1000)

        if (formValues.tag === 'feature') {
          formErrors.tag = 'Deprecated tag value'
        }

        const isErrors = Object.keys(formErrors).length > 0

        if (isErrors) {
          setErrors(formErrors)
          setSubmitting(false)
          toast.error(`Please fix errors.`)
          return
        }

        toast.success(`Form submitted successfully.`)

        setSubmitting(false)
        setTimeout(() => {
          setResetKey((v) => v + 1)
        }, 4000)
      }}
      errors={errors}
    >
      <Autocomplete
        fieldRootProps={{
          // disabled: false,
          id: 'autocomplete-root-id',
          name: 'tag',
          // validationMode: 'onBlur',
          forceValidity: false,
          validating: submitting,
          validate: (value, _formValues) => {
            if (!value) return 'Required'
            return null
          }
        }}
        fieldLabelProps={{
          children: 'Search Tags',
          labelRequired: true
        }}
        fieldErrorProps={{}}
        fieldDescriptionProps={{
          children: 'Add a tag'
        }}
        autocompleteRootProps={{
          items: tags
        }}
        autocompleteEmptyProps={
          {
            // This shows in the menu when no items ar found matching
            // the input text. Falls back to 'No items found'.
            // children: 'No tags found'
          }
        }
        autocompleteInputProps={{
          fieldSize: 'sm',
          placeholder: 'Search Tags...'
        }}
      >
        {(tag: Tag) => {
          return (
            <AutocompleteItem key={tag.id} value={tag} children={tag.value} />
          )
        }}
      </Autocomplete>

      <Button
        loading={submitting}
        className='flex w-full'
        type='submit'
        size='sm'
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </Button>
    </Form>
  )
}
