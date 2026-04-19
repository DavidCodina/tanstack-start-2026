import { cn } from '@/utils'

type PaginationProps = {
  currentPage: number
  handlePageChange: (page: number) => void
  pageCount: number
}

const baseClasses = `
rounded px-2 py-1 text-sm font-bold min-w-[30px] text-white select-none
focus:outline-none border border-[rgba(0,0,0,0.25)] shadow
cursor-pointer
`

/* ========================================================================
                          
======================================================================== */

export const SimplePagination = ({
  currentPage,
  handlePageChange,
  pageCount
}: PaginationProps) => {
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
        className={cn(
          baseClasses,
          'bg-neutral-300 hover:bg-neutral-400',
          currentPage === 1 && 'opacity-75'
        )}
        type='button'
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
        className={cn(
          baseClasses,
          'bg-neutral-300 hover:bg-neutral-400',
          currentPage === 1 && 'opacity-75'
        )}
        type='button'
      >
        ‹
      </button>

      {Array.from({ length: pageCount }, (_, index) => {
        const isActive = currentPage === index + 1

        const bgColor = isActive ? 'bg-blue-500' : 'bg-neutral-300'
        const bgHoverColor = isActive ? '' : 'hover:bg-neutral-400'

        return (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={cn(baseClasses, bgColor, bgHoverColor)}
            type='button'
          >
            {index + 1}
          </button>
        )
      })}

      <button
        disabled={currentPage === pageCount}
        onClick={() => {
          if (currentPage === pageCount) {
            return
          }
          handlePageChange(currentPage + 1)
        }}
        className={cn(
          baseClasses,
          'bg-neutral-300 hover:bg-neutral-400',
          currentPage === pageCount && 'opacity-75'
        )}
        type='button'
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
        className={cn(
          baseClasses,
          'bg-neutral-300 hover:bg-neutral-400',
          currentPage === pageCount && 'opacity-75'
        )}
        type='button'
      >
        »
      </button>
    </div>
  )
}
