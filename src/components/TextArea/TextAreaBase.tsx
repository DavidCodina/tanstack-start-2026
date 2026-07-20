import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-primary
focus-visible:ring-[3px]
focus-visible:ring-primary/40
`

const FIELD_VALID_MIXIN = `
not-group-data-disabled/root:not-group-data-validating/root:group-data-valid/root:not-disabled:border-success
not-group-data-validating/root:group-data-valid/root:focus-visible:border-success
not-group-data-validating/root:group-data-valid/root:focus-visible:ring-success/40
`

const FIELD_INVALID_MIXIN = `
not-group-data-disabled/root:not-group-data-validating/root:group-data-invalid/root:not-disabled:border-destructive
not-group-data-validating/root:group-data-invalid/root:focus-visible:border-destructive
not-group-data-validating/root:group-data-invalid/root:focus-visible:ring-destructive/40
`

const FIELD_DISABLED_MIXIN = `
group-data-disabled/root:cursor-not-allowed 
group-data-disabled/root:border-blue-400
disabled:cursor-not-allowed 
disabled:border-neutral-400
`

const baseClasses = `
flex bg-card
w-full min-w-0 min-h-16 
px-[0.5em] py-[0.25em]
rounded-[0.375em]
border outline-none
placeholder:text-muted-foreground
transition-[color,box-shadow]
field-sizing-content
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_VALID_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_DISABLED_MIXIN}
`

/* ======================
    textareaVariants
====================== */

export const textareaVariants = cva(baseClasses, {
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

export type TextAreaBaseProps = React.ComponentProps<'textarea'> & {
  invalid?: boolean
} & VariantProps<typeof textareaVariants>

/* ========================================================================

======================================================================== */

export const TextAreaBase = ({
  className,
  disabled = false,
  fieldSize,
  ...otherProps
}: TextAreaBaseProps) => {
  /* ======================
          return
  ====================== */

  return (
    <textarea
      data-slot='textarea'
      disabled={disabled}
      className={cn(textareaVariants({ fieldSize }), className)}
      {...otherProps}
    />
  )
}
