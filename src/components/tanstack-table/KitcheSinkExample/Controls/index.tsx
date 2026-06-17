import { GlobalFilter } from '../GlobalFilter'
import { ExportCSVButton } from '../ExportCSVButtton'
import { IControls } from '../types'
import { IndeterminateCheckbox } from '../IndeterminateCheckbox'
import './index.css'

// This assumes that allelement in numbers are of type number.
const sortNumbersAscending = (numbers: number[]): number[] => {
  return numbers.slice().sort((a, b) => a - b)
}

//  This assumes that numbersArrray is sorted.
const insertNumberIntoOrderdNumbers = (
  n: number,
  numbersArray: number[]
): number[] => {
  if (numbersArray.includes(n)) {
    return numbersArray
  }

  let insertIndex = 0

  while (
    insertIndex < numbersArray.length &&
    typeof numbersArray[insertIndex] === 'number' &&
    (numbersArray[insertIndex] as number) < n
  ) {
    insertIndex++
  }

  // Insert initialPageSize at the correct position
  numbersArray.splice(insertIndex, 0, n)
  return numbersArray
}

/* ========================================================================
                              Controls
======================================================================== */
// None of the props below are given default values here.
// Instead, all default values are set on Table props.

export const Controls = ({
  // className & style props.
  controlsClassName,
  controlsStyle,

  globalFilterClassName,
  globalFilterStyle,

  paginationClassName,
  paginationStyle,
  paginationItemClassName,
  paginationItemStyle,
  paginationButtonClassName,
  paginationButtonStyle,
  pageNumberInputClassName,
  pageNumberInputStyle,
  pageSizeSelectClassName,
  pageSizeSelectStyle,

  exportCSVButtonClassName,
  exportCSVButtonStyle,
  columnSelectCheckboxGroupClassName,
  columnSelectCheckboxGroupStyle,
  columnSelectCheckboxClassName,
  columnSelectCheckboxStyle,
  // Other...
  atLeastOneVisibleColumn,
  noControlsShown,
  globalFilter,
  setGlobalFilter,

  pageSize,
  pageSizes, // Note: pageSize will also added to the page size <select> during the mapping process.
  showControls,
  showGlobalFilter,
  showPagination,
  showExportCSVButton,
  showColumnSelectCheckboxes,
  table,
  csvExportFileName,
  csvHeaders
}: IControls) => {
  pageSizes = Array.isArray(pageSizes)
    ? sortNumbersAscending(pageSizes)
    : pageSizes

  pageSizes =
    typeof pageSize === 'number' && Array.isArray(pageSizes)
      ? insertNumberIntoOrderdNumbers(pageSize, pageSizes)
      : pageSizes

  /* ======================
    renderGlobalFilter()
  ====================== */

  const renderGlobalFilter = () => {
    if (!showGlobalFilter) {
      return null
    }

    return (
      <GlobalFilter
        className={
          globalFilterClassName ||
          'form-control w-[auto] flex-1 rounded border-[#dee2e6] px-2 py-1 text-sm'
        }
        style={globalFilterStyle}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    )
  }

  /* ======================
  getPaginationItemClassName()
  ====================== */

  const getPaginationItemClassName = (mode?: 'previous' | 'next') => {
    const canPreviousPage = table.getCanPreviousPage()
    const canNextPage = table.getCanNextPage()
    let classes = paginationItemClassName || 'xx-table-page-item'

    if (mode === 'previous' && !canPreviousPage) {
      classes = `${classes} disabled`
    } else if (mode === 'next' && !canNextPage) {
      classes = `${classes} disabled`
    }

    return classes
  }

  /* ======================
      renderPagination()
  ====================== */

  const renderPagination = () => {
    if (showPagination === false) {
      return null
    }

    return (
      <ul
        className={paginationClassName || 'xx-table-pagination'}
        style={{ margin: 0, ...paginationStyle }}
      >
        {/* First */}
        <li
          className={getPaginationItemClassName('previous')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'xx-table-page-link'}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            style={paginationButtonStyle}
            type='button'
          >
            {'«'}
          </button>
        </li>

        {/* Previous */}
        <li
          className={getPaginationItemClassName('previous')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'xx-table-page-link'}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            style={paginationButtonStyle}
            type='button'
          >
            {'‹'}
          </button>
        </li>

        {/* Show current page: x of n */}
        <li
          className={paginationItemClassName || 'xx-table-page-item'}
          style={paginationItemStyle}
        >
          <div
            className={paginationButtonClassName || 'xx-table-page-link'}
            style={{
              alignItems: 'center',
              backgroundColor: '#fff',
              display: 'flex',
              gap: 5,
              ...paginationButtonStyle
            }}
          >
            <div style={{ color: '#777', flex: '1 0 auto', fontSize: 12 }}>
              <strong className=''>
                {table.getState().pagination.pageIndex + 1}{' '}
              </strong>{' '}
              <span style={{ color: '#999' }}>of</span>{' '}
              <strong className=''>{table.getPageCount()}</strong>
            </div>

            <span style={{ color: '#999', margin: '0 5px' }}>|</span>

            {/* Manually input the page number */}
            <input
              className={
                pageNumberInputClassName ||
                'form-control m-0 rounded border-[#dee2e6] leading-none'
              }
              min={1}
              max={table.getPageCount()}
              type='number'
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              placeholder='Page #'
              style={{
                fontSize: 10,
                minHeight: 0,
                padding: 2,
                width: 64,
                ...pageNumberInputStyle
              }}
            />

            {/* Select the pageSize */}
            <select
              className={
                pageSizeSelectClassName ||
                'form-select m-0 rounded border-[#dee2e6] leading-none'
              }
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundPosition: '100% 80%',
                fontSize: 10,
                minHeight: 21,
                padding: '2px 2px 2px 6px',
                width: 50,
                ...pageSizeSelectStyle
              }}
            >
              {pageSizes.map((size: number, index: number) => {
                return (
                  <option key={index} value={size}>
                    {size}
                  </option>
                )
              })}
            </select>
          </div>
        </li>

        {/* Next */}
        <li
          className={getPaginationItemClassName('next')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'xx-table-page-link'}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            style={paginationButtonStyle}
            type='button'
          >
            {'›'}
          </button>
        </li>

        {/* Last */}
        <li
          className={getPaginationItemClassName('next')}
          style={paginationItemStyle}
        >
          <button
            className={paginationButtonClassName || 'xx-table-page-link'}
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            style={paginationButtonStyle}
            type='button'
          >
            {'»'}
          </button>
        </li>
      </ul>
    )
  }

  /* ======================
    renderExportCSVButton()
  ====================== */

  const renderExportCSVButton = () => {
    if (showExportCSVButton === false) {
      return null
    }

    // Get data
    const data = table?.options?.data

    // Get selected data
    const flatRows = table.getSelectedRowModel().flatRows
    const selectedData = flatRows.map((flatRow) => {
      return flatRow.original
    })

    const isSelectedData =
      Array.isArray(selectedData) && selectedData.length > 0

    // Set data to selectedData if it exists. Otherwise, default to entire dataset.
    const csvData = isSelectedData ? selectedData : data

    return (
      <ExportCSVButton
        className={exportCSVButtonClassName || 'xx-table-export-csv-button'}
        csvHeaders={csvHeaders}
        data={csvData}
        disabled={false}
        fileName={csvExportFileName}
        style={exportCSVButtonStyle}
      />
    )
  }

  /* ======================
  renderColumnSelectCheckboxes()
  ====================== */

  const renderColumnSelectCheckboxes = () => {
    if (!showColumnSelectCheckboxes) {
      return null
    }

    return (
      <div
        style={{ fontSize: 12, padding: 5.5 }}
        className='flex w-full select-none flex-wrap justify-center gap-2.5 rounded border border-[#dee2e6] text-sm'
      >
        <div
          className={
            columnSelectCheckboxGroupClassName || 'form-check m-0 min-h-0'
          }
          style={columnSelectCheckboxGroupStyle}
        >
          <IndeterminateCheckbox
            id='toggle-all'
            className={columnSelectCheckboxClassName || 'form-check-input'}
            style={{ cursor: 'pointer', ...columnSelectCheckboxStyle }}
            {...{
              indeterminate: table.getIsSomeColumnsVisible(),
              checked: table.getIsAllColumnsVisible(),
              onChange: table.getToggleAllColumnsVisibilityHandler()
            }}
          />
          <label
            className='form-check-label'
            htmlFor='toggle-all'
            style={{ cursor: 'pointer' }}
          >
            Toggle All
          </label>
        </div>

        {table.getAllLeafColumns().map((column) => {
          // Once we add the type definitions to the components we shouldn't need to do as Table<any>.
          // column is of type Column<any, unknown>
          return (
            <div
              className={columnSelectCheckboxGroupClassName || 'form-check'}
              key={column.id}
              style={{
                cursor: 'pointer',
                margin: 0,
                minHeight: 0,
                ...columnSelectCheckboxGroupStyle
              }}
            >
              <input
                id={column.id}
                className={columnSelectCheckboxClassName || 'form-check-input'}
                style={{ cursor: 'pointer', ...columnSelectCheckboxStyle }}
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler()
                }}
              />{' '}
              <label
                className='form-check-label'
                htmlFor={column.id}
                style={{ cursor: 'pointer' }}
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
        })}
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  if (!showControls || noControlsShown) {
    return null
  }

  return (
    <div
      className={controlsClassName}
      style={{
        alignItems: 'flex-start',
        // Using var(--table-border-color) won't works because the associated CSS custom propeties
        // in tablePlugin.ts are defined on :root and NOT the .xx-table. This allows them
        // to be accessible outside of a table.
        borderBottom: atLeastOneVisibleColumn
          ? '1px solid var(--table-border-color)'
          : '',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        padding: 10,
        ...controlsStyle
      }}
    >
      {renderGlobalFilter()}
      {renderPagination()}
      {renderExportCSVButton()}
      {renderColumnSelectCheckboxes()}
    </div>
  )
}
