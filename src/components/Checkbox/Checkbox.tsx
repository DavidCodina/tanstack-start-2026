import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { CheckboxIndicator } from './CheckboxIndicator'
import { CheckboxRoot } from './CheckboxRoot'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'

import type { CheckboxRootProps } from './CheckboxRoot'
import type { CheckboxIndicatorProps } from './CheckboxIndicator'
import { cn } from '@/utils'

export type CheckboxProps = {
  fieldRootProps?: FieldRootProps
  /** The name prop is omitted to encourage using fieldRootProps.name instead. */
  checkboxRootProps?: Omit<CheckboxRootProps, 'name'>
  checkboxIndicatorProps?: CheckboxIndicatorProps
  fieldLabelProps?: FieldLabelProps
  fieldDescriptionProps?: FieldDescriptionProps
  fieldErrorProps?: FieldErrorProps
}

/* ========================================================================

======================================================================== */

// Both CheckboxFieldRoot and CheckboxRoot have a name prop.
// However, CheckboxFieldRoot has precedence.
// It would be a good idea here to omit name from CheckboxRootProps.

export const Checkbox = ({
  fieldRootProps = {},
  checkboxRootProps = {},
  checkboxIndicatorProps = {},
  fieldLabelProps = {},
  fieldDescriptionProps = {},
  fieldErrorProps = {}
}: CheckboxProps) => {
  return (
    <FieldRoot
      {...fieldRootProps}
      className={(fieldRootState) => {
        if (typeof fieldRootProps.className === 'function') {
          fieldRootProps.className =
            fieldRootProps.className(fieldRootState) || ''
        }
        return cn('flex flex-wrap gap-x-[0.5em]', fieldRootProps.className)
      }}
    >
      <CheckboxRoot {...checkboxRootProps}>
        <CheckboxIndicator {...checkboxIndicatorProps} />
      </CheckboxRoot>

      {/* Despite what the Base UI docs show, you don't need to
      wrap the CheckboxRoot with FieldLabel. In fact, 
      this FieldLabel has been specifically built to ONLY 
      be used as a sibling of CheckboxRoot. */}
      <FieldLabel
        {...fieldLabelProps}
        // ⚠️ Gotcha: text-[0.875em] actually will reset the line-height to 1.5.
        // so you need to explicitly set leading-none again.

        className={(fieldLabelState) => {
          if (typeof fieldLabelProps.className === 'function') {
            fieldLabelProps.className =
              fieldLabelProps.className(fieldLabelState) || ''
          }
          return cn('text-[0.875em] leading-none', fieldLabelProps.className)
        }}
      />

      <FieldDescription {...fieldDescriptionProps} />

      {/* This FieldRoot has 'flex flex-wrap' classes.
      However, FieldError has w-full by default, which forces
      it to wrap to a new line. Same for FieldDescription. */}
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
