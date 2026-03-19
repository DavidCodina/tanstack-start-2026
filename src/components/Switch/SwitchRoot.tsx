import { Switch } from '@base-ui/react/switch'
import { cn } from '@/utils'

export type SwitchRootProps = Switch.Root.Props

const FIELD_FOCUS_MIXIN = `
not-data-disabled:focus-visible:border-primary
not-data-disabled:focus-visible:ring-[3px]
not-data-disabled:focus-visible:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:outline-success
not-group-data-validating/root:data-valid:not-data-disabled:focus-visible:outline-success
not-group-data-validating/root:data-valid:not-data-disabled:not-data-disabled:focus-visible:ring-success/40
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:outline-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:focus-visible:outline-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:focus-visible:ring-destructive/40
`

const FIELD_DISABLED_MIXIN = ``

const FIELD_BOX_SHADOW_MIXIN = `
shadow-[inset_0_1.5px_2px]
dark:shadow-black/75
`

const baseClasses = `
relative
bg-card
flex h-6 w-10 p-px 
rounded-full cursor-pointer
outline -outline-offset-1 outline-border
transition-[background-position]
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
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
