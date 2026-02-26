import * as React from 'react'
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group'
import { FieldDescription, FieldError, FieldRoot } from '../Field'
import { CheckboxGroupLabel } from './CheckboxGroupLabel'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldRootProps
} from '../Field'
import type { CheckboxGroupLabelProps } from './CheckboxGroupLabel'
import type { CheckboxGroupProps as _CheckboxGroupProps } from '@base-ui/react/checkbox-group'
import { cn } from '@/utils'

export type CheckboxGroupProps = {
  /** Pass children directly for convenience, or use checkboxGroupProps.children. */
  children?: React.ReactNode
  fieldRootProps?: FieldRootProps
  checkboxGroupLabelProps?: CheckboxGroupLabelProps
  checkboxGroupProps?: _CheckboxGroupProps
  fieldDescriptionProps?: FieldDescriptionProps
  fieldErrorProps?: FieldErrorProps
}

/* ========================================================================

======================================================================== */
// The documentation examples sometimes show using <Fieldset.Root render={<CheckboxGroup />}>.
// However, that implementation overcomplicates things. Moreover, the className function check
// that is being used here causes a hydation mismatch when used in the render prop.

export const CheckboxGroup = ({
  children,
  fieldRootProps = {},
  checkboxGroupLabelProps = {},
  checkboxGroupProps = {},
  fieldDescriptionProps = {},
  fieldErrorProps = {}
}: CheckboxGroupProps) => {
  const id = React.useId()

  ///////////////////////////////////////////////////////////////////////////
  //
  // For convenience, children can be passed in as a top-level prop or
  // through checkboxGroupProps.children. However, I've inentionally
  // omitted the ability to allow the consumer to pass in an array of
  // data-driven objects.
  //
  ///////////////////////////////////////////////////////////////////////////
  children = children || checkboxGroupProps.children

  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <CheckboxGroupLabel {...checkboxGroupLabelProps} id={id} />

      <CheckboxGroupPrimitive
        {...checkboxGroupProps}
        aria-labelledby={id}
        data-slot='checkbox-group'
        className={(checkboxGroupState) => {
          if (typeof checkboxGroupProps.className === 'function') {
            checkboxGroupProps.className =
              checkboxGroupProps.className(checkboxGroupState) || ''
          }
          return cn('space-y-1', checkboxGroupProps.className)
        }}
      >
        {children}
        <FieldDescription {...fieldDescriptionProps} />
        <FieldError {...fieldErrorProps} />
      </CheckboxGroupPrimitive>
    </FieldRoot>
  )
}
