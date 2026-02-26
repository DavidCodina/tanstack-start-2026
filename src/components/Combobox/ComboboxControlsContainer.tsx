import { cn } from '@/utils'

const baseClasses = `
flex items-center justify-center
h-full absolute top-0 right-[0.25em]  
`

export type ComboboxControlsContainerProps = React.ComponentProps<'div'>

/* ========================================================================

======================================================================== */

export const ComboboxControlsContainer = ({
  className,
  ...otherProps
}: ComboboxControlsContainerProps) => {
  return (
    <div
      {...otherProps}
      data-slot='combobox-controls-container'
      className={cn(baseClasses, className)}
    />
  )
}
