import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { SwitchRoot } from './SwitchRoot'
import { SwitchThumb } from './SwitchThumb'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'

import type { SwitchRootProps } from './SwitchRoot'
import type { SwitchThumbProps } from './SwitchThumb'
import { cn } from '@/utils'

export type SwitchProps = {
  fieldRootProps?: FieldRootProps
  fieldLabelProps?: FieldLabelProps
  switchRootProps?: SwitchRootProps
  switchThumbProps?: SwitchThumbProps
  fieldErrorProps?: FieldErrorProps
  fieldDescriptionProps?: FieldDescriptionProps
}

/* ========================================================================

======================================================================== */

export const Switch = ({
  fieldRootProps = {},
  switchRootProps = {},
  switchThumbProps = {},
  fieldLabelProps = {},
  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: SwitchProps) => {
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
      <SwitchRoot {...switchRootProps}>
        <SwitchThumb {...switchThumbProps} />
      </SwitchRoot>

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
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
