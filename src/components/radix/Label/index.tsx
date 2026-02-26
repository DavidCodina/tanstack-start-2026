'use client'

import * as React from 'react'

import { cn } from '@/utils'

type LabelProps = React.ComponentProps<'label'> & {
  disabled?: boolean
  error?: string
  labelRequired?: boolean
  // Omit touched to prevent success styles.
  touched?: boolean
}

const baseClasses = `
flex items-center text-sm leading-none 
font-medium select-none
`

/* ========================================================================

======================================================================== */

export const Label = ({
  className,
  children,
  disabled = false,
  error = '',
  labelRequired,
  ref,
  // It may seem more conventional to use something like `isValid`, but
  // the combination of `error` and `touched` allows for maximum flexibility.
  touched = false,
  ...otherProps
}: LabelProps) => {
  const labelRef = React.useRef<HTMLLabelElement | null>(null)

  /* ======================
          return
  ====================== */

  return (
    <label
      ref={(node) => {
        if (ref && 'current' in ref) {
          ref.current = node
        } else if (typeof ref === 'function') {
          ref?.(node)
        }
        labelRef.current = node
      }}
      data-slot='label'
      className={cn(baseClasses, className, {
        // Intentionally placed after className to always have precedence.
        'text-destructive': !!error,
        'text-success': !error && touched,
        'text-muted-foreground pointer-events-none opacity-65': disabled
      })}
      {...otherProps}
    >
      {children}

      {labelRequired && (
        <sup
          className={cn('text-destructive relative -top-1 text-[1.25em]', {
            'text-success': !error && touched,
            'text-inherit': disabled
          })}
        >
          *
        </sup>
      )}
    </label>
  )
}
