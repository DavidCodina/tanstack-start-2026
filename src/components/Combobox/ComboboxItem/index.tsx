import { Combobox } from '@base-ui/react/combobox'
import { CheckIcon } from './CheckIcon'
import type { StrictItem } from '../types'
import { cn } from '@/utils'

const baseClasses = `
grid grid-cols-[0.75rem_1fr] items-center gap-2
py-[0.25em] pl-4 pr-4
cursor-pointer
text-sm leading-[1.5] select-none outline-none 
data-highlighted:relative
data-highlighted:text-white
data-highlighted:z-0
data-highlighted:before:absolute
data-highlighted:before:inset-x-2
data-highlighted:before:inset-y-0
data-highlighted:before:bg-primary
data-highlighted:before:rounded
data-highlighted:before:z-[-1]
`

type ComboboxItemProps = Omit<Combobox.Item.Props, 'value'> & {
  value: StrictItem
}

/* ========================================================================

======================================================================== */

export const ComboboxItem = ({
  className,
  value: item,
  ...otherProps
}: ComboboxItemProps) => {
  /* ======================
          return
  ====================== */

  return (
    <Combobox.Item
      children={
        <>
          <Combobox.ItemIndicator className='col-start-1'>
            <CheckIcon className='size-[0.875em]' />
          </Combobox.ItemIndicator>
          <div className='col-start-2'>{item.label || item.value}</div>
        </>
      }
      {...otherProps}
      data-slot='combobox-item'
      className={(comboboxItemState) => {
        if (typeof className === 'function') {
          className = className(comboboxItemState) || ''
        }
        return cn(baseClasses, className)
      }}
      ///////////////////////////////////////////////////////////////////////////
      //
      // This part is weird. We're actually passing the entire item as the value,
      // instead of passing item.value. In the Combobox.Root props, we have:
      //
      //   onValueChange: (value, _eventDetails) => {
      //     console.log('onValueChange:', value) // => {label: 'Mango', value: 'mango'}
      //   },
      //
      //   onInputValueChange: (inputValue, _eventDetails) => {
      //     console.log('onInputValueChange:', inputValue) // => 'Mango'
      //   }
      //
      // The docs don't really explain this, but Base UI's Combobox is designed
      // to work with objects as values, not primitive strings.
      //
      // The Implicit Contract:
      // The fact that the item.label is used as what's displayed in the input's UI and
      // that item.value is what's passed as inputValue in the onInputValueChange suggests
      // that type Item is actually expected. Unforunately, Combobox.Root items is typed as
      //
      //   items?: readonly any[] | readonly Group<any>[] | undefined
      //
      // And value here is typed as value?: any. So... Why is the typing so loose?
      // Presumably, this has to do with other props on Combobox.Root that make the overall
      // component implementation much more flexible.
      //
      //   - isItemEqualToValue
      //   - itemToStringLabel
      //   - itemToStringValue
      //
      // So... The typing is intentionally loose to allow for maximum flexibility, and those props
      // are indeed the key to understanding how Base UI's Combobox handles different item shapes.
      // In fact, the { value, label } default is mentioned (albeit not immediately obvious) in the
      // prop description of Combobox.Root's itemToStringLabel and itemToStringValue.
      //
      // Why the loose typing?
      //
      // Because you can use ANY item shape - primitives, objects, whatever.
      // You customize behavior with these props:
      //
      //   - itemToStringLabel: converts item → display string for input
      //   - itemToStringValue: converts item → string for form submission
      //   - isItemEqualToValue: custom equality comparison
      //
      // Convenience defaults - If you use { label, value } objects, it "just works"
      // without configuration.
      //
      ///////////////////////////////////////////////////////////////////////////

      value={item}
      // ❌ value={item.value}
    />
  )
}

/* ======================
  itemMappingCallback()
====================== */
// This is actually a bit different from other implementations in that, we're
// not actually mapping over the items. Instead, we're passing the function that
// is passed to the Combobox.List: ((item: any, index: number) => React.ReactNode)
// In practice, the itemMappingCallback never explicitly calls and passes item.
// Instead, we just do this: {itemMappingCallback}
// This means that in practice, TypeScript never truly sees if item is a StrictItem.

/** A helper function that receives an item object and returns a ComboboxItem.
 * Do not call this function. Instead, pass it as children to Combobox or
 * comboboxListProps.children.
 */

export const itemMappingCallback = (item: StrictItem, _index: number) => {
  const isId = typeof item.id === 'string' || typeof item.id === 'number'

  // There's a possible edge case where two items item.value may be the same.
  // However, this is arguably less likely than the other potential issue whereby the
  // list order changes or items are added/removed. In cases where no item.id exists,
  // and values are potentially the same AND you know the list size or order won't
  // change, then you can map over the original items in advance and map that index
  // to an id property to create a transformed items list.
  const key = isId ? item.id : item.value

  ///////////////////////////////////////////////////////////////////////////
  //
  // "The index of the item in the list. Improves performance when specified
  // by avoiding the need to calculate the index automatically from the DOM."
  //
  // However, when one provides the index prop explicitly, Base UI likely uses
  // it to manage which item should be highlighted based on keyboard navigation state.
  // The issue is that this internal index-based highlighting system seems to be conflicting
  // with the CSS-based hover styles.
  //
  ///////////////////////////////////////////////////////////////////////////

  return (
    <ComboboxItem
      key={key}
      // ❌ index={index}
      value={item}
    />
  )
}
