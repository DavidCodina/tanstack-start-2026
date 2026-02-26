import { Combobox } from '@base-ui/react/combobox'
import { X } from 'lucide-react'
import type { StrictItem } from './types'
import { cn } from '@/utils'

export type ComboboxChipProps = Combobox.Chip.Props & {
  item: StrictItem
}

///////////////////////////////////////////////////////////////////////////
//
// The Base UI Combobox.Chip is not intended to be directly tabbable. The
// <div> receives tabindex="-1" in the DOM. Moreover, the Combobox.ChipRemove
// also receives tabindex="-1". However, the Base UI documentation example
// provides these styles:
//
//   focus-within:bg-blue-800
//   focus-within:text-gray-50"
//
// Pressing back arrow from the <input> moves to the last chip, and
// pressing back again moves to the second-to-last chip. From there, one
// can press delete to selectively delete a chip. However, nothing in
// the DOM indicates that a particular chip is currently selected
// (i.e., no data-active attribute, etc.).
//
//   https://github.com/mui/base-ui/issues/4011
//
// In practice, focus IS set programmatically on the Chip. This is why
// focus-visible also works. Nonetheless, it still makes sense to use
// focus-within if focus ever moved from the Chip to it's ChipRemove.
//
///////////////////////////////////////////////////////////////////////////

const baseClasses = `
flex items-center gap-[0.25em]
px-[0.25em]
text-[0.875em]
bg-card
border border-foreground 
rounded-md cursor-default
outline-none
focus-within:bg-primary
focus-within:text-white
focus-within:border-primary
`

/* ========================================================================

======================================================================== */

export const ComboboxChip = ({
  className = '',
  item,
  ...otherProps
}: ComboboxChipProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Combobox.Chip
      children={
        <>
          {item.label || item.value}
          <Combobox.ChipRemove
            aria-label='Remove'
            className='hover:bg-destructive/75 cursor-pointer rounded-[0.25em] p-[0.125em] hover:text-white focus-visible:outline-2 focus-visible:outline-pink-500'
          >
            <X className='size-[1em]' />
          </Combobox.ChipRemove>
        </>
      }
      {...otherProps}
      aria-label={item.label || item.value}
      data-slot='combobox-chip'
      className={(comboboxChipState) => {
        if (typeof className === 'function') {
          className = className(comboboxChipState) || ''
        }
        return cn(baseClasses, className)
      }}
    />
  )
}
