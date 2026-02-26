import * as React from 'react'
import { Select } from '@base-ui/react/select'
import { ChevronsUpDown } from 'lucide-react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `
shadow-xs
`

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: Using the data-focused attribute as a Tailwind modifier
// may seem more idiomatic to Base UI (i.e., data-focused: ...).
// However, data-focused doesn't remove itself when data-disabled is applied.
// In fact, it often seems to get stuck on the DOM element when data-disabled,
// even after the element no longer truly has focus. Consequently, focus styles
// can potentially persist when they shouldn't. For this reason, it's better to
// stick with the focus-visible: ... modifier.
//
// However, unlike with Combobox, Autocomplete, Input, etc., the Select.Trigger focus
// styles can't simply be applied using the focus-visible: ... modifier. Thus
// continue using data-focused, but also add not-data-disabled.
//# Might be able to use focus-within: instead.
//
// See: https://github.com/mui/base-ui/issues/3987
//      https://github.com/mui/base-ui/pull/3996
//
// This issue still persists as of the latest v1.2 update.
//
///////////////////////////////////////////////////////////////////////////

const FIELD_FOCUS_MIXIN = `
not-data-disabled:data-focused:shadow-none
not-data-disabled:data-focused:border-primary
not-data-disabled:data-focused:ring-[3px]
not-data-disabled:data-focused:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-validating/root:data-valid:not-data-disabled:border-success
not-group-data-validating/root:data-valid:not-data-disabled:data-focused:border-success
not-group-data-validating/root:data-valid:not-data-disabled:data-focused:ring-success/40
not-group-data-validating/root:data-valid:not-data-disabled:text-success
`

const FIELD_INVALID_MIXIN = `
not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:data-focused:border-destructive
not-group-data-validating/root:data-invalid:not-data-disabled:data-focused:ring-destructive/40
not-group-data-validating/root:data-invalid:not-data-disabled:text-destructive
`

const FIELD_DISABLED_MIXIN = `
data-disabled:cursor-not-allowed
data-disabled:text-neutral-400
data-disabled:border-neutral-400
`

const ELLIPSIS_MIXIN = `overflow-hidden text-ellipsis whitespace-nowrap`

// In this case, either disabled or data-disabled will work on the
// SelectTrigger itself, but data-disabled is more idiomatic.
const baseClasses = `
flex
bg-card
w-full min-w-0
px-[0.5em] py-[0.25em]
rounded-[0.375em]
border outline-none
placeholder:text-muted-foreground
justify-between items-center gap-x-[0.5em]
select-none
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ======================
  selectTriggerVariants
====================== */
// ⚠️ Gotcha: The intrinsic height relies on there being text so that leading-[1.5] will
// work. However, if there's no placeholder and no value has been selected then it won't apply.
// In this case, the fix is to use the Select.Icon to match the expected height.
// <Select.Icon className='flex items-center min-h-[1.5em]'>
//
// ⚠️ Gotcha: input elements have browser-based intrinsic sizing that
// can't be fully overridden without explicitly setting height.
// From experimentation, it seems to be creating a line-height
// of 1.5 (at least for Poppins). However, this isn't reflected
// in Chrome devtools computed styles, which makes it confusing.
// In any case, this is why we set leading-[1.5] to make it explicit.
const selectTriggerVariants = cva(baseClasses, {
  variants: {
    fieldSize: {
      xs: 'text-xs leading-[1.5]',
      sm: 'text-sm leading-[1.5]',
      md: 'text-base leading-[1.5]',
      lg: 'text-lg leading-[1.5]',
      xl: 'text-xl leading-[1.5]'
    },
    defaultVariants: {
      fieldSize: 'md'
    }
  }
})

export type SelectTriggerProps = Select.Trigger.Props &
  VariantProps<typeof selectTriggerVariants> & {
    placeholder?: React.ReactNode
  }

/* ========================================================================

======================================================================== */

export const SelectTrigger = ({
  className = '',
  fieldSize,
  placeholder = '',
  ...otherProps
}: SelectTriggerProps) => {
  /* ======================
      renderSelectIcon()
  ====================== */

  const renderSelectIcon = () => {
    const SELECT_ICON_VALIDATION_MIXIN = `
    not-group-data-validating/root:group-data-invalid/root:not-group-data-disabled/root:text-destructive
    not-group-data-validating/root:group-data-valid/root:not-group-data-disabled/root:text-success
    `

    return (
      <Select.Icon className={`flex min-h-[1.5em] cursor-pointer items-center`}>
        <ChevronsUpDown
          className={`text-muted-foreground size-[1.25em] ${SELECT_ICON_VALIDATION_MIXIN}`}
        />
      </Select.Icon>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Select.Trigger
      {...otherProps}
      data-slot='select-trigger'
      className={(selectTriggerState) => {
        if (typeof className === 'function') {
          className = className(selectTriggerState) || ''
        }
        return cn(selectTriggerVariants({ fieldSize }), className)
      }}
    >
      <Select.Value className={ELLIPSIS_MIXIN} placeholder={placeholder} />

      {renderSelectIcon()}
    </Select.Trigger>
  )
}
