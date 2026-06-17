import { GlobalFilter } from '../GlobalFilter'
import './index.css'
import { IControls } from './types'

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

  // Other...
  noControlsShown,
  globalFilter,
  setGlobalFilter,

  pageSize,
  pageSizes, // Note: pageSize will also added to the page size <select> during the mapping process.
  showControls,
  showGlobalFilter,

  showPagination,

  table
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

  // const renderGlobalFilter = () => {
  //   if (!showGlobalFilter) {
  //     return null
  //   }

  //   return (
  //     <GlobalFilter
  //       className={globalFilterClassName || 'xx-table-form-control'}
  //       style={{ flex: 1, width: 'auto', ...globalFilterStyle }}
  //       globalFilter={globalFilter}
  //       setGlobalFilter={setGlobalFilter}
  //     />
  //   )
  // }

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
              className={pageNumberInputClassName || 'form-control'}
              min={1}
              max={table.getPageCount()}
              type='number'
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              placeholder='Page #'
              style={{
                backgroundColor: '#fff',
                /* This is currently breaking the focus0 border color. */
                border: '1px solid #ced4da',
                borderRadius: 4,
                fontSize: 10,
                lineHeight: 1,
                margin: 0,
                minHeight: 0,
                padding: 2,
                width: 64,
                ...pageNumberInputStyle
              }}
            />

            {/* Select the pageSize */}
            <select
              className={pageSizeSelectClassName || 'form-select'}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              style={{
                backgroundColor: '#fff',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundPosition: '100% 80%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px 12px',
                /* This is currently breaking the focus0 border color. */
                border: '1px solid #ced4da',
                borderRadius: 4,
                fontSize: 10,
                lineHeight: 1,
                margin: 0,
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
        //! Hardcoding the border color will lead to problems if the user ever wants to change the table border color.
        //! borderBottom: atLeastOneVisibleColumn ? '1px solid #dee2e6' : '',

        // Using var(--table-border-color) won't work becaust Controls is outside of the
        // scope of the table. For now we can do this:
        borderBottom: '1px solid #a3a3a3',
        // # borderBottom: atLeastOneVisibleColumn ? '1px solid #a3a3a3' : '',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        padding: 10,
        ...controlsStyle
      }}
    >
      {/* {renderGlobalFilter()} */}
      {renderPagination()}
    </div>
  )
}
