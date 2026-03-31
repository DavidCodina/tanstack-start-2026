'use client'

import type { DropzoneErrorProps } from './types'
import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const DropzoneError = ({
  children,
  className = '',
  disabled = false,
  error = '',
  touched = false,
  ...otherProps
}: DropzoneErrorProps) => {
  /* ======================
          constants 
  ====================== */

  // Needs to match DropzoneBase.tsx
  const _isInvalid = !!error
  const _isValid = !error && touched

  /* ======================
          return
  ====================== */

  if (!children) {
    return null
  }
  return (
    <div
      {...otherProps}
      className={cn(
        'text-destructive block',
        className,
        // isInvalid && 'text-destructive',
        // isValid && '',
        disabled && 'text-neutral-400'
      )}
    >
      {children}
    </div>
  )
}
