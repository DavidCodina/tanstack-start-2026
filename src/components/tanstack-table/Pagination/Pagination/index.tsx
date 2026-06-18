import type { Table } from '@tanstack/react-table'

import { cn } from '@/utils'
import { useCSSVariable } from '@/hooks'

// Could update chevrons, but for now I'm okay with the current: « ‹ › »
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

/* ======================

====================== */
// This assumes that allelement in numbers are of type number.

const sortNumbersAscending = (numbers: number[]): number[] => {
  return numbers.slice().sort((a, b) => a - b)
}

/* ======================

====================== */
// This assumes that numbersArrray is sorted.

const insertNumberIntoOrderedNumbers = (
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
    numbersArray[insertIndex] < n
  ) {
    insertIndex++
  }

  // Insert initialPageSize at the correct position
  numbersArray.splice(insertIndex, 0, n)
  return numbersArray
}

const FOCUS_MIXIN = `
focus-visible:outline-none
focus-visible:shadow-none
focus-visible:border-primary
focus-visible:ring-[3px]
focus-visible:ring-primary/40
`

const DISABLED_MIXIN = `
disabled:text-(--table-disabled-color)
disabled:border-(--table-disabled-color)
disabled:placeholder:text-(--table-disabled-color)
`

const inputClasses = `
flex bg-card
w-[64px] min-w-0
m-0 min-h-[0px] p-0.5
text-[10px] leading-none
rounded-[0.375em]
border outline-none
placeholder:text-muted-foreground
${FOCUS_MIXIN}
${DISABLED_MIXIN}
`

const selectClasses = `
appearance-none block bg-card
w-[50px] min-w-0
m-0 min-h-[21px]
text-[10px] leading-none
rounded-[0.375em]
border outline-none
${FOCUS_MIXIN}
${DISABLED_MIXIN}
`

// Conceptualizing the pagination buttons as 'links' is somewhat of a misnomer.
// The convention goes all the way back to Bootsrap where they originally used
// link tags: <a class="page-link" href="#">. See here:
// https://getbootstrap.com/docs/5.3/components/pagination/#overview
// Note: Because two of the buttons use -ml-px, there's a slighltly brighter effect
// on the side borders when opacity is applied.
const pageLinkClasses = `
relative flex items-center bg-card
px-2 py-1
text-sm leading-[1.5]
border outline-none
data-[slot=table-pagination-button]:cursor-pointer
data-[slot=table-pagination-button]:hover:bg-accent
data-[slot=table-pagination-button]:hover:z-1
${FOCUS_MIXIN}
focus-visible:z-2
${DISABLED_MIXIN}
disabled:pointer-events-none
disabled:opacity-65
`

/* ======================
        Types
====================== */

type PaginationProps = {
  disabled?: boolean
  pageSize: number
  pageSizes: number[]
  tableInstance: Table<Record<string, any>>
  variant?: 'primary' | 'secondary'
}

/* ========================================================================

======================================================================== */
// None of the props below are given default values here.
// Instead, all default values are set on Table props.

// Todo: Make entire thing responsive to size - maybe...

