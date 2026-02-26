// import * as React from 'react'
import { useNavigate, useRouterState, useSearch } from '@tanstack/react-router'
import { SimplePagination } from './SimplePagination'
// import type { FileRoute } from '@/types'

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

export const SimplePaginationDemo = () => {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  })

  ///////////////////////////////////////////////////////////////////////////
  //
  // In Tanstack Start, it's always better to use the useSearch hook over
  // doing something like this:
  //
  //   const searchParams = new URLSearchParams(window.location.search)
  //   const pageParam = searchParams.get('page')
  //
  // Why? Because with useSearch, we don't actually need window.
  // In practice, this means we don't have to wait until it renders on the client.
  // However, it's important to note that useSearch will deserialize the search params,
  // so you shouldn't necessarily assume that they're strings.
  //
  ///////////////////////////////////////////////////////////////////////////
  const searchParams = useSearch({ strict: false })

  // ⚠️ Explicit currentPage state is NOT NEEDED to trigger a rerender.
  // const [currentPage, setCurrentPage] = React.useState(() => {
  //   const pageParam = searchParams.page
  //   if (pageParam && typeof pageParam === 'number' && !isNaN(pageParam)) {
  //     return pageParam
  //   }
  //   return 1
  // })

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
    // Non Tanstack Router implementation
    // const searchParams = new URLSearchParams(window.location.search)
    // const params = new URLSearchParams(searchParams.toString()) // Get all params
    // params.set('page', page.toString()) // Update page param

    // type Navigate = typeof navigate
    // type OptionsType = Parameters<Navigate>[0]
    // type FromType = OptionsType['from']

    // Here it's important to make sure the navigate() call isn't actually reloading the
    // parent page by running a useEffect() in that page.
    // React.useEffect(() => { console.log('\nPage mounted!') }, [])
    // And it turns out that it does not reload the page.

    navigate({
      to: pathname,
      // In this case, using `to` or `from` would work.
      // However, if one uses from, you either have to use any or FromType.
      // from: pathname as FromType,
      search: { ...searchParams, page },
      replace: true
    })

    // Non Tanstack Router implementation
    // ❌ window.history.pushState({}, '', `?${params.toString()}`)
    // window.history.replaceState({}, '', `?${params.toString()}`)

    // In a standard Vite app with React Router, having currentPage state may be necessary.
    // However, in Tanstack Start something here is already triggering a rerender.
    // It's most likely useSearch() and/or useRouterState() hooks. Consequently, explicit
    // currentPage state is NOT NEEDED.
    // setCurrentPage(page)
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

      <SimplePagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        pageCount={pageCount}
      />
    </div>
  )
}
