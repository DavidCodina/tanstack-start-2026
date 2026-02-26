import { Select } from '@base-ui/react/select'
import { CheckIcon } from './CheckIcon'
import { cn } from '@/utils'

type SelectItemTextProps = Select.ItemText.Props
type SelectItemIndicatorProps = Select.ItemIndicator.Props
export type SelectItemProps = Select.Item.Props & {
  selectItemTextProps?: SelectItemTextProps
  selectItemIndicatorProps?: SelectItemIndicatorProps
}

// group is on SelectPopup
// When does group-data-[side=none] happen?
// From what I've seen, it happens when alignItemWithTrigger={true}
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

/* ========================================================================

======================================================================== */

export const SelectItem = ({
  /** Pass children directly for convenience, or use selectItemTextProps.children. */
  children,
  className = '',
  selectItemTextProps = {},
  selectItemIndicatorProps = {},
  value,
  ...otherProps
}: SelectItemProps) => {
  /* ======================
    renderItemIndicator()
  ====================== */

  const renderItemIndicator = () => {
    return (
      <Select.ItemIndicator
        {...selectItemIndicatorProps}
        data-slot='select-item-indicator'
        className={(selectItemIndicatorState) => {
          if (typeof selectItemIndicatorProps.className === 'function') {
            selectItemIndicatorProps.className =
              selectItemIndicatorProps.className(selectItemIndicatorState) || ''
          }
          return cn('col-start-1', selectItemIndicatorProps.className)
        }}
      >
        <CheckIcon className='size-[0.875em]' />
      </Select.ItemIndicator>
    )
  }

  /* ======================
    renderItemText()
  ====================== */

  const renderItemText = () => {
    const allSelectItemTextProps = {
      children,
      ...selectItemTextProps
    }
    return (
      <Select.ItemText
        {...allSelectItemTextProps}
        data-slot='select-item-text'
        className={(selectItemTextState) => {
          if (typeof selectItemTextProps.className === 'function') {
            selectItemTextProps.className =
              selectItemTextProps.className(selectItemTextState) || ''
          }
          return cn('col-start-2', selectItemTextProps.className)
        }}
      />
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <Select.Item
      {...otherProps}
      data-slot='select-item'
      className={(selectItemState) => {
        if (typeof className === 'function') {
          className = className(selectItemState) || ''
        }
        return cn(baseClasses, className)
      }}
      value={value}
    >
      {renderItemIndicator()}
      {renderItemText()}
    </Select.Item>
  )
}
