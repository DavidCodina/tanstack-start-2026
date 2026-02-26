import { Radio } from '@base-ui/react/radio'
import { cn } from '@/utils'

export type RadioIndicatorProps = Radio.Indicator.Props

const baseClasses = `
flex before:size-[0.5em] before:rounded-full before:bg-white data-unchecked:hidden
`

/* ========================================================================

======================================================================== */

export const RadioIndicator = ({
  className,
  keepMounted,
  render,
  style,
  ...otherProps
}: RadioIndicatorProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Radio.Indicator
      {...otherProps}
      data-slot='radio-indicator'
      className={(radioIndicatorState) => {
        if (typeof className === 'function') {
          className = className(radioIndicatorState) || ''
        }
        return cn(baseClasses, className)
      }}
      keepMounted={keepMounted}
      render={render}
      style={style}
    />
  )
}
