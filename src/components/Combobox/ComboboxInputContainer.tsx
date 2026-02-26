import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const baseClasses = `relative`

/* ======================
comboboxInputContainerVariants
====================== */
// Initially, this was on ComboboxInput. However, in order for the
// ComboboxControlsContainer, ComboboxTrigger and ComboboxClear sizing
// and spacing em units to work correctly, the variants needed to be
// moved up. While this is the correct location, it's less obvious that
// fieldSize is a prop on ComboboxInputContainer.

const comboboxInputContainerVariants = cva(baseClasses, {
  variants: {
    fieldSize: {
      xs: `text-xs leading-[1.5] has-[[data-slot='combobox-clear']]:[&>input]:pr-[2rem]`,
      sm: `text-sm leading-[1.5] has-[[data-slot='combobox-clear']]:[&>input]:pr-[2.25rem]`,
      md: `text-base leading-[1.5] has-[[data-slot='combobox-clear']]:[&>input]:pr-[2.75rem]`,
      lg: `text-lg leading-[1.5] has-[[data-slot='combobox-clear']]:[&>input]:pr-[3rem]`,
      xl: `text-xl leading-[1.5] has-[[data-slot='combobox-clear']]:[&>input]:pr-[3rem]`
    },
    defaultVariants: {
      fieldSize: 'md'
    }
  }
})

export type ComboboxInputContainerProps = React.ComponentProps<'div'> &
  VariantProps<typeof comboboxInputContainerVariants>

/* ========================================================================

======================================================================== */
// This div wraps the Combobox.Input, Combobox.Clear and Combobox.Trigger,
// allowing the Clear and Trigger to be positioned absolutely.

export const ComboboxInputContainer = ({
  className,
  fieldSize,
  ...otherProps
}: ComboboxInputContainerProps) => {
  return (
    <div
      {...otherProps}
      data-slot='combobox-input-container'
      className={cn(comboboxInputContainerVariants({ fieldSize }), className)}
    />
  )
}
