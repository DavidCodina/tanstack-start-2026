// https://base-ui.com/react/components/slider
// https://github.com/mui/base-ui/tree/master/packages/react/src/slider
// https://github.com/mui/base-ui/tree/master/docs/src/app/(docs)/react/components/slider/demos

import { FieldDescription, FieldError, FieldLabel, FieldRoot } from '../Field'

import { SliderRoot } from './SliderRoot'
import { SliderControl } from './SliderControl'
import { SliderTrack } from './SliderTrack'
import { SliderIndicator } from './SliderIndicator'
import { SliderThumb } from './SliderThumb'

import type {
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps
} from '../Field'

import type { SliderRootProps } from './SliderRoot'
import type { SliderControlProps } from './SliderControl'
import type { SliderTrackProps } from './SliderTrack'
import type { SliderIndicatorProps } from './SliderIndicator'
import type { SliderThumbProps as ThumbProps } from './SliderThumb'

import { cn } from '@/utils'

type SliderThumbProps = Omit<ThumbProps, 'aria-label'> & {
  /** A string for single thumbs, or an array that gets mapped internally when multiple thumbs. */
  'aria-label'?: string | string[]
}

export type SliderProps = {
  fieldRootProps?: FieldRootProps
  fieldLabelProps?: FieldLabelProps

  sliderRootProps?: SliderRootProps
  sliderControlProps?: SliderControlProps
  sliderTrackProps?: SliderTrackProps
  sliderIndicatorProps?: SliderIndicatorProps
  sliderThumbProps?: SliderThumbProps

  fieldDescriptionProps?: FieldDescriptionProps
  fieldErrorProps?: FieldErrorProps
}

/* ========================================================================

======================================================================== */

export const Slider = ({
  fieldRootProps = {},
  fieldLabelProps = {},

  sliderRootProps = {},
  sliderControlProps = {},
  sliderTrackProps = {},
  sliderIndicatorProps = {},
  sliderThumbProps = {},

  fieldDescriptionProps = {},
  fieldErrorProps = {}
}: SliderProps) => {
  /* ======================
          thumbs
  ====================== */
  // Dynamicially infer n number of thumbs from the value / defaltValue.

  const thumbs = Array.isArray(sliderRootProps.value)
    ? sliderRootProps.value.length
    : Array.isArray(sliderRootProps.defaultValue)
      ? sliderRootProps.defaultValue.length
      : 1

  /* ======================
        focusThumb()
  ====================== */

  const focusThumb = (e: any) => {
    const target = e.currentTarget as HTMLElement
    const parent = target.parentElement
    if (!parent) {
      return
    }

    const firstThumb = parent.querySelector(
      "[data-slot='slider-thumb']"
    ) as HTMLElement
    if (!firstThumb) return

    const firstThumbInput = firstThumb.querySelector('input')
    if (!firstThumbInput) return

    firstThumb.setAttribute('data-label-focused', '')
    firstThumbInput.focus()
  }

  /* ======================
           return
  ====================== */
  return (
    <FieldRoot {...fieldRootProps}>
      <FieldLabel
        {...fieldLabelProps}
        // ⚠️ Gotcha: text-sm actually will reset the line-height to 1.5.
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
        onClick={focusThumb}
      />

      <SliderRoot {...sliderRootProps}>
        <SliderControl {...sliderControlProps}>
          <SliderTrack {...sliderTrackProps}>
            <SliderIndicator {...sliderIndicatorProps} />
            {Array.from({ length: thumbs }, (_, index) => {
              const _ariaLabel = sliderThumbProps['aria-label']
              const ariaLabel = Array.isArray(_ariaLabel)
                ? _ariaLabel[index]
                : _ariaLabel

              return (
                <SliderThumb
                  {...sliderThumbProps}
                  aria-label={ariaLabel}
                  key={index}
                  // The index of the thumb which corresponds to the index of its value in the value or
                  // defaultValue array. This prop is required to support server-side rendering for range
                  // sliders with multiple thumbs.
                  index={index}
                  onBlur={(e) => {
                    if (index === 0) {
                      e.target.removeAttribute('data-label-focused')
                    }
                    sliderThumbProps.onBlur?.(e)
                  }}
                />
              )
            })}
          </SliderTrack>
        </SliderControl>
      </SliderRoot>

      <FieldDescription {...fieldDescriptionProps} />
      <FieldError {...fieldErrorProps} />
    </FieldRoot>
  )
}
