import * as React from 'react'
import { Input } from '../'
import type { FieldRootProps } from '@base-ui/react/field'
// export type Errors = Record<string, string | string[]>;
// type FormErrors = Form.Props['errors']

type Validate = FieldRootProps['validate']

const validateName: Validate = (value, _formValues) => {
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
    return error
  }

  if (!value || value.length < 2) {
    error = 'Must be at least 2 characters'
    return error
  }

  return null // You must return null to indicate no error.
}

/* ======================
      validateFile()
  ====================== */

const validateFile: Validate = (value, _formValues) => {
  let error = ''

  if (value === '') {
    error = 'Required'
    return error
  }

  if (!(value instanceof File)) {
    error = 'Invalid type'
    return error
  }

  // Example check: limit file size to 5MB
  if (value.size > 5 * 1024 * 1024) {
    error = 'File size must be less than 5MB'
    return error
  }

  return null
}

/* ========================================================================

======================================================================== */
// https://github.com/orgs/mui/projects/1/views/4

export const Demo1 = () => {
  const [disabled, _setDisabled] = React.useState(false)

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setDisabled(true)
  //   }, 5000)
  // })

  return (
    <div className='space-y-6'>
      <Input
        // compose={({
        //   FieldRoot,
        //   fieldRootProps,
        //   Input: InputPrimitive,
        //   inputProps,
        //   FieldLabel,
        //   fieldLabelProps,
        //   FieldError,
        //   fieldErrorProps,
        //   FieldDescription,
        //   fieldDescriptionProps
        // }) => {
        //   return (
        //     <FieldRoot {...fieldRootProps}>
        //       <FieldLabel {...fieldLabelProps}></FieldLabel>
        //       <InputPrimitive fieldSize='sm' {...inputProps} />
        //       <FieldDescription {...fieldDescriptionProps} />
        //       <FieldError {...fieldErrorProps} />
        //     </FieldRoot>
        //   )
        // }}
        fieldRootProps={{
          className: (_fieldRootState) => {
            return 'max-w-[600px] mx-auto'
          },

          disabled: disabled,
          // invalid: false,
          // forceValidity: true,
          // style: { border: '2px dashed var(--color-pink-500)' }
          name: 'firstName',
          // touched: true,

          validate: validateName,
          // For standalone implementations outside of <Form />, you
          // probably want to update the to 'onBlur' (or 'onChange').
          validationMode: 'onBlur'
        }}
        inputProps={{
          // style: { border: '2px dashed var(--color-green-500)' }

          // fieldSize: 'sm',
          placeholder: 'First Name...',
          onChange: (_e) => {}
        }}
        fieldLabelProps={{
          children: 'First Name',

          // className: (_fieldRootState) => {
          //   return 'outline outline-dashed outline-pink-500'
          // },
          labelRequired: true
        }}
        fieldErrorProps={{
          className: (_fieldRootState) => {
            return ''
          }
        }}
        fieldDescriptionProps={{
          children: 'This is a description',

          className: (_fieldRootState) => {
            return ''
          }
        }}
      />

      {/* <Input
        fieldRootProps={{
          className: 'max-w-[600px] mx-auto',
          // disabled: true,
          name: 'my-file',
          validate: validateFile,
          validationMode: 'onBlur'
        }}
        inputProps={{
          fieldSize: 'sm',
          type: 'file'
        }}
        fieldLabelProps={{
          children: 'Your File'
        }}
      /> */}
    </div>
  )
}
