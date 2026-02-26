import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot='sheet-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}
