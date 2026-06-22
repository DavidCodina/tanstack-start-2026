import { GlobalFilter } from '../GlobalFilter'
import { Pagination } from '../Pagination'
import { ExportCSVButton } from '../ExportCSVButtton'
import { ColumnSelection } from '../ColumnSelection'

import type { Table as TableInstance } from '@tanstack/react-table'

import type {
  ColumnFilterProps,
  GlobalFilterProps,
  TableVariant
} from '../types'

import { cn } from '@/utils'

type ControlsProps = {
  tableInstance: TableInstance<Record<string, any>>
  disabled?: boolean
  variant?: TableVariant

  size?: 'xs' | 'sm'

  showControls: boolean
  noControlsShown: boolean

  /* =================== */

  enableColumnSelection?: boolean

  /* =================== */

  globalFilterProps: GlobalFilterProps
  enableGlobalFilter: boolean

  /* =================== */

  columnFilterProps?: Omit<ColumnFilterProps, 'column'>

  /* =================== */

  enablePagination: boolean
  pageIndex?: number
  pageSize: number
  pageSizes?: number[]

  /* =================== */

  csvExportFileName?: string
  csvHeaders?: any[]
  showExportCSVButton?: boolean
}

/* ========================================================================

======================================================================== */

export const Controls = ({
  disabled = false,

  enableColumnSelection = true,

  size,

  variant,

  /* =================== */

  globalFilterProps, // Don't set default here!
  enableGlobalFilter, // Don't set default here!
  // columnFilterProps = {},

  // //# Some kind of props for Pagination component.
  // //# Some kind of props for ColumnSelection component.

  /* =================== */

  enablePagination = true,
  pageSize, // pageSize: pageSizeProp = 10,
  // pageIndex = 0,
  pageSizes = [10, 20, 30, 40, 50], // Note: pageSize will also added to the page size <select> during the mapping process.

  /* =================== */

  showControls = true,
  noControlsShown = false,

  // /* =================== */

  showExportCSVButton = true,
  csvExportFileName = '',
  csvHeaders,

  tableInstance
}: ControlsProps) => {
  /* ======================
    renderExportCSVButton()
  ====================== */

  const renderExportCSVButton = () => {
    if (showExportCSVButton === false) {
      return null
    }

    // Get data
    const data = tableInstance.options?.data

    // Get selected data
    const flatRows = tableInstance.getSelectedRowModel().flatRows
    const selectedData = flatRows.map((flatRow) => {
      return flatRow.original
    })

    const isSelectedData =
      Array.isArray(selectedData) && selectedData.length > 0

    // Set data to selectedData if it exists. Otherwise, default to entire dataset.
    const csvData = isSelectedData ? selectedData : data

    return (
      <ExportCSVButton
        //# className={exportCSVButtonClassName || 'xx-table-export-csv-button'}
        csvHeaders={csvHeaders}
        data={csvData}
        disabled={false}
        fileName={csvExportFileName}
        //# style={exportCSVButtonStyle}
      />
    )
  }

  /* ======================
          return
  ====================== */
  //# Test responsiveness against different viewport sizes.

  if (!showControls || noControlsShown) return null

  return (
    <section className='bg-card flex flex-col gap-3 border-b border-(--table-border-color) p-3'>
      <div className={cn('flex flex-wrap items-start justify-center gap-3')}>
        <GlobalFilter
          {...globalFilterProps}
          className={cn(
            {
              'text-xs': size === 'xs',
              'text-sm': size === 'sm'
            },
            globalFilterProps?.className
          )}
          disabled={disabled}
          enableGlobalFilter={enableGlobalFilter}
        />

        {enablePagination && (
          <Pagination
            disabled={disabled}
            pageSize={pageSize}
            pageSizes={pageSizes}
            tableInstance={tableInstance}
            variant={variant}
          />
        )}

        {renderExportCSVButton()}
      </div>

      <ColumnSelection
        disabled={disabled}
        enableColumnSelection={enableColumnSelection}
        tableInstance={tableInstance}
        variant={variant}
      />
    </section>
  )
}
