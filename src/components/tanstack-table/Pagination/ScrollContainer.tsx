import type { ScrollContainerProps } from './types'

import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const ScrollContainer = ({
  children,
  className = '',
  ...otherProps
}: ScrollContainerProps) => {
  return (
    <div
      {...otherProps}
      className={cn('shadcn-table-scroll-container', className)}
    >
      {children}
    </div>
  )
}
