import { Switch } from '@base-ui/react/switch'
import { cn } from '@/utils'

export type SwitchRootProps = Switch.Root.Props

// shadow-gray-200
// active:bg-gray-100 // Does nothing
// data-[checked]:active:bg-gray-500 // Does nothing

// Background is too fancy...
// bg-linear-to-r from-gray-700
// from-35% to-gray-200 to-65%
// bg-[length:6.5rem_100%] bg-[100%_0%]
// bg-no-repeat

// shadow-[inset_0_1.5px_2px]

// before:absolute
// before:rounded-full
// before:outline-offset-2
// before:outline-blue-800

// focus-visible:before:inset-0
// focus-visible:before:outline
// focus-visible:before:outline-2

// dark:from-gray-500
//
// dark:outline-white/15
// dark:data-[checked]:shadow-none

const SHADOW_MIXIN = `
shadow-[inset_0_1.5px_2px]
dark:shadow-black/75
`

const baseClasses = `
relative
bg-card
flex h-6 w-10 p-px 
rounded-full cursor-pointer
outline -outline-offset-1 outline-border
${SHADOW_MIXIN}

transition-[background-position]

duration-[125ms]
ease-[cubic-bezier(0.26,0.75,0.38,0.45)]
data-[checked]:bg-[0%_0%]
`

/* ========================================================================

======================================================================== */

export const SwitchRoot = ({
  className = '',
  ...otherProps
}: SwitchRootProps) => {
  return (
    <Switch.Root
      {...otherProps}
      data-slot='switch-root'
      className={(switchRootState) => {
        if (typeof className === 'function') {
          className = className(switchRootState) || ''
        }

        return cn(baseClasses, className)
      }}
    />
  )
}
