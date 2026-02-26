import { Tooltip } from '@base-ui/react/tooltip'

export type TooltipRootProps = Tooltip.Root.Props

/* ========================================================================

======================================================================== */
// Groups all parts of the tooltip. Doesn’t render its own HTML element.

export const TooltipRoot = (props: TooltipRootProps) => {
  return <Tooltip.Root {...props} />
}
