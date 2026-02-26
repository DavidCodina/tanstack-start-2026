import { cn } from '@/utils'

export type RadioGroupLabelProps = React.ComponentProps<'div'>

// Rely on group/root defined in FieldRoot.
const baseClasses = `
not-group-data-validating/root:group-data-invalid/root:not-group-data-disabled/root:text-destructive
not-group-data-validating/root:group-data-valid/root:not-group-data-disabled/root:text-success
group-data-disabled/root:text-neutral-400
`

/* ========================================================================

======================================================================== */

export const RadioGroupLabel = ({
  className,
  ...otherProps
}: RadioGroupLabelProps) => {
  return (
    <div
      {...otherProps}
      data-slot='group-label'
      className={cn(baseClasses, className)}
    />
  )
}
