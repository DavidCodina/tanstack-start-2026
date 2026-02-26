import { Popover } from '@base-ui/react/popover'
import { cn } from '@/utils'

export type PopoverTitleProps = Popover.Title.Props

const baseClasses = `font-medium`

/* ========================================================================

======================================================================== */

export const PopoverTitle = ({
  className = '',
  ...otherProps
}: PopoverTitleProps) => {
  return (
    <Popover.Title
      {...otherProps}
      data-slot='popover-title'
      className={(popoverTitleState) => {
        if (typeof className === 'function') {
          className = className(popoverTitleState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
