import { Combobox } from '@base-ui/react/combobox'

export type ComboboxValueProps = Combobox.Value.Props

/* ========================================================================

======================================================================== */
// The current value of the combobox. Doesn't render its own HTML element.

export const ComboboxValue = (props: ComboboxValueProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Combobox.Value
      {...props}
      // ❌ data-slot='combobox-value'
    />
  )
}
