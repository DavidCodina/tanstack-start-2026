import { FieldDescription, FieldError, FieldRoot } from '../Field'

import { NumberFieldRoot } from './NumberFieldRoot'
import { NumberFieldScrubArea } from './NumberFieldScrubArea'
import { NumberFieldGroup } from './NumberFieldGroup'
import { NumberFieldInput } from './NumberFieldInput'
import { NumberFieldDecrement } from './NumberFieldDecrement'
import { NumberFieldIncrement } from './NumberFieldIncrement'

import type { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field'
import type { NumberFieldRootProps } from './NumberFieldRoot'
import type { NumberFieldGroupProps } from './NumberFieldGroup'
import type { NumberFieldInputProps } from './NumberFieldInput'
import type { NumberFieldDecrementProps } from './NumberFieldDecrement'
import type { NumberFieldIncrementProps } from './NumberFieldIncrement'

import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'

import { cn } from '@/utils'

export type NumberFieldProps = {
  hideControls?: boolean
  fieldLabelProps?: FieldLabelProps
  numberFieldRootProps?: NumberFieldRootProps
  numberFieldScrubAreaProps?: NumberFieldPrimitive.ScrubArea.Props
  fieldRootProps?: FieldRootProps
  numberFieldScrubAreaCursorProps?: NumberFieldPrimitive.ScrubAreaCursor.Props
  numberFieldGroupProps?: NumberFieldGroupProps
  numberFieldInputProps?: NumberFieldInputProps
  numberFieldDecrementProps?: NumberFieldDecrementProps
  numberFieldIncrementProps?: NumberFieldIncrementProps
  fieldDescriptionProps?: FieldDescriptionProps
  fieldErrorProps?: FieldErrorProps
}

/* ========================================================================

======================================================================== */

///////////////////////////////////////////////////////////////////////////
//
// Unlike Mantine NumberInput
// - we don't have completely customizable prefix/suffix.
// - There isn't a configurable clampBehavior.
//   Instead, the value is clamped when the input is blurred.
// - There isn't an allowNegative prop. Instead that behavior is
//   controlled implicitly through the min prop.
// - There isn't a decimalScale or fixedDecimalScale prop. Instead
//   that behavior behavior is controlled through the format prop's
//   minimumFractionDigits and maximumFractionDigits.
// - There isn't a decimalSeparator prop, but you probably won't need that.
// - There isn't a thousandSeparator prop, but you probably won't need that.
//
///////////////////////////////////////////////////////////////////////////

export const NumberField = ({
  hideControls = false,
  fieldRootProps = {},
  numberFieldRootProps = {},
  numberFieldScrubAreaProps = {}, // For NumberFieldScrubArea
  fieldLabelProps = {}, // For NumberFieldScrubArea
  numberFieldScrubAreaCursorProps = {}, // For NumberFieldScrubArea
  numberFieldGroupProps = {},
  numberFieldInputProps = {},
  numberFieldDecrementProps = {},
  numberFieldIncrementProps = {},
  fieldDescriptionProps = {},
  fieldErrorProps = {}
}: NumberFieldProps) => {
  /* ======================
  renderNumberFieldGroup()
  ====================== */

  const renderNumberFieldGroup = () => {
    return (
      <NumberFieldGroup
        {...numberFieldGroupProps}
        className={(numberFieldGroupState) => {
          if (typeof numberFieldGroupProps.className === 'function') {
            numberFieldGroupProps.className =
              numberFieldGroupProps.className(numberFieldGroupState) || ''
          }
          return cn(
            numberFieldGroupProps.className,
            hideControls && 'overflow-hidden border'
          )
        }}
      >
        {!hideControls && (
          <NumberFieldDecrement {...numberFieldDecrementProps} />
        )}
        <NumberFieldInput
          {...numberFieldInputProps}
          className={(numberFieldInputState) => {
            if (typeof numberFieldInputProps.className === 'function') {
              numberFieldInputProps.className =
                numberFieldInputProps.className(numberFieldInputState) || ''
            }
            return cn(
              numberFieldInputProps.className,
              hideControls && 'border-none'
            )
          }}
        />
        {!hideControls && (
          <NumberFieldIncrement {...numberFieldIncrementProps} />
        )}
      </NumberFieldGroup>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <NumberFieldRoot {...numberFieldRootProps}>
        <NumberFieldScrubArea
          {...numberFieldScrubAreaProps}
          fieldLabelProps={fieldLabelProps}
          numberFieldScrubAreaCursorProps={numberFieldScrubAreaCursorProps}
        />
        {renderNumberFieldGroup()}
      </NumberFieldRoot>

      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
