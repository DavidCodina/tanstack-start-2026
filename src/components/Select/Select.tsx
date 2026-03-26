import * as React from 'react'
import { Select as SelectPrimitive } from '@base-ui/react/select'
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'

import { SelectTrigger } from './SelectTrigger'
import { SelectMenu } from './SelectMenu'

import type { SelectTriggerProps, SelectValueProps } from './SelectTrigger'

import type { SelectPortalProps } from './SelectPortal'
import type { SelectPopupProps } from './SelectPopup'
import type { SelectPositionerProps } from './SelectPositioner'
import type { SelectListProps } from './SelectList'

import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'

import { cn } from '@/utils'

export type SelectProps = {
  /** Pass children directly for convenience, or use selectListProps.children. */
  children?: React.ReactNode
  fieldRootProps?: FieldRootProps
  fieldLabelProps?: FieldLabelProps

  selectRootProps?: React.ComponentProps<typeof SelectPrimitive.Root>
  selectTriggerProps?: SelectTriggerProps
  selectValueProps?: SelectValueProps

  selectPortalProps?: SelectPortalProps
  selectPositionerProps?: SelectPositionerProps
  selectPopupProps?: SelectPopupProps
  selectListProps?: SelectListProps

  fieldDescriptionProps?: FieldDescriptionProps
  fieldErrorProps?: FieldErrorProps
}

/* ========================================================================

======================================================================== */

export const Select = ({
  children,
  fieldRootProps = {},
  fieldLabelProps = {},
  selectRootProps = {},
  selectTriggerProps = {},
  selectValueProps = {},
  selectPortalProps = {},
  selectPositionerProps = {},
  selectPopupProps = {},
  selectListProps = {},
  fieldDescriptionProps = {},
  fieldErrorProps = {}
}: SelectProps) => {
  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <FieldLabel
        {...fieldLabelProps}
        // ⚠️ Gotcha: text-sm actually will reset the line-height to 1.5,
        // so you need to explicitly set leading-none again.
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

      <SelectPrimitive.Root
        // No need to add data-slot because it
        // doesn't render  its own HTML element
        // data-slot='select-root'
        {...selectRootProps}
      >
        <SelectTrigger
          {...selectTriggerProps}
          selectValueProps={selectValueProps}
        />

        <SelectMenu
          selectPortalProps={selectPortalProps}
          selectPositionerProps={selectPositionerProps}
          selectPopupProps={selectPopupProps}
          selectListProps={{ children, ...selectListProps }}
        />
      </SelectPrimitive.Root>

      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
