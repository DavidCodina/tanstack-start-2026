import React, { useState } from 'react'
import { toast /* useSonner */ } from 'sonner'

import { Button } from '../../Button'

import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator
} from './.'
import type { SelectValueType } from './.'

import { sleep } from '@/utils'

/* ========================================================================

======================================================================== */

export const ControlledSelectDemo = () => {
  // The key hack is not necessary since this form is fully controlled,
  // and can therefore be reset through resetting state.
  // const [formKey, setFormKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectValue, setSelectValue] = useState<SelectValueType>('')
  const [selectError, setSelectError] = useState('')
  const [selectTouched, setSelectTouched] = useState(false)

  /* ======================
      validateSelect()
  ====================== */

  const validateSelect = (value?: SelectValueType) => {
    value = typeof value === 'string' ? value : selectValue
    let error = ''

    if (typeof value !== 'string') {
      error = 'Invalid type'
      setSelectError(error)
      return error
    }

    if (!value || value.length === 0) {
      error = 'Required'
      setSelectError(error)
      return error
    }

    setSelectError('')
    return ''
  }

  /* ======================
        validate()
  ====================== */

  const validate = () => {
    const errors: string[] = []

    // Set true on all toucher functions.
    const touchers: React.Dispatch<React.SetStateAction<boolean>>[] = [
      setSelectTouched
    ]

    touchers.forEach((toucher) => {
      toucher(true)
    })

    const validators: (() => string)[] = [validateSelect]

    validators.forEach((validator) => {
      const error = validator()
      if (error) {
        errors.push(error)
      }
    })

    // Return early if errors
    if (errors.length >= 1) {
      return { isValid: false, errors: errors }
    }

    return { isValid: true, errors: null }
  }

  /* ======================
      handleSubmit()()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // Trying to get values and/or reset values through refs is extremely tedious.
  // The fact is that Radix primitives just don't seem to be designed to be
  // consumed in this way. Initially, I really tried to get each value through
  // refs. The breaking point was the Slider component. The only place to find
  // the value(s) is by drilling into the DOM to find each input. It's just
  // way too complicated. If you try to access inner input elements through refs
  // to force a reset, you're essentially fighting against the component's
  // encapsulated state. The Select doesn't even have a <select> in it! In contrast,
  // Checkbox includes a native <input type="checkbox" />, which can sometimes
  // be easier to manipulate directly, but even then, the synchronization between
  // the DOM's native state and the rendered state in the Radix component isn't guaranteed.
  //
  //
  // A better solution is to simply track all the values in local state.
  // And if you're doing that, then your halfway to a controlled implementation,
  // which is probably the easiest way to go because it doesn't entail hacks to
  // reset the form, etc.
  //
  ///////////////////////////////////////////////////////////////////////////

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { isValid } = validate()

    if (!isValid) {
      toast.error('Unable to submit the form!')
      return
    }

    setIsSubmitting(true)

    const requestData = {
      selectValue
    }

    try {
      // Make API request, etc.
      await sleep(1500)
      console.log('requestData:', requestData)
      toast.success('Form validation success!')

      // setFormKey((prev) => prev + 1)
      setIsSubmitting(false)

      setSelectValue('')
      setSelectError('')
      setSelectTouched(false)
    } catch (err) {
      console.log(err)
      toast.error('Unable to submit the form!')
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // Trying to reset the form fields through refs gets tricky.
    // This is what I had to do for the first few inputs:
    //
    //   if (firstNameRef.current) firstNameRef.current.value = ''
    //   if (lastNameRef.current) lastNameRef.current.value = ''
    //   if (singleCheckRef.current) {
    //     const isChecked =
    //       singleCheckRef.current.getAttribute('data-state') === 'checked' ? true : false
    //     if (isChecked) { singleCheckRef.current.click() }
    //   }
    //
    // However, it would get even more complex with CheckboxGroup and RadioGroup.
    // The best solution is probably just to remount the form. One way to reset the
    // from would be to call setShowForm(false),then reset it here with:
    // useLayoutEffect(() => { if (!showForm) { setShowForm(true) } }, [showForm])
    // A cleaner solution is to use a key prop.
    //
    ///////////////////////////////////////////////////////////////////////////
  }

  /* ======================
        renderSelect()
  ====================== */

  const renderSelect = () => {
    return (
      <Select
        // disabled
        error={selectError}
        // errorClassName='font-bold text-right'
        // className='outline-2 outline-pink-500 outline-dashed' // Assigned to SelectTrigger

        // groupClassName='outline-2 outline-pink-500 outline-dashed'
        // groupStyle={{ outline: '2px dashed deeppink' }}
        id='snack'
        label='Select One'
        // labelClassName='font-bold'

        onBlur={(value) => {
          if (!selectTouched) {
            setSelectTouched(true)
          }
          validateSelect(value)
        }}
        onChange={(value) => {
          setSelectValue(value)

          if (selectTouched) {
            validateSelect(value)
          }
        }}
        // placeholder={
        //   <span className='rounded-full bg-blue-100 px-2'>Select Fruit...</span>
        // }

        // sideOffset={20}
        // style={{ outline: '2px dashed deeppink' }}  // Assigned to SelectTrigger

        touched={selectTouched}
        value={selectValue}
      >
        <SelectGroup>
          <SelectLabel>Fruit</SelectLabel>
          <SelectItem value='apple'>Apple</SelectItem>
          <SelectItem value='banana'>Banana</SelectItem>
          <SelectItem value='cherry'>Cherry</SelectItem>
        </SelectGroup>

        <SelectSeparator />

        <SelectGroup>
          <SelectLabel>Veggie</SelectLabel>
          <SelectItem value='carrot'>Carrot</SelectItem>
          <SelectItem value='broccoli'>Broccoli</SelectItem>
          <SelectItem value='spinach'>Spinach</SelectItem>
        </SelectGroup>
      </Select>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <form
        className='bg-card mx-auto max-w-[800px] space-y-6 rounded-xl border p-6 shadow'
        // key={formKey}
        onSubmit={(e) => {
          e.preventDefault()
        }}
        noValidate
      >
        {renderSelect()}

        <Button
          loading={isSubmitting}
          className='flex w-full'
          type='button'
          variant='success'
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </>
  )
}
