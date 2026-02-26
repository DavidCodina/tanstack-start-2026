import { Slider } from '@base-ui/react/slider'
import { cn } from '@/utils'

export type SliderRootProps = Slider.Root.Props

const baseClasses = ``

/* ========================================================================

======================================================================== */
// Groups all parts of the slider. Renders a <div> element.

export const SliderRoot = ({
  className = '',
  ...otherProps
}: SliderRootProps) => {
  return (
    <Slider.Root
      {...otherProps}
      data-slot='slider-root'
      className={(sliderRootState) => {
        if (typeof className === 'function') {
          className = className(sliderRootState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
