// https://base-ui.com/react/components/autocomplete

import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { AutocompleteRoot } from './AutocompleteRoot'
import { AutocompleteInput } from './AutocompleteInput'
import { AutocompleteMenu } from './AutocompleteMenu'

import type { AutocompletePortalProps } from './AutocompletePortal'
import type { AutocompletePositionerProps } from './AutocompletePositioner'
import type { AutocompletePopupProps } from './AutocompletePopup'
import type { AutocompleteEmptyProps } from './AutocompleteEmpty'
import type { AutocompleteListProps } from './AutocompleteList'

import type { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'
import type { AutocompleteRootProps } from './AutocompleteRoot'
import type { AutocompleteInputProps } from './AutocompleteInput'

import { cn } from '@/utils'

type ListChildren = AutocompletePrimitive.List.Props['children']

type AutocompleteProps = {
  children?: ListChildren
  fieldRootProps?: FieldRootProps
  fieldLabelProps?: FieldLabelProps
  autocompleteRootProps?: AutocompleteRootProps
  autocompleteInputProps?: AutocompleteInputProps
  autocompletePortalProps?: AutocompletePortalProps
  autocompletePositionerProps?: AutocompletePositionerProps
  autocompletePopupProps?: AutocompletePopupProps
  autocompleteEmptyProps?: AutocompleteEmptyProps
  autocompleteListProps?: AutocompleteListProps
  fieldErrorProps?: FieldErrorProps
  fieldDescriptionProps?: FieldDescriptionProps
}

/* ========================================================================

======================================================================== */

export const Autocomplete = ({
  children,
  fieldRootProps = {},
  fieldLabelProps = {},
  autocompleteRootProps = {},
  autocompleteInputProps = {},

  autocompletePortalProps = {},
  autocompletePositionerProps = {},
  autocompletePopupProps = {},
  autocompleteEmptyProps = {},
  autocompleteListProps = {},

  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: AutocompleteProps) => {
  return (
    <FieldRoot {...fieldRootProps}>
      <AutocompleteRoot {...autocompleteRootProps}>
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

        <AutocompleteInput {...autocompleteInputProps} />

        <AutocompleteMenu
          autocompletePortalProps={autocompletePortalProps}
          autocompletePositionerProps={autocompletePositionerProps}
          autocompletePopupProps={autocompletePopupProps}
          autocompleteEmptyProps={autocompleteEmptyProps}
          autocompleteListProps={{ children, ...autocompleteListProps }}
        />
      </AutocompleteRoot>

      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
