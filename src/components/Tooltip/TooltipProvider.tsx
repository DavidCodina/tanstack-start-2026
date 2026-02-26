import { Tooltip } from '@base-ui/react/tooltip'

export type TooltipProviderProps = Tooltip.Provider.Props

/* ========================================================================

======================================================================== */

export const TooltipProvider = (props: TooltipProviderProps) => {
  return <Tooltip.Provider {...props} />
}
