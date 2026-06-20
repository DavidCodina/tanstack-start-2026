import { IndeterminateCheckbox } from './IndeterminateCheckbox'
import { Checkbox } from './Checkbox'

import type { ColumnSelectionProps } from '../types'

import { cn } from '@/utils'

const checkGroupClasses = `flex gap-2 items-center`

/* ========================================================================

======================================================================== */
//# Refine this to columnSelectionContainerProps and so on...

export const ColumnSelection = ({
  className = '',
  disabled = false,
  enableColumnSelection,
  style = {},
  tableInstance,
  variant,
  ...otherProps
}: ColumnSelectionProps) => {
  /* ======================
  renderIndeterminateCheckbox()
  ====================== */

  const renderIndeterminateCheckbox = () => {
    return (
      <div className={cn(checkGroupClasses)}>
        <IndeterminateCheckbox
          //# aria-label=""
          //# aria-labelledby=""
          disabled={disabled}
          id='table-toggle-all-columns' // Should match associated label's htmlFor
          {...{
            indeterminate: tableInstance.getIsSomeColumnsVisible(),
            checked: tableInstance.getIsAllColumnsVisible(),
            onChange: tableInstance.getToggleAllColumnsVisibilityHandler()
          }}
          variant={variant}
        />
        <label
          className={cn(
            disabled
              ? 'pointer-events-none text-(--table-disabled-color)'
              : 'cursor-pointer'
          )}
          htmlFor='table-toggle-all-columns'
        >
          Toggle All
        </label>
      </div>
    )
  }

  /* ======================
  renderColumnCheckboxes()
  ====================== */

  const renderColumnCheckboxes = () => {
    return tableInstance.getAllLeafColumns().map((column) => {
      // Once we add the type definitions to the components we shouldn't need to do as Table<any>.
      // column is of type Column<any, unknown>
      return (
        <div className={checkGroupClasses} key={column.id}>
          <Checkbox
            id={column.id}
            disabled={disabled}
            //# aria-label=""
            //# aria-labelledby=""
            {...{
              type: 'checkbox',
              checked: column.getIsVisible(),
              onChange: column.getToggleVisibilityHandler()
            }}
            variant={variant}
          />{' '}
          <label
            className={cn(
              disabled
                ? 'pointer-events-none text-(--table-disabled-color)'
                : 'cursor-pointer'
            )}
            htmlFor={column.id}
          >
            {/* 
              This exposes the actual data keys to the end user. This may not be ideal.
              The Table --> Controls component could receive a visibilityCheckLabels 
              array that provides transformations for each associated label. For example:
              [ { id: 'first_name', formatted: 'First Name' }, { id: 'last_name', formatted: 'Last Name'}, ... ]
              */}
            {column.id}
          </label>
        </div>
      )
    })
  }

  /* ======================
          return 
  ====================== */

  if (!enableColumnSelection) {
    return null
  }

  return (
    <div
      {...otherProps}
      style={{
        fontSize: 12,
        padding: 5.5,
        ...style
      }}
      className={cn(
        'flex w-full flex-wrap justify-center gap-2.5 rounded border text-sm select-none',
        className,
        !disabled && variant === 'primary' && 'border-primary',
        !disabled && variant === 'secondary' && 'border-secondary',
        disabled && 'border-(--table-disabled-color)'
      )}
    >
      {renderIndeterminateCheckbox()}
      {renderColumnCheckboxes()}
    </div>
  )
}
