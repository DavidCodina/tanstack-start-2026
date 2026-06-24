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

// Use flex-1 and not w-full
const baseClasses = `
flex flex-1 bg-card
min-w-[180px]
px-[0.5em] py-[0.25em]
text-base leading-[1.5] font-normal
rounded-[0.375em]
border border-(--table-border-color) outline-none
placeholder:text-muted-foreground
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
`

//# What actually happens if the initial value is null?
type EditableCellProps = CellContext<any, string | number | undefined> & {
  className?: string
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

//# Overall this seems to be working well. However, the next step is to fine-tune the CSS/Tailwind styles

//# The v0 demo also had an "Add Row" feature.

export const EditableCell = ({
  className = '',
  column,
  getValue,
  row,
  table
}: EditableCellProps) => {
  const initialValue = getValue()

  const tableMeta = table.options.meta
  const columnMeta = column.columnDef.meta

  // The updateData() function is hardcoded in the useReactTable options.
  // The check here is merely to appease TypeScript.
  const updateData =
    tableMeta && 'updateData' in tableMeta
      ? (tableMeta.updateData as UpdateData)
      : undefined

  const editableCellType =
    columnMeta && 'editableCellType' in columnMeta
      ? columnMeta.editableCellType
      : 'text'

  const selectOptions =
    columnMeta &&
    'selectOptions' in columnMeta &&
    Array.isArray(columnMeta.selectOptions)
      ? columnMeta.selectOptions
      : []

  /* ======================
      state & refs
  ====================== */

  const isValidRef = React.useRef(true)
  const [value, setValue] = React.useState(initialValue)

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
    setValue(initialValue || '')
  }, [initialValue])

  /* ======================
          return
  ====================== */

  if (editableCellType === 'select') {
    //////////////////////////////////////////////////////////////////////////
    //
    // Example usage from within columns.tsx:
    //
    //   columnHelper.accessor('country', {
    //     cell: EditableCell,
    //     header: () => <span>Country</span>,
    //     sortUndefined: 'last',
    //     meta: {
    //       label: 'Country', // Used by the column select checkbox <label>
    //       editableCellType: 'select',
    //       selectOptions: [
    //         { label: 'United States', value: 'United States' },
    //         { label: 'Canada', value: 'Canada' },
    //         { label: 'Mexico', value: 'Mexico' }
    //       ]
    //     }
    //   })
    //
    //////////////////////////////////////////////////////////////////////////

    return (
      <select
        className='border-input bg-background focus:border-ring focus:ring-ring/30 w-full min-w-[150px] rounded-md border px-2 py-1 text-sm outline-none focus:ring-2'
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
        {selectOptions.map((option, index) => {
          if (
            option &&
            typeof option === 'object' &&
            'value' in option &&
            'label' in option &&
            typeof option.value === 'string' &&
            typeof option.label === 'string'
          ) {
            return (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            )
          }
          return null
        })}
      </select>
    )
  }

  return (
    <input
      className={cn(baseClasses, className)}
      onBlur={handleBlur}
      onChange={(e) => {
        isValidRef.current = true

        const newValue =
          editableCellType === 'number'
            ? e.target.valueAsNumber
            : e.target.value

        if (
          editableCellType === 'number' &&
          typeof newValue === 'number' &&
          isNaN(newValue)
        ) {
          isValidRef.current = false

          setValue('')
          return
        }

        setValue(newValue)
      }}
      type={editableCellType === 'number' ? 'number' : 'text'}
      value={value}
    />
  )
}
