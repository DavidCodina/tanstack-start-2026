import { Slider } from '@base-ui/react/slider'
import { cn } from '@/utils'

export type SliderThumbProps = Slider.Thumb.Props & {
  showValue?: boolean
}

///////////////////////////////////////////////////////////////////////////
//
// The original documentation had classes like this:
//
//   has-[:focus-visible]:outline
//   has-[:focus-visible]:outline-2
//   has-[:focus-visible]:outline-blue-500
//
// This is a pretty fancy way of doing the styles (may not work in Safari).
// However, it does not end up focusing the thumb when clicking on the Field.Label.
// In order to get the thumb to focus, when clicking on the label, you could do
// something likethis:
//
//   not-group-data-disabled/root:group-data-focused/root:outline-2
//   not-group-data-disabled/root:group-data-focused/root:outline-blue-500
//
// However, the problem here (as with checks and radios) is that data-focused
// ends up giving focus-like styles to all thumbs when multiple thumbs exist.
// In order to get the foucus behavior to work in conjunction with the Field.Label.
// I added this to the FieldLabel's onClick:
//
//   const focusThumb = (e: any) => {
//     const target = e.currentTarget as HTMLElement
//     const parent = target.parentElement
//     if (!parent) return
//     const firstThumb = parent.querySelector("[data-slot='slider-thumb']") as HTMLElement
//     if (!firstThumb) return
//     const firstThumbInput = firstThumb.querySelector('input')
//     if (!firstThumbInput) return
//     firstThumb.setAttribute('data-label-focused', '')
//     firstThumbInput.focus()
//   }
//
// Then I added this to the SliderThumb's onBlur:
//
//   onBlur={(e) => {
//     if (index === 0) { e.target.removeAttribute('data-label-focused') }
//     sliderThumbProps.onBlur?.(e)
//   }}
//
// And all of this works in conjunction with the following Tailwind modifier:
//
//   data-label-focused:focus-within: ...
//
// Note: I suspect the Slider.Thumb onBlur is actually triggered by the internal input.
// However, the Base UI consumer is generally not aware of this.
//
///////////////////////////////////////////////////////////////////////////

const FIELD_FOCUS_MIXIN = `
has-[:focus-visible]:shadow-none
has-[:focus-visible]:ring-[3px]
has-[:focus-visible]:ring-primary/40
data-label-focused:focus-within:shadow-none
data-label-focused:focus-within:ring-[3px]
data-label-focused:focus-within:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:outline-success
not-group-data-validating/root:data-valid:not-data-disabled:has-[:focus-visible]:ring-success/40
not-group-data-validating/root:data-valid:not-data-disabled:data-label-focused:focus-within:ring-success/40
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:outline-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:has-[:focus-visible]:ring-destructive/40
not-group-data-validating/root:data-invalid:not-data-disabled:data-label-focused:focus-within:ring-destructive/40
`

const FIELD_DISABLED_MIXIN = `
data-disabled:cursor-not-allowed 
data-disabled:outline-neutral-400
`

const baseClasses = `
relative
size-4 rounded-full bg-card
outline outline-primary
select-none cursor-pointer
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

const Value = ({
  className = '',
  ...otherProps
}: React.ComponentProps<'div'>) => {
  const baseClasses = `
  flex items-center justify-center
  px-[0.25em] py-[0.125em]
  bg-card text-[0.75em] leading-none
  absolute
  bottom-[calc(100%+5px)]
  left-1/2 min-w-[1.5em]
  -translate-x-1/2
  border rounded-[0.35em]  
  shadow-[0_1px_0.5px_rgba(0,0,0,0.35)]
  `
  return <div {...otherProps} className={cn(baseClasses, className)} />
}
/* ========================================================================

======================================================================== */

export const SliderThumb = ({
  className = '',
  index,
  showValue = true,
  ...otherProps
}: SliderThumbProps) => {
  return (
    <Slider.Value data-slot='slider-value'>
      {(_formattedValues, values) => {
        // formattedValues will be string[] and values will be number[].
        // This is true even if we have a single value/thumb.
        // This assumes that index is being passed into SliderThumb, which
        // we are doing in Array.from in the main Slider component.
        const value = values[index as number]

        return (
          <Slider.Thumb
            {...otherProps}
            data-slot='slider-thumb'
            className={(sliderThumbState) => {
              if (typeof className === 'function') {
                className = className(sliderThumbState) || ''
              }
              return cn(baseClasses, className)
            }}
            index={index}
          >
            {showValue && <Value>{value}</Value>}
          </Slider.Thumb>
        )
      }}
    </Slider.Value>
  )
}
