import { Combobox } from '@base-ui/react/combobox'
import type { StrictItem } from './types'

export type ComboboxRootProps = Omit<
  React.ComponentProps<typeof Combobox.Root>,
  'items'
> & {
  items?: StrictItem[]
}

/* ========================================================================

======================================================================== */
// Doesn't render its own HTML element.

export const ComboboxRoot = (props: ComboboxRootProps) => {
  return <Combobox.Root {...props} />
}
