import * as React from 'react'
import { toast } from 'sonner'
import { CircleCheckBig } from 'lucide-react'

import { Checkbox } from '../../.'
// import { CheckIcon } from './CheckIcon'
import { Button } from '@/components'
import { useCycle } from '@/hooks'
import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const SingleCheckDemo1 = () => {
  const formRef = React.useRef<HTMLFormElement>(null)

  const [resetKey, setResetKey] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)

  const [indeterminate, setIndeterminate] = React.useState(true)
  const [checkChangedCount, setCheckChangedCount] = React.useState(0)

  const [invalid, cycleInvalid] = useCycle(undefined, true, false)

  /* ======================

  ====================== */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (indeterminate) {
      toast.error('Please check/uncheck the checkbox.')
      return
    }

    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const checkboxValue = formData.get('my-checkbox') // 'yes' or 'no'

    await sleep(1000)
    toast.success(`The value is: ${checkboxValue}`)

    setIndeterminate(true)
    setResetKey((v) => v + 1)
    setSubmitting(false)
  }

  /* ======================

  ====================== */

  React.useEffect(() => {
    const form = formRef.current
    if (!form) return
    const formData = new FormData(form)
    const checkboxValue = formData.get('my-checkbox') // 'yes' or 'no'
    console.log('Checkbox value:', checkboxValue)
  }, [checkChangedCount])

  /* ======================
          return
  ====================== */

  return (
    <>
      <Button
        loading={submitting}
        className='mx-auto mb-4 flex w-[250px]'
        onClick={() => {
          cycleInvalid(undefined)
        }}
        size='sm'
        variant={
          typeof invalid === 'undefined'
            ? 'primary'
            : invalid === true
              ? 'destructive'
              : 'success'
        }
      >
        invalid:{' '}
        {typeof invalid === 'undefined'
          ? 'undefined'
          : invalid === true
            ? 'true'
            : 'false'}
      </Button>

      <form
        noValidate
        key={resetKey}
        className='bg-card mx-auto w-[250px] space-y-2 rounded-lg border p-2 shadow'
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <Checkbox
          fieldRootProps={{
            // validating: true,
            // disabled: true,
            invalid: invalid,
            // The name prop here has precedence and should
            // be preferred over checkboxRootProps.name
            name: 'my-checkbox'
          }}
          fieldLabelProps={{
            children: 'Agree To Terms',
            labelRequired: true
          }}
          checkboxRootProps={{
            indeterminate: indeterminate,
            onCheckedChange: (/* checked, { event } */) => {
              setCheckChangedCount((v) => v + 1)
              ///////////////////////////////////////////////////////////////////////////
              //
              // Getting the uncheckedValue is a little tricky when done from inside
              // onCheckedChange. You need to implement setTimeout to create a macro task.
              // Otherwise, the DOM  will not have updated yet.
              //
              //   const target = event.target as HTMLInputElement
              //   // Note target.value will always be 'yes'
              //   const name = target.name
              //   const form = target.form
              //   if (form) {
              //     setTimeout(() => {
              //       const formData = new FormData(form)
              //       const value = formData.get(name) // 'yes' or 'no'
              //       console.log({ checked, value })
              //     }, 0)
              //   }
              //
              // While this approach works, the better solution is to implement a useEffect.
              //
              ///////////////////////////////////////////////////////////////////////////

              if (indeterminate) {
                setIndeterminate(false)
              }
            },

            value: 'yes',
            uncheckedValue: 'no'
          }}
          checkboxIndicatorProps={{
            // children: <CheckIcon className='w-7/10 text-white' />

            children: <CircleCheckBig size='80%' strokeWidth={2} />
          }}
        />

        <Button
          loading={submitting}
          className='flex w-full'
          type='submit'
          size='sm'
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </>
  )
}
