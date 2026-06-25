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

//# What actually happens if the initial value is null?
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
//# This EditableCell may still be somewhat naive.
//# What if the underlying value was a boolean?
//# In that case, we may want a custom component just for booleans,
//# or we may need some additional logic here.

//# The v0 demo also had an "Add Row" feature...

export const InputCell = ({
  className = '',
  context,
  type = 'text',
  ...otherProps
}: InputCellProps) => {
  const { column, getValue, row, table } = context
  const tableValue = getValue()

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
    if (isValidRef.current === false) {
      const oldValue = getValue()
      setValue(oldValue)
      return
    }

    //# Think about how you'd want to transform values.
    //# This is a good start, but we'd want some kind of meta property
    //# to opt into transformations, or actually have a transformation method on meta.
    // const transformedValue = (() => {
    //   if (value === 'true') {
    //     return true
    //   }
    //   if (value === 'false') {
    //     return false
    //   }
    //   return value
    // })()

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
          typeof newValue === 'number' &&
          isNaN(newValue)
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
