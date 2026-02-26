import { NumberField } from '@base-ui/react/number-field'
import { FieldLabel } from '../Field'
import { CursorGrowIcon } from './CursorGrowIcon'
import type { FieldLabelProps } from '../Field'

import { cn } from '@/utils'

type NumberFieldScrubAreaCursorProps = NumberField.ScrubAreaCursor.Props

export type NumberFieldScrubAreaProps = NumberField.ScrubArea.Props & {
  fieldLabelProps?: FieldLabelProps
  numberFieldScrubAreaCursorProps?: NumberFieldScrubAreaCursorProps
}

/* ========================================================================

======================================================================== */
// NumberFieldScrubArea encapsulates the FieldLabel
// Click on the FieldLabel then drag horizontally to decrement/increment.

export const NumberFieldScrubArea = ({
  className,
  fieldLabelProps = {},
  numberFieldScrubAreaCursorProps = {},
  ...otherProps
}: NumberFieldScrubAreaProps) => {
  /* ======================
          return
  ====================== */

  return (
    <NumberField.ScrubArea
      children={
        <>
          <FieldLabel
            {...fieldLabelProps}
            className={(fieldLabelState) => {
              if (typeof fieldLabelProps.className === 'function') {
                fieldLabelProps.className =
                  fieldLabelProps.className(fieldLabelState) || ''
              }

              return cn(
                'mb-1 cursor-ew-resize text-sm leading-none font-medium',
                fieldLabelProps.className
              )
            }}
          />

          <NumberField.ScrubAreaCursor
            {...numberFieldScrubAreaCursorProps}
            data-slot='number-field-scrub-area-cursor'
            className={(state) => {
              if (
                typeof numberFieldScrubAreaCursorProps.className === 'function'
              ) {
                numberFieldScrubAreaCursorProps.className =
                  numberFieldScrubAreaCursorProps.className(state) || ''
              }
              return cn(
                'drop-shadow-[0_1px_1px_#0008] filter',
                numberFieldScrubAreaCursorProps.className
              )
            }}
          >
            {/* This works in conjunction with the cursor-ew-resize class on BOTH
        NumberField.ScrubArea and FieldLabel such that when you press down
        on NumberField.ScrubArea and/or FieldLabel, it replaces the cursor
        with the longer version of the cursor-ew-resize. */}
            <CursorGrowIcon />
          </NumberField.ScrubAreaCursor>
        </>
      }
      {...otherProps}
      data-slot='number-field-scrub-area'
      className={(numberFieldScrubAreaState) => {
        if (typeof className === 'function') {
          className = className(numberFieldScrubAreaState) || ''
        }
        return cn('w-fit cursor-ew-resize', className)
      }}
    />
  )
}