export const Pagination = ({
  disabled = false,
  pageSize,
  pageSizes, // Note: pageSize will also added to the page size <select> during the mapping process.
  tableInstance,
  variant // Todo: implement variant
}: PaginationProps) => {
  pageSizes = Array.isArray(pageSizes)
    ? sortNumbersAscending(pageSizes)
    : pageSizes

  pageSizes =
    typeof pageSize === 'number' && Array.isArray(pageSizes)
      ? insertNumberIntoOrderedNumbers(pageSize, pageSizes)
      : pageSizes

  const canPreviousPage = tableInstance.getCanPreviousPage()
  const canNextPage = tableInstance.getCanNextPage()

  //# While this works, it's also very brittle and dependent internally on the
  //# implementation details of useTheme(), which is highly specific to this
  //# Tanstack Start app. A better solution would be to use the <ChevronDown />
  //# in conjunction with actual 'text-foreground' utility class.
  let caretColor = useCSSVariable({
    value: '--color-foreground',
    fallback: '#000000'
  })

  // ⚠️ Gotcha: if the color is a hex color, then you need to replace # with %23.
  caretColor = caretColor?.startsWith('#')
    ? caretColor.replace('#', '%23')
    : caretColor

  /* ======================
        renderFirst()
  ====================== */

  const renderFirst = () => {
    return (
      <li>
        <button
          data-slot='table-pagination-button'
          className={cn(pageLinkClasses, 'rounded-l-sm')}
          disabled={disabled || !canPreviousPage}
          onClick={() => tableInstance.setPageIndex(0)}
          type='button'
        >
          {'«'}
        </button>
      </li>
    )
  }

  /* ======================
      renderPrevious()
  ====================== */

  const renderPrevious = () => {
    return (
      <li>
        <button
          data-slot='table-pagination-button'
          className={cn(pageLinkClasses, '-ml-px')}
          disabled={disabled || !canPreviousPage}
          onClick={() => tableInstance.previousPage()}
          type='button'
        >
          {'‹'}
        </button>
      </li>
    )
  }

  /* ======================
        renderInfo()
  ====================== */
  // Show current page: x of n

  const renderInfo = () => {
    const caret = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='${caretColor}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`
    return (
      <li>
        <div
          className={cn(
            pageLinkClasses,
            'gap-2 border-x-0',
            disabled && 'border-(--table-disabled-color) opacity-65'
          )}
        >
          <div
            className={cn(
              'text-primary shrink-0 text-xs',
              disabled && 'text-(--table-disabled-color)'
            )}
          >
            <strong className=''>
              {tableInstance.getState().pagination.pageIndex + 1}{' '}
            </strong>{' '}
            <span
              className={cn(
                'text-muted-foreground',
                disabled && 'text-(--table-disabled-color)'
              )}
            >
              of
            </span>{' '}
            <strong className=''>{tableInstance.getPageCount()}</strong>
          </div>

          <span
            className={cn(
              'text-muted-foreground mx-[5px] my-0',
              disabled && 'text-(--table-disabled-color)'
            )}
          >
            |
          </span>

          {/* Manually input the page number */}
          <input
            className={inputClasses}
            disabled={disabled}
            min={1}
            max={tableInstance.getPageCount()}
            type='number'
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              tableInstance.setPageIndex(page)
            }}
            placeholder='Page'
          />

          {/* Select the pageSize */}
          <select
            className={selectClasses}
            disabled={disabled}
            onChange={(e) => {
              tableInstance.setPageSize(Number(e.target.value))
            }}
            style={{
              backgroundImage: !disabled ? caret : undefined,
              backgroundPosition: '100% 80%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px 12px',
              padding: '2px 2px 2px 6px'
            }}
            value={tableInstance.getState().pagination.pageSize}
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
    )
  }

  /* ======================
        renderNext()
  ====================== */

  const renderNext = () => {
    return (
      <li>
        <button
          data-slot='table-pagination-button'
          className={cn(pageLinkClasses)}
          disabled={disabled || !canNextPage}
          onClick={() => tableInstance.nextPage()}
          type='button'
        >
          {'›'}
        </button>
      </li>
    )
  }

  /* ======================
        renderLast()
  ====================== */

  const renderLast = () => {
    return (
      <li>
        <button
          data-slot='table-pagination-button'
          className={cn(pageLinkClasses, '-ml-px rounded-r-sm')}
          disabled={disabled || !canNextPage}
          onClick={() =>
            tableInstance.setPageIndex(tableInstance.getPageCount() - 1)
          }
          type='button'
        >
          {'»'}
        </button>
      </li>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <ul className={cn('m-0 flex list-none pl-0 select-none')}>
      {renderFirst()}
      {renderPrevious()}
      {renderInfo()}
      {renderNext()}
      {renderLast()}
    </ul>
  )
}
