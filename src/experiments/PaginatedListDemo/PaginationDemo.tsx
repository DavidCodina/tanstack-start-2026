import { useNavigate, useRouterState, useSearch } from '@tanstack/react-router'
import { Pagination } from './Pagination'
//import { SimplePagination as Pagination } from './SimplePagination'

// const data: any = []
// for (let i = 1; i <= 100; i++) {
//   data.push({ id: i.toString(), title: `Item ${i}` })
// }

// const data = Array.from(Array(50).keys()).map((i) => ({
//   id: i.toString(),
//   title: `Item ${i}`
// }))

// const data = [...Array(93)].map((_, index) => {
//   const n = index + 1
//   return {
//     id: n.toString(),
//     title: `Item ${n}`
//   }
// })

const data = Array.from({ length: 100 }, (_, index) => `Item ${index + 1}`)
const itemsPerPage = 10

/* ========================================================================
                          
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// WDS:          https://www.youtube.com/watch?v=VenLRGHx3D4
//               https://www.youtube.com/watch?v=oZZEI23Ri6E
// ByteGrad:     https://www.youtube.com/watch?v=ukpgxEemXsk&t=2s
// CoderOne:     https://www.youtube.com/watch?v=h9hYnDe8DtI&t=145s
//
// Cosden Solutons: https://www.youtube.com/watch?v=gMoni2Hm92U // ❗️Not watched yet.
//
// Sam Selikoff: https://www.youtube.com/watch?v=sFTGEs2WXQ4
//
//               Discusses the 'browser back button bug', and how to avoid 'two sources of truth'.
//               https://www.youtube.com/watch?v=fYqMPvPvVAc
//
// Theo:         https://www.youtube.com/watch?v=t3FUkq7yoCw
//
// Academind:    https://www.youtube.com/watch?v=hnmTiXEY4X8
//
// Jolly Coding: https://www.youtube.com/watch?v=mXziH-hQARs
//
// John Reilly:  https://blog.logrocket.com/use-state-url-persist-state-usesearchparams/
//               https://johnnyreilly.com/react-usesearchparamsstate
//
///////////////////////////////////////////////////////////////////////////

export const PaginationDemo = () => {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  })

  const searchParams = useSearch({ strict: false })

  const navigate = useNavigate()

  /* ======================
        Dervived State
  ====================== */

  const currentPage = (() => {
    const pageParam = searchParams.page

    if (pageParam && typeof pageParam === 'number' && !isNaN(pageParam)) {
      return pageParam
    }
    return 1
  })()

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const dataSubset = data.slice(indexOfFirstItem, indexOfLastItem)
  const itemCount = data.length
  const pageCount = Math.ceil(itemCount / itemsPerPage)

  /* ======================
      handlePageChange()
  ====================== */

  const handlePageChange = (page: number) => {
    navigate({
      to: pathname,
      search: { ...searchParams, page },
      replace: true
    })
  }

  /* ======================
        renderList()
  ====================== */

  const renderList = () => {
    return (
      <ul className='mx-auto mb-4 flex flex-col rounded pl-0'>
        {dataSubset.map((item, index) => (
          <li
            key={index}
            // [&:not(:first-child)]:border-t-0
            className={`relative block cursor-pointer border border-neutral-400 bg-white px-2 py-2 text-sm font-black text-blue-500 shadow-[rgba(0,0,0,0.24)_0px_3px_8px] select-none not-first:border-t-0 first:rounded-t-[inherit] last:rounded-b-[inherit]`}
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <div className='mx-auto mb-6 max-w-[500px]'>
      {renderList()}

      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        pageCount={pageCount}
      />
    </div>
  )
}
