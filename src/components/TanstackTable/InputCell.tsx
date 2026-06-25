import * as React from 'react'

import type { CellContext } from '@tanstack/react-table'
import { cn } from '@/utils'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-(--table-border-color)
focus-visible:ring-[3px]
focus-visible:ring-(--table-border-color)/40
`

const FIELD_DISABLED_MIXIN = `
disabled:pointer-events-none
disabled:border-(--table-disabled-color)
disabled:placeholder:text-(--table-disabled-color)
disabled:opacity-65
`

// Don't set text-base here. Instead, let the input inherit the size from the table.
const baseClasses = `
flex bg-card
w-full min-w-[180px]
px-[0.5em] py-[0.25em]
leading-[1.5] font-normal
border border-(--table-border-color) outline-none
rounded-[0.375em]
text-ellipsis overflow-hidden
placeholder:text-muted-foreground
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

type InputCellProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  context: CellContext<any, string | number | undefined>

  /** Passing the specific type is crucial not just for the input attribute, but it also dictates
   * how the value is derived and validated internally. For this reason, it's required.
   */
  type: 'text' | 'number'
}

type UpdateDatdaArg = {
  rowIndex: number
  columnId: string | number
  value: any
}

type UpdateData = (arg: UpdateDatdaArg) => void

/* ========================================================================

======================================================================== */
// ⚠️ What if the value is a string, but the string is a number like "$123.45"?
// In that case, we may want to build a more custom InputCell to carefully
// handle what kinds of values are allowed.

//# What if the underlying value was a boolean?
//# Let's build radios that look like buttons and have values
//# of 'true'/'false', but when selected the actual value they set is true/false.
//# Build a prototype, then feed it into v0 to improve.

//# Alternatively, have a single button that toggles between true/false.
//# Call it EditableBooleanCell.

//# The v0 demo also had an "Add Row" feature...

export const InputCell = ({
  className = '',
  context,
  type = 'text',
  ...otherProps
}: InputCellProps) => {
  const { column, getValue, row, table } = context
  const allowedTypes = ['string', 'number']

  ///////////////////////////////////////////////////////////////////////////
  //
  // Mitigate possible errors resulting from a null value, or any other value
  // that is not string | number.
  //
  //   ❌ The `value` prop on `input` should not be null. Consider using an empty
  //   string to clear the component or `undefined` for uncontrolled components.
  //
  // In such cases, use undefined instead. However, it's also important to not actually
  // pass that value to updateData()
  //
  ///////////////////////////////////////////////////////////////////////////

  let tableValue = getValue()

  if (!allowedTypes.includes(typeof tableValue)) {
    // Don't set to undefined. While that's better than null, it still causes issues for type="number".
    tableValue = ''
  }

  const tableMeta = table.options.meta
  // const columnMeta = column.columnDef.meta

  // The updateData() function is hardcoded in the useReactTable
  // options. The check here is merely to appease TypeScript.
  const updateData =
    tableMeta && 'updateData' in tableMeta
      ? (tableMeta.updateData as UpdateData)
      : undefined

  ///////////////////////////////////////////////////////////////////////////
  //
  // There's actually no need for variant or size. Why? Because the Tailwind styles use --table-border-color,
  // which itself hooks into the current theme color. Additionally, size is derived entirely from the inherited
  // font size.
  //
  // const _variant = tableMeta && 'variant' in tableMeta && typeof tableMeta.variant === 'string' ? tableMeta.variant : undefined
  // const _size = tableMeta && 'size' in tableMeta && typeof tableMeta.size === 'string' ? tableMeta.size : undefined
  //
  ///////////////////////////////////////////////////////////////////////////

  const disabled =
    tableMeta &&
    'disabled' in tableMeta &&
    typeof tableMeta.disabled === 'boolean'
      ? tableMeta.disabled
      : false

  // Following the initial value of editable state in the main TanStackTable component.
  // it makes the most sense to default to false. However, the default here should never
  // actually get used, because in fact there's always a value for tableMeta.editable.
  const editable =
    tableMeta &&
    'editable' in tableMeta &&
    typeof tableMeta.editable === 'boolean'
      ? tableMeta.editable
      : false

  /* ======================
      state & refs
  ====================== */

  const isValidRef = React.useRef(true)
  const [value, setValue] = React.useState(tableValue)

  /* ======================
        handleBlur()
  ====================== */

  const handleBlur = () => {
    if (
      (type === 'number' && typeof value !== 'number') ||
      (type === 'text' && typeof value !== 'string')
    ) {
      isValidRef.current = false
    }

    if (isValidRef.current === false) {
      setValue(tableValue)
      return
    }

    if (typeof updateData === 'function') {
      updateData({
        rowIndex: row.index,
        columnId: column.id,
        value: value
      })
    }
  }

  /* ======================
         useEffect()
  ====================== */
  // Ensure local state is in sync with outer table state.
  // This kind of seems redundant, but it's a good failsafe.

  React.useEffect(() => {
    setValue(tableValue)
  }, [tableValue])

  /* ======================
          return
  ====================== */

  if (editable !== true) {
    return tableValue
  }

  return (
    <input
      {...otherProps}
      className={cn(baseClasses, className)}
      disabled={disabled}
      onBlur={handleBlur}
      onChange={(e) => {
        isValidRef.current = true

        const newValue =
          type === 'number' ? e.target.valueAsNumber : e.target.value

        if (
          type === 'number' &&
          (typeof newValue !== 'number' || isNaN(newValue))
        ) {
          isValidRef.current = false

          setValue('')
          return
        }

        setValue(newValue)
      }}
      type={type}
      value={value}
    />
  )
}
