import { Switch } from '@base-ui/react/switch'
import { cn } from '@/utils'

export type SwitchThumbProps = Switch.Thumb.Props

// data-checked:translate-x-4
const BORDER_MIXIN = `
border border-[rgba(0,0,0,0.25)]
dark:border-[rgba(255,255,255,0.25)]
`

const SHADOW_MIXIN = `
shadow-[0px_0px_0.25px_0.25px]
shadow-card
`

// The X translation is very brittle.
// It will make it challenging to give it different sizes.
const baseClasses = `
aspect-square h-[calc(100%_-_1px)] rounded-full
bg-border
translate-y-[0.5px]
data-checked:bg-primary
data-checked:translate-x-[calc(var(--spacing)*4_+_1px)]
${BORDER_MIXIN}
${SHADOW_MIXIN}
transition-transform
duration-150
`

/* ========================================================================

======================================================================== */

export const SwitchThumb = ({
  className = '',
  ...otherProps
}: SwitchThumbProps) => {
  return (
    <Switch.Thumb
      {...otherProps}
      data-slot='switch-thumb'
      className={(switchThumbState) => {
        if (typeof className === 'function') {
          className = className(switchThumbState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
