import { useRender } from '@base-ui/react/use-render'
// import { mergeProps } from '@base-ui/react/merge-props'

import { badgeVariants } from './badgeVariants'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

type BadgeProps = useRender.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants>

/* ========================================================================

======================================================================== */

function Badge({ className = '', render, variant, ...otherProps }: BadgeProps) {
  const view = useRender({
    defaultTagName: 'span',
    render,
    props: {
      ...otherProps,
      'data-slot': 'badge',
      className: cn(badgeVariants({ variant }), className)
    }
  })

  return view
}

export { Badge, badgeVariants }
