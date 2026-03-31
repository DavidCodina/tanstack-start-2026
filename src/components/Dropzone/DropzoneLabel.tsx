'use client'

import type { DropzoneLabelProps } from './types'
import { cn } from '@/utils'

const baseClasses = `
group
flex items-center 
leading-none select-none
w-fit cursor-pointer
mb-1 text-sm font-medium
`

/* ========================================================================

======================================================================== */

export const DropzoneLabel = ({
  children,
  disabled = false,
  error = '',
  htmlFor,
  className = '',
  labelRequired = false,
  touched = false,
  ...otherProps
}: DropzoneLabelProps) => {
  /* ======================
          constants 
  ====================== */

  // Needs to match DropzoneBase.tsx
  const isInvalid = !!error
  const isValid = !error && touched

  /* ======================
          return
  ====================== */

  if (!children) {
    return null
  }

  return (
    <label
      {...otherProps}
      htmlFor={htmlFor}
      className={cn(
        baseClasses,
        className,
        isInvalid && 'text-destructive',
        isValid && 'text-success',
        disabled && 'text-muted-foreground opacity-65' // ???
      )}
    >
      {children}
      {labelRequired && (
        <sup
          className={cn(
            'text-destructive relative -top-0.5 text-[1.25em]',
            isInvalid && 'text-destructive',
            isValid && 'text-success',
            disabled && 'text-inherit'
            // 'not-group-data-validating/root:group-data-valid:not-group-data-disabled:text-success',
            // 'group-data-disabled:text-inherit'
          )}
        >
          *
        </sup>
      )}
    </label>
  )
}
