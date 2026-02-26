import { Popover } from '@base-ui/react/popover'

export type PopoverRootProps = Popover.Root.Props

/* ========================================================================

======================================================================== */
// Groups all parts of the popover. Doesn’t render its own HTML element.

export const PopoverRoot = (props: PopoverRootProps) => {
  return <Popover.Root {...props} data-slot='popover-root' />
}
