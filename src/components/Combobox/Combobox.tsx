// https://base-ui.com/react/components/combobox

import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { ComboboxRoot } from './ComboboxRoot'
import { ComboboxInputContainer } from './ComboboxInputContainer'
import { ComboboxInput } from './ComboboxInput'
import { ComboboxMenu } from './ComboboxMenu'
import { ComboboxControlsContainer } from './ComboboxControlsContainer'
import { ComboboxClear } from './ComboboxClear'
import { ComboboxTrigger } from './ComboboxTrigger'

import type { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import type { ComboboxRootProps } from './ComboboxRoot'
import type { ComboboxInputContainerProps } from './ComboboxInputContainer'
import type { ComboboxInputProps } from './ComboboxInput'
import type { ComboboxControlsContainerProps } from './ComboboxControlsContainer'
import type { ComboboxClearProps } from './ComboboxClear'
import type { ComboboxTriggerProps } from './ComboboxTrigger'
import type { ComboboxPortalProps } from './ComboboxPortal'
import type { ComboboxPositionerProps } from './ComboboxPositioner'
import type { ComboboxPopupProps } from './ComboboxPopup'
import type { ComboboxEmptyProps } from './ComboboxEmpty'
import type { ComboboxListProps } from './ComboboxList'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'

import { cn } from '@/utils'

type ComboboxListChildren = ComboboxPrimitive.List.Props['children']

export type ComboboxProps = {
  children?: ComboboxListChildren
  fieldRootProps?: FieldRootProps
  comboboxRootProps?: Omit<ComboboxRootProps, 'multiple'>
  fieldLabelProps?: FieldLabelProps

  comboboxInputContainerProps?: Omit<ComboboxInputContainerProps, 'children'>
  comboboxInputProps?: ComboboxInputProps
  comboboxControlsContainerProps?: Omit<
    ComboboxControlsContainerProps,
    'children'
  >
  comboboxClearProps?: ComboboxClearProps
  comboboxTriggerProps?: ComboboxTriggerProps

  comboboxPortalProps?: ComboboxPortalProps
  comboboxPositionerProps?: ComboboxPositionerProps
  comboboxPopupProps?: ComboboxPopupProps
  comboboxEmptyProps?: ComboboxEmptyProps
  comboboxListProps?: ComboboxListProps
  fieldErrorProps?: FieldErrorProps
  fieldDescriptionProps?: FieldDescriptionProps
}

/* ========================================================================

======================================================================== */
// Combobox is Base Ui's version of react-select.

//# Add all associated nodes to the useValidationHack() hook.
//#
//# - Combobox.Input   : data-slot='combobox-input'
//# - Combobox.Trigger : data-slot='combobox-trigger'

//# Test all components once data-focused fix goes out.

//# If disabled, but the menu is open, we can still select items.
//# This may get fixed in the new release.

export const Combobox = ({
  children,
  fieldRootProps = {},
  comboboxRootProps = {},
  fieldLabelProps = {},

  comboboxInputContainerProps = {},
  comboboxInputProps = {},
  comboboxControlsContainerProps = {},
  comboboxClearProps = {},
  comboboxTriggerProps = {},

  // Props for ComboboxMenu
  comboboxPortalProps = {},
  comboboxPositionerProps = {},
  comboboxPopupProps = {},
  comboboxEmptyProps = {},
  comboboxListProps = {},

  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: ComboboxProps) => {
  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <ComboboxRoot {...comboboxRootProps}>
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

        <ComboboxInputContainer {...comboboxInputContainerProps}>
          <ComboboxInput {...comboboxInputProps} />

          <ComboboxControlsContainer {...comboboxControlsContainerProps}>
            <ComboboxClear {...comboboxClearProps} />
            <ComboboxTrigger {...comboboxTriggerProps} />
          </ComboboxControlsContainer>
        </ComboboxInputContainer>

        <ComboboxMenu
          comboboxPortalProps={comboboxPortalProps}
          comboboxPositionerProps={comboboxPositionerProps}
          comboboxPopupProps={comboboxPopupProps}
          comboboxEmptyProps={comboboxEmptyProps}
          comboboxListProps={{ children, ...comboboxListProps }}
        />
      </ComboboxRoot>

      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
