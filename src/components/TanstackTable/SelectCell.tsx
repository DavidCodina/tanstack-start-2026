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

const baseClasses = `
border bg-card
w-full min-w-[150px]
rounded-md border px-2 py-1 text-sm outline-none 
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

type SelectCellProps = React.ComponentProps<'select'> & {
  context: CellContext<any, string | number | undefined>
}

type UpdateDatdaArg = {
  rowIndex: number
  columnId: string | number
  value: any
}

type UpdateData = (arg: UpdateDatdaArg) => void

/* ========================================================================

======================================================================== */

export const SelectCell = ({
  children,
  className = '',
  context,
  ...otherProps
}: SelectCellProps) => {
  const { column, getValue, row, table } = context
  const tableValue = getValue()

  const tableMeta = table.options.meta
  // const columnMeta = column.columnDef.meta

  // The updateData() function is hardcoded in the useReactTable options.
  // The check here is merely to appease TypeScript.
  const updateData =
    tableMeta && 'updateData' in tableMeta
      ? (tableMeta.updateData as UpdateData)
      : undefined

  /* ======================
      state & refs
  ====================== */

  const [value, setValue] = React.useState(tableValue)

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

  return (
    <select
      {...otherProps}
      className={cn(baseClasses, className)}
      value={value as string}
      onChange={(e) => {
        const newValue = e.target.value

        setValue(newValue)

        if (typeof updateData === 'function') {
          updateData({
            rowIndex: row.index,
            columnId: column.id,
            value: newValue
          })
        }
      }}
    >
      {children}
    </select>
  )
}
