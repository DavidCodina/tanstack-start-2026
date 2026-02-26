import { Slider } from '@base-ui/react/slider'
import { cn } from '@/utils'

export type SliderControlProps = Slider.Control.Props

const baseClasses = `
flex 
touch-none items-center pt-2 pb-2 select-none
`

/* ========================================================================

======================================================================== */

export const SliderControl = ({
  className = '',
  ...otherProps
}: SliderControlProps) => {
  return (
    <Slider.Control
      {...otherProps}
      data-slot='slider-control'
      className={(sliderControlState) => {
        if (typeof className === 'function') {
          className = className(sliderControlState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
