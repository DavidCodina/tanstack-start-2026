import { useEffect, useState } from 'react'

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
  // FilterFn,
  getFilteredRowModel
} from '@tanstack/react-table'
// import { RankingInfo } from '@tanstack/match-sorter-utils'

import { sleep } from 'utils'
import { ColumnFilter } from './ColumnFilter'
import { GlobalFilter } from './GlobalFilter'
import data from '../data.json'
import { fuzzyFilter } from './filters'
import { columns as cols } from './columns'

///////////////////////////////////////////////////////////////////////////
//
// Gotcha, this will change the definitions globally, and might cause
// issues for other component implementations. On the other hand, it
// also seems necessary if you want to use the fuzzy filter.
//
//   declare module '@tanstack/react-table' {
//     interface FilterFns {
//       fuzzy?: FilterFn<unknown>
//     }
//     interface FilterMeta {
//       itemRank: RankingInfo
//     }
//   }
//
///////////////////////////////////////////////////////////////////////////

const getData = async () => {
  try {
    await sleep(1000)
    return {
      data: data,
      success: true,
      message: 'Success.'
    }
  } catch (_err) {
    return {
      data: null,
      success: false,
      message: 'Server error.'
    }
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://tanstack.com/table/v8/docs/guide/global-filtering
// https://tanstack.com/table/v8/docs/api/features/global-filtering
//
// https://tanstack.com/table/v8/docs/guide/column-filtering
// https://tanstack.com/table/v8/docs/api/features/column-filtering
//
// https://tanstack.com/table/v8/docs/guide/fuzzy-filtering
//
// https://tanstack.com/table/v8/docs/framework/react/examples/filters-fuzzy
//
// https://github.com/TanStack/table/blob/main/packages/table-core/src/filterFns.ts
//
///////////////////////////////////////////////////////////////////////////
export const Table = ({
  data,
  columns,
  status,
  showColumnFilters = true
}: any) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const tableInstance = useReactTable({
    columns: columns,
    data: data,
    initialState: {},

    filterFns: {
      fuzzy: fuzzyFilter // Define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString', // 'fuzzy', // Apply fuzzy filter to the global filter (most common use case for fuzzy filter),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel() // client side filtering
  })

  const { getHeaderGroups, getRowModel, getFooterGroups } = tableInstance

  // useEffect(() => {
  //   const logAutoFilterFns = () => {
  //     if (!tableInstance || typeof tableInstance.getAllColumns !== 'function') { return }
  //     const allColumns = tableInstance?.getAllColumns()
  //     if (!Array.isArray(allColumns)) { return }
  //     allColumns.forEach((column) => {
  //       if (column && 'id' in column && 'getAutoFilterFn' in column) {
  //         console.log('\n\n')
  //         console.log(`${column?.id}:`, column?.getAutoFilterFn())
  //         console.dir(column?.getAutoFilterFn())
  //       }
  //     })
  //   }
  //   logAutoFilterFns()
  // })

  /* ======================
      renderTable()
  ====================== */

  const renderTable = () => {
    return (
      <>
        <GlobalFilter
          className='form-control form-control-sm mx-auto mb-6 max-w-lg'
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          style={{}}
        />

        <div
          className='border-dark mx-auto mb-6 w-11/12 overflow-x-auto border shadow'
          style={{ borderRadius: 15, WebkitOverflowScrolling: 'touch' }}
        >
          <table className='table-bordered table-striped table-hover table bg-white'>
            <thead>
              {getHeaderGroups().map((headerGroup) => {
                return (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const columnFilter = (
                        <ColumnFilter
                          className='form-control form-control-sm'
                          column={header.column}
                          style={{
                            fontSize: 10,
                            lineHeight: 1,
                            margin: 0,
                            maxWidth: 150,
                            minHeight: 0,
                            padding: 2
                          }}
                        />
                      )

                      // The enableColumnFilter is a property that exists in Tanstack Table.
                      // However, by default it's true, which means you have to explicitly
                      // opt out of the filtering if you don't want it. Moreover, there seems
                      // to be no way to change the global default to false. I prefer to opt
                      // in to column filtering. We can accomplish this by using our own enableFilter
                      // variable here such that if it's not EXPLICITLY set to true, then we consider it false.
                      const enableFilter =
                        header?.column?.columnDef?.enableColumnFilter === true
                          ? true
                          : false

                      return (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}

                          {/* Conditionally render a column filter input. */}
                          {showColumnFilters &&
                          enableFilter &&
                          header.column.getCanFilter() ? (
                            <div>{columnFilter}</div>
                          ) : null}
                        </th>
                      )
                    })}
                  </tr>
                )
              })}
            </thead>

            <tbody>
              {getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            <tfoot>
              {getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      </>
    )
  }

  /* ======================
      renderContent()
  ====================== */

  const renderContent = () => {
    if (status === 'error') {
      // Todo:  Render <Alert />
      return null
    }

    if (status === 'pending') {
      // Todo: Render loading spinner, or skeleton.

      return (
        <div className='my-6 text-center text-3xl leading-none font-black text-violet-800'>
          Loading...
        </div>
      )
    }

    if (!data || !columns) {
      //# Return error Alert indicating that data or columns is not defined
      return null
    }

    return renderTable()
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}

/* ========================================================================

======================================================================== */

export const FilteringExample = () => {
  const [data, setData] = useState<any[] | null>(null)
  const [columns, setColumns] = useState<any[] | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  /* ======================
         useEffect()
  ====================== */
  // This useEffect demonstrates that Table can render,
  // and useReactTable() can update asynchronously.

  useEffect(() => {
    setStatus('pending')
    getData()
      .then((result) => {
        const { success, data } = result

        if (success === true && Array.isArray(data)) {
          setData(data)
          setColumns(cols)
          setStatus('success')
        } else {
          setStatus('error')
        }

        return result
      })
      .catch((err) => {
        setStatus('error')
        return err
      })
  }, [])

  /* ======================
          return
  ====================== */

  return <Table data={data} columns={columns} status={status} />
}
