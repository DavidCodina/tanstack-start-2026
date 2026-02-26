'use client'

import * as React from 'react'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { FieldDescription, FieldError, FieldRoot } from '../Field'
import { RadioGroupLabel } from './RadioGroupLabel'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldRootProps
} from '../Field'
import type { RadioGroupLabelProps } from './RadioGroupLabel'
import { cn } from '@/utils'

export type RadioGroupProps = {
  /** Pass children directly for convenience, or use radioGroupProps.children. */
  children?: React.ReactNode
  fieldRootProps?: FieldRootProps
  radioGroupLabelProps?: RadioGroupLabelProps
  radioGroupProps?: RadioGroupPrimitive.Props
  fieldDescriptionProps?: FieldDescriptionProps
  fieldErrorProps?: FieldErrorProps
}

/* ========================================================================

======================================================================== */

export const RadioGroup = ({
  children,
  fieldRootProps = {},
  radioGroupLabelProps = {},
  radioGroupProps = {},
  fieldDescriptionProps = {},
  fieldErrorProps = {}
}: RadioGroupProps) => {
  const id = React.useId()

  children = children || radioGroupProps.children

  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <RadioGroupLabel {...radioGroupLabelProps} id={id} />

      <RadioGroupPrimitive
        {...radioGroupProps}
        aria-labelledby={id}
        data-slot='radio-group'
        className={(radioGroupState) => {
          if (typeof radioGroupProps.className === 'function') {
            radioGroupProps.className =
              radioGroupProps.className(radioGroupState) || ''
          }
          return cn('space-y-1', radioGroupProps.className)
        }}
      >
        {children}
        <FieldDescription {...fieldDescriptionProps} />
        <FieldError {...fieldErrorProps} />
      </RadioGroupPrimitive>
    </FieldRoot>
  )
}
