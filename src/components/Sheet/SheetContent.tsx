import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { XIcon } from 'lucide-react'

import { SHEET_ZINDEX_CLASS } from '../component-constants'
import { SheetOverlay } from './SheetOverlay'
import { SheetPortal } from './SheetPortal'
import { cn } from '@/utils'

type SheetContentProps = SheetPrimitive.Popup.Props & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  showCloseButton?: boolean
  sheetOverlayClassName?: string
  sheetOverlayStyle?: React.CSSProperties
}

// Removed: data-open:fade-in-0
// Removed: data-closed:fade-out-0
// Removed: text-sm
// Added: data-open:duration-300
// Added: data-closed:duration-300
// Changed all animations by removing the `-10` suffix.
// Moved all side based styles to cn() function.
const baseClasses = `
data-open:animate-in data-open:duration-300
data-closed:animate-out data-closed:duration-300
bg-background fixed
flex flex-col gap-4 bg-clip-padding
shadow-lg transition ease-in-out 
${SHEET_ZINDEX_CLASS}
`

// export const removed = `
// data-[side=top]:data-closed:slide-out-to-top
// data-[side=top]:data-open:slide-in-from-top
// data-[side=top]:inset-x-0
// data-[side=top]:top-0
// data-[side=top]:h-auto
// data-[side=top]:border-b

// data-[side=right]:data-closed:slide-out-to-right
// data-[side=right]:data-open:slide-in-from-right
// data-[side=right]:right-0
// data-[side=right]:h-full
// data-[side=right]:w-3/4
// data-[side=right]:border-l
// data-[side=right]:inset-y-0
// data-[side=right]:sm:max-w-sm

// data-[side=bottom]:data-closed:slide-out-to-bottom
// data-[side=bottom]:data-open:slide-in-from-bottom
// data-[side=bottom]:inset-x-0
// data-[side=bottom]:bottom-0
// data-[side=bottom]:h-auto
// data-[side=bottom]:border-t

// data-[side=left]:data-closed:slide-out-to-left
// data-[side=left]:data-open:slide-in-from-left
// data-[side=left]:inset-y-0
// data-[side=left]:left-0
// data-[side=left]:h-full
// data-[side=left]:w-3/4
// data-[side=left]:border-r
// data-[side=left]:sm:max-w-sm
// `

const closeButtonClasses = `
absolute top-4 right-4
rounded-xs opacity-70
transition-opacity
cursor-pointer
hover:opacity-100
focus:outline-hidden
focus-visible:ring-[3px]
focus-visible:ring-ring/50
disabled:pointer-events-none
`

/* ========================================================================

======================================================================== */

export function SheetContent({
  className,
  children,

  sheetOverlayClassName = '', // Added.
  sheetOverlayStyle = {}, // Added.
  showCloseButton = true,
  side = 'right',
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay
        className={sheetOverlayClassName}
        style={sheetOverlayStyle}
      />
      <SheetPrimitive.Popup
        data-slot='sheet-content'
        data-side={side}
        className={cn(
          baseClasses,
          side === 'top' &&
            `data-closed:slide-out-to-top data-open:slide-in-from-top inset-x-0 top-0 h-auto border-b`,

          side === 'right' &&
            `data-closed:slide-out-to-right data-open:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm`,

          side === 'bottom' &&
            `data-closed:slide-out-to-bottom data-open:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t`,
          side === 'left' &&
            `data-closed:slide-out-to-left data-open:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm`,

          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot='sheet-close'
            render={<button className={closeButtonClasses} type='button' />}
          >
            <XIcon />
            <span className='sr-only'>Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}
