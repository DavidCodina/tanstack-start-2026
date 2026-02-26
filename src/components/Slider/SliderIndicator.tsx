import { Slider } from '@base-ui/react/slider'
import { cn } from '@/utils'

export type SliderIndicatorProps = Slider.Indicator.Props

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:bg-success
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:bg-destructive
`

const FIELD_DISABLED_MIXIN = `
data-disabled:bg-neutral-400
`

const baseClasses = `
bg-primary rounded select-none
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ========================================================================

======================================================================== */

export const SliderIndicator = ({
  className = '',
  ...otherProps
}: SliderIndicatorProps) => {
  return (
    <Slider.Indicator
      {...otherProps}
      data-slot='slider-indicator'
      className={(sliderIndicatorState) => {
        if (typeof className === 'function') {
          className = className(sliderIndicatorState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
