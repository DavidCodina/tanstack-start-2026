import type { TableContainerProps, TableVariant } from './types'

import { cn } from '@/utils'

/* ========================================================================

======================================================================== */

export const TableContainer = ({
  children,
  className = '',
  variant,
  ...otherProps
}: TableContainerProps & {
  variant: TableVariant | undefined
}) => {
  return (
    <div
      {...otherProps}
      className={cn(
        'shadcn-table-container rounded-xl',

        {
          '[--table-border-color:var(--color-primary)]': variant === 'primary',
          '[--table-border-color:var(--color-secondary)]':
            variant === 'secondary'
        },
        className
      )}
      // style={{ borderRadius: 15, WebkitOverflowScrolling: 'touch' }}
    >
      {' '}
      {children}
    </div>
  )
}
