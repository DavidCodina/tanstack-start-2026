import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { SHEET_ZINDEX_CLASS } from '../component-constants'
import { cn } from '@/utils'

// ⚠️ The exit animation doesn't really work.
// This is probably because SheetOverlay unmounts before the animation completes.
// Removed: supports-backdrop-filter:backdrop-blur-xs
const baseClasses = `
data-open:animate-in data-open:fade-in-0
data-closed:animate-out data-closed:fade-out-0
data-starting-style:opacity-0
data-ending-style:opacity-0
fixed inset-0 bg-black/65 duration-500
${SHEET_ZINDEX_CLASS}
`

/* ========================================================================

======================================================================== */

export function SheetOverlay({
  className,
  style = {},
  ...props
}: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot='sheet-overlay'
      className={cn(baseClasses, className)}
      style={style}
      {...props}
    />
  )
}
