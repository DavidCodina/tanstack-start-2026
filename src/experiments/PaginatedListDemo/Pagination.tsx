import { useRef } from 'react'

type PaginationProps = {
  currentPage: number
  handlePageChange: (page: number) => void
  numberedItems?: 1 | 3 | 5 | 7
  pageCount: number
}

const baseClasses = `
rounded px-2 py-1 text-sm font-bold min-w-[30px] select-none
focus:outline-none border border-[rgba(0,0,0,0.25)] shadow
cursor-pointer
`

/* ========================================================================
                          
======================================================================== */

export const Pagination = ({
  currentPage,
  handlePageChange,
  numberedItems = 3,
  pageCount
}: PaginationProps) => {
  const activeButtonRef = useRef<HTMLButtonElement | null>(null)

  const nonActiveClassName = `${baseClasses} bg-white text-blue-500 hover:scale-[1.35] transition-transform`
  const disabledClassName = 'opacity-65 pointer-events-none'

  const page = currentPage
  const lastPage = pageCount

  /* ======================
        Headtrip Area
  ====================== */
  // Calculate the number of pagination items before/after the active pagination item.

  const maxItemsOnASide = numberedItems - 1
  const maxItemsOnASideWhenActiveItemIsInMiddle = maxItemsOnASide / 2 // Assumes numberedItems is odd.
  const firstPage = 1

  const numberOfPrevPages = (() => {
    let numberOfPrevPages = 0

    // Initially, numberOfPrevPages should be something like this...
    for (let i = 0; i <= lastPage; i++) {
      if (page === firstPage + i) {
        numberOfPrevPages =
          i < maxItemsOnASideWhenActiveItemIsInMiddle
            ? i
            : maxItemsOnASideWhenActiveItemIsInMiddle
        break
      }
    }

    // At a certain point, we want to begin adding to numberOfPrevPages as
    // we get closer to lastPage. That point is difficult to describe, but
    // it seems to be: maxItemsOnASide / 2 - 1.
    // Even though numberedItems has been limited to very small range of
    // odd numbers, this formula has been tested up to numberedItems === 13,
    // and the resulting behavior is consistent.
    for (let i = 0; i <= maxItemsOnASide / 2 - 1; i++) {
      if (page === lastPage - i) {
        numberOfPrevPages = maxItemsOnASide - i
        break
      }
    }

    return numberOfPrevPages
  })()

  // Once we know what numberOfPrevPages is, it's easy to obtain numberOfNextPages
  const numberOfNextPages = maxItemsOnASide - numberOfPrevPages

  /* ======================
  renderPreviousPaginationItem()
  ====================== */

  const renderPreviousPaginationItem = () => {
    const elements = []

    for (
      let previousPage = page - 1;
      previousPage >= page - numberOfPrevPages;
      previousPage--
    ) {
      if (previousPage > 0) {
        elements.push(
          <button
            className={nonActiveClassName}
            disabled={false}
            key={previousPage}
            onClick={(_e) => {
              setFocus()
              handlePageChange(previousPage)
            }}
          >
            {previousPage}
          </button>
        )
      }
    }

    return elements.reverse()
  }

  /* ======================
  renderNextPaginationItem()
  ====================== */

  const renderNextPaginationItem = () => {
    const elements = []

    for (
      let nextPage = page + 1;
      nextPage <= page + numberOfNextPages;
      nextPage++
    ) {
      if (nextPage <= lastPage) {
        elements.push(
          <button
            className={nonActiveClassName}
            disabled={false}
            key={nextPage}
            onClick={(_e) => {
              setFocus()
              handlePageChange(nextPage)
            }}
          >
            {nextPage}
          </button>
        )
      }
    }

    return elements
  }

  /* ======================
          setFocus()
  ====================== */

  const setFocus = () => {
    if (!activeButtonRef.current) {
      return
    }
    activeButtonRef.current.focus()
  }

  /* ======================
          return
  ====================== */

  return (
    <div className='flex justify-end gap-2'>
      <button
        disabled={currentPage === 1}
        onClick={() => {
          if (currentPage === 1) {
            return
          }

          handlePageChange(1)
        }}
        className={`${nonActiveClassName} ${currentPage === 1 ? ` ${disabledClassName}` : ''}`}
      >
        «
      </button>

      <button
        disabled={currentPage === 1}
        onClick={() => {
          if (currentPage === 1) {
            return
          }

          handlePageChange(currentPage - 1)
        }}
        className={`${nonActiveClassName} ${currentPage === 1 ? ` ${disabledClassName}` : ''}`}
      >
        ‹
      </button>

      {renderPreviousPaginationItem()}

      <button
        className={`${baseClasses} bg-blue-500 text-white`}
        ref={activeButtonRef}
      >
        {page}
      </button>

      {renderNextPaginationItem()}

      <button
        disabled={currentPage === pageCount}
        onClick={() => {
          if (currentPage === pageCount) {
            return
          }
          handlePageChange(currentPage + 1)
        }}
        className={`${nonActiveClassName} ${currentPage === pageCount ? ` ${disabledClassName}` : ''}`}
      >
        ›
      </button>

      <button
        disabled={currentPage === pageCount}
        onClick={() => {
          if (currentPage === pageCount) {
            return
          }
          handlePageChange(pageCount)
        }}
        className={`${nonActiveClassName} ${currentPage === pageCount ? ` ${disabledClassName}` : ''}`}
      >
        »
      </button>
    </div>
  )
}
