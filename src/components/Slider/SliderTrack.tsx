import { Slider } from '@base-ui/react/slider'
import { cn } from '@/utils'

export type SliderTrackProps = Slider.Track.Props

const baseClasses = `
h-1.5 w-full rounded bg-card
shadow-[inset_0_0_0_0.5px]
shadow-border select-none
`

/* ========================================================================

======================================================================== */

export const SliderTrack = ({
  className = '',
  ...otherProps
}: SliderTrackProps) => {
  return (
    <Slider.Track
      {...otherProps}
      data-slot='slider-track'
      className={(sliderTrackState) => {
        if (typeof className === 'function') {
          className = className(sliderTrackState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
