import * as React from 'react'
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { TextAreaBase } from './TextAreaBase'

import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'
import type { TextAreaBaseProps } from './TextAreaBase'

import { cn } from '@/utils'

export type InputProps = {
  fieldRootProps?: FieldRootProps
  fieldLabelProps?: FieldLabelProps
  textareaProps?: Omit<TextAreaBaseProps, 'invalid' | 'touched'>
  fieldErrorProps?: FieldErrorProps
  fieldDescriptionProps?: FieldDescriptionProps
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Base UI currently doesn't have a TextArea primitive. However, one can
// still use <textarea> in conjunction with FieldRoot, FieldLabel, etc.
// The important part is hooking into FieldRoot's `data-valid` and `data-invalid`
// attributes through the group-based Tailwind classes (See TextAreaBase.tsx).
//
// Usage:
//
//   <TextArea
//     fieldRootProps={{
//       className: 'max-w-[600px] mx-auto mb-6'
//       // invalid: true
//       // disabled: true
//     }}
//     fieldLabelProps={{
//       children: 'Message',
//       labelRequired: true
//     }}
//     textareaProps={{}}
//     fieldErrorProps={{
//       children: 'This is an error message.'
//     }}
//   />
//
///////////////////////////////////////////////////////////////////////////

export const TextArea = ({
  fieldRootProps = {},
  fieldLabelProps = {},
  textareaProps = {},
  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: InputProps) => {
  const disabled = fieldRootProps.disabled
  const uid = React.useId()
  const id = textareaProps.id || uid
  const invalid = fieldRootProps.invalid

  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <FieldLabel
        {...fieldLabelProps}
        className={(fieldLabelState) => {
          if (typeof fieldLabelProps.className === 'function') {
            fieldLabelProps.className =
              fieldLabelProps.className(fieldLabelState) || ''
          }
          return cn(
            'mb-1 text-sm leading-none font-medium',
            fieldLabelProps.className
          )
        }}
        htmlFor={id}
      />
      <TextAreaBase
        {...textareaProps}
        disabled={
          typeof textareaProps.disabled === 'boolean'
            ? textareaProps.disabled
            : disabled
        }
        id={id}
        invalid={invalid}
      />
      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
