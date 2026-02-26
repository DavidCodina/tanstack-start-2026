// https://base-ui.com/react/components/combobox#multiple-select
// https://github.com/mui/base-ui/tree/65c2d3ae03442fc69b042f3f92bbe4fd873e083b/docs/src/app/(docs)/react/components/combobox/demos

import * as React from 'react'
import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'
import { ComboboxRoot } from './ComboboxRoot'
import { ComboboxMenu } from './ComboboxMenu'
import { ComboboxChips } from './ComboboxChips'
import { ComboboxValue } from './ComboboxValue'
import { ComboboxChip } from './ComboboxChip'
import { ComboboxMultipleInput } from './ComboboxMultipleInput'

import type { Combobox } from '@base-ui/react/combobox'
import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'
import type { ComboboxRootProps } from './ComboboxRoot'
import type { ComboboxChipsProps } from './ComboboxChips'
import type { ComboboxValueProps } from './ComboboxValue'
import type { ComboboxPortalProps } from './ComboboxPortal'
import type { ComboboxPositionerProps } from './ComboboxPositioner'
import type { ComboboxPopupProps } from './ComboboxPopup'
import type { ComboboxEmptyProps } from './ComboboxEmpty'
import type { ComboboxListProps } from './ComboboxList'
import type { ComboboxMultipleInputProps } from './ComboboxMultipleInput'
import type { StrictItem } from './types'

import { useMergedRef } from '@/hooks'
import { cn } from '@/utils'

type ComboboxListChildren = Combobox.List.Props['children']

export type ComboboxMultipleProps = {
  children?: ComboboxListChildren
  fieldRootProps?: FieldRootProps
  comboboxRootProps?: Omit<ComboboxRootProps, 'multiple'>
  fieldLabelProps?: FieldLabelProps

  comboboxChipsProps?: ComboboxChipsProps
  comboboxValueProps?: ComboboxValueProps
  comboboxChipProps?: Combobox.Chip.Props
  comboboxInputProps?: ComboboxMultipleInputProps

  // ❌ comboboxClearProps?: ComboboxClearProps
  // ❌ comboboxTriggerProps?: ComboboxTriggerProps

  // Props for ComboboxMenu
  comboboxPortalProps?: ComboboxPortalProps
  comboboxPositionerProps?: Omit<ComboboxPositionerProps, 'anchor'>
  comboboxPopupProps?: ComboboxPopupProps
  comboboxEmptyProps?: ComboboxEmptyProps
  comboboxListProps?: ComboboxListProps

  fieldErrorProps?: FieldErrorProps
  fieldDescriptionProps?: FieldDescriptionProps
}

/* ========================================================================

======================================================================== */
// The use of multiple in conjunction with Combobox.Chips warrants creating an entirely
// separate component. Why? Because the styles for Combobox.Input are very different
// and there's a lot of different components and logic.

export const ComboboxMultiple = ({
  children,
  fieldRootProps = {},
  comboboxRootProps = {},
  fieldLabelProps = {},

  comboboxChipsProps = {},
  comboboxValueProps = {},
  comboboxChipProps = {},
  comboboxInputProps = {},

  comboboxPortalProps = {},
  comboboxPositionerProps = {},
  comboboxPopupProps = {},
  comboboxEmptyProps = {},
  comboboxListProps = {},

  fieldErrorProps = {},
  fieldDescriptionProps = {}
}: ComboboxMultipleProps) => {
  const anchorRef = React.useRef<HTMLDivElement | null>(null)
  const mergedRef = useMergedRef(anchorRef, comboboxChipsProps.ref)

  /* ======================
          return
  ====================== */

  return (
    <FieldRoot {...fieldRootProps}>
      <ComboboxRoot {...comboboxRootProps} multiple>
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

        {/* ComboboxChips replaces ComboboxInputContainer in the normal Combobox. */}
        <ComboboxChips {...comboboxChipsProps} ref={mergedRef}>
          <ComboboxValue {...comboboxValueProps}>
            {(items: StrictItem[]) => {
              return (
                <>
                  {items.map((item, _index) => {
                    const isId =
                      typeof item.id === 'string' || typeof item.id === 'number'

                    // There's a possible edge case where two items item.value may be the same.
                    // However, this is arguably less likely than the other potential issue whereby the
                    // list order changes or items are added/removed. In cases where no item.id exists,
                    // and values are potentially the same AND you know the list size or order won't
                    // change, then you can map over the original items in advance and map that index
                    // to an id property to create a transformed items list.
                    const key = isId ? item.id : item.value

                    return (
                      <ComboboxChip
                        {...comboboxChipProps}
                        item={item}
                        key={key}
                      />
                    )
                  })}

                  <ComboboxMultipleInput
                    {...comboboxInputProps}
                    placeholder={
                      items.length > 0 ? '' : comboboxInputProps.placeholder
                    }
                  />
                </>
              )
            }}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxMenu
          comboboxPortalProps={comboboxPortalProps}
          comboboxPositionerProps={{
            // Why is this necessary? If you don't do this, then the menu will
            // align horizontally with the Combobox.Input.
            anchor: anchorRef,
            ...comboboxPositionerProps
          }}
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
