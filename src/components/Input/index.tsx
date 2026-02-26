import * as React from 'react'
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { InputPrimitive } from './InputPrimitive'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'

import type { InputPrimitiveProps } from './InputPrimitive'
import { cn } from '@/utils'

type Composables = {
  FieldRoot: typeof FieldRoot
  fieldRootProps: FieldRootProps
  Input: typeof InputPrimitive
  inputProps: InputPrimitiveProps
  FieldLabel: typeof FieldLabel
  fieldLabelProps: FieldLabelProps
  FieldError: typeof FieldError
  fieldErrorProps: FieldErrorProps
  FieldDescription: typeof FieldDescription
  fieldDescriptionProps: FieldDescriptionProps
}

type compose = (composables: Composables) => React.JSX.Element

export type InputProps = {
  fieldRootProps?: FieldRootProps
  fieldLabelProps?: FieldLabelProps
  inputProps?: InputPrimitiveProps
  fieldErrorProps?: FieldErrorProps
  fieldDescriptionProps?: FieldDescriptionProps
  compose?: compose
}

/* ========================================================================

======================================================================== */

export const Input = ({
  fieldRootProps = {},
  inputProps = {},
  fieldLabelProps = {},
  fieldErrorProps = {},
  fieldDescriptionProps = {},
  compose
}: InputProps) => {
  /* ======================
          return
  ====================== */
  // The downside with compose, is that you will lose any internal refs,
  // as well as the className function checks.

  if (typeof compose === 'function') {
    return compose({
      FieldRoot,
      fieldRootProps,
      Input: InputPrimitive,
      inputProps,
      FieldLabel,
      fieldLabelProps,
      FieldError,
      fieldErrorProps,
      FieldDescription,
      fieldDescriptionProps
    })
  }

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
      />
      <InputPrimitive {...inputProps} />
      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
