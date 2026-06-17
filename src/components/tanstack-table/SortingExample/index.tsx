import { useEffect, useState } from 'react'

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel
  // SortingFn,
  // SortingState
} from '@tanstack/react-table'
import { sleep } from '@/utils'

import data from '../data.json'
import { columns as cols } from './columns'

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
// https://tanstack.com/table/v8/docs/guide/sorting
// https://tanstack.com/table/v8/docs/api/features/sorting
// https://tanstack.com/table/latest/docs/framework/react/examples/sorting
// https://github.com/TanStack/table/blob/main/packages/table-core/src/sortingFns.ts
//
///////////////////////////////////////////////////////////////////////////

export const Table = ({ data, columns, status }: any) => {
  const tableInstance = useReactTable({
    columns: columns,
    data: data,
    initialState: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // client-side sorting,
    // onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access

    // The type defs define this as: sortingFns?: Record<string, SortingFn<any>>
    // However, if we add a custom sortingFn, it will work when used by a
    // column definition, but Typescript seems not to recognize it.
    sortingFns: {
      ///////////////////////////////////////////////////////////////////////////
      //
      // https://tanstack.com/table/v8/docs/api/features/sorting#sorting-functions
      // This is the type signature for every sorting function:
      //
      //   export type SortingFn<TData extends AnyData> = {
      //     (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
      //   }
      //
      // sortByRawValue is used when the associated value has been transformed from an
      // ISO string to a formatted date, and that new value is being used as the
      // accessor. Why? would it be used as the accesor? Because then global and
      // column filtering will work as expected. However, we need to then fix the
      // sorting such that it uses the original ISO string value.
      //
      // This function will now be accessible from the column definition by
      // using the following property:
      //
      //  sortingFn: 'sortByRawValue' as any
      //
      // It's unlikely that we'll be sorting actual date objects, but if that's the
      // case, there's actually a built-in 'datetime' sorting function.
      //
      ///////////////////////////////////////////////////////////////////////////
      sortByRawValue: (rowA: any, rowB: any, columnId: any): number => {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Strangely, both in the default sorting function and in this one it
        // begins with the desc for numbers, but asc for strings. Use this to change:
        //
        //  sortDescFirst: false
        //
        // It will still sort the values correctly (i.e, asc will still be lowest to highest, etc.).
        // It's just the order of the processes is different for different primitives.
        // This is definitely a tanstack table thing, and not coming from the implementation.
        // In any case, sortByRawValue will handle numbers and strings correctly.
        //
        // Where it will struggle is with stringified numbers such that '100' will be considered
        // lower than '20'. This is the expected behavior and also occurs within tanstack table's
        // default sorter. In cases where your data has numbers as string values, the best approach
        // is to probably transform them into numbers from within the accessor function.
        // However, another approach might be to have a specific sorter for them: sortStringAsNumber
        //
        ///////////////////////////////////////////////////////////////////////////
        const valueA = rowA.original[columnId]
        const valueB = rowB.original[columnId]

        // This is also a lexicographical sort:
        // valueA < valueB ? -1 : valueA > valueB ? 1 : 0
        return valueA < valueB ? -1 : 1
      },
      // Use this sorter when number values are stored as strings, but you want to sort them
      // as numbers. Alternatively, use the accessor to function to transform the function.
      sortStringAsNumber: (rowA: any, rowB: any, columnId: any): number => {
        // null values are treated as 0.
        // undefined values seem to break the ordering.
        // Basically, Number('') and Number(null) evaluate to 0,
        // but Number(undefined) evaluates to NaN as would Number('sadf').
        //
        // For this reason, I've added a failsafe that converts anything
        // that doesn't convert successfully to a number to 0.
        const isNum = (v: any): v is number => {
          return typeof v === 'number' && !isNaN(v)
        }

        const valueA = rowA.original[columnId]
        const valueB = rowB.original[columnId]

        let numberA: any = Number(valueA)
        let numberB: any = Number(valueB)

        if (!isNum(numberA)) {
          numberA = 0
        }

        if (!isNum(numberB)) {
          numberB = 0
        }

        return numberA < numberB ? -1 : 1
      }
    }

    // state: { sorting },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
  })

  // access sorting state from the table instance
  // console.log(tableInstance.getState().sorting)

  const { getHeaderGroups, getRowModel, getFooterGroups } = tableInstance

  /* ======================
      renderTable()
  ====================== */

  const renderTable = () => {
    return (
      <div
        className='border-dark mx-auto mb-6 w-11/12 overflow-x-auto border shadow'
        style={{ borderRadius: 15, WebkitOverflowScrolling: 'touch' }}
      >
        <table className='table-bordered table-striped table-hover table bg-white'>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div // eslint-disable-line
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽'
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel()
              .rows //.slice(0, 10) //^ Demo only!
              .map((row) => (
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
//////////////////////////////////////////////////////////////////////////
//
//  Basic examples from the docs memoize data.
//  In practice the data will be coming from an API, or hardcoded in a separate file,
//  then passed in as a prop. Presumably, this means that there's no need to memoize the data. Why?
//  Because we're not internally defining a data constant anew each time the component renrenders.
//
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//
//  https://react-table.tanstack.com/docs/quick-start
//  It's important that we're using React.useMemo here to ensure that our data isn't recreated
//  on every render. If we didn't use React.useMemo, the table would think it was receiving
//  new data on every render and attempt to recalculate a lot of logic every single time. Not cool!
//
//  I think that only applies if COLUMNS are defined inside of the component.
//  In that case it makes sense that every rerender would rebuild the columns
//  Nonetheless, it doesn't hurt to memoize it.
//
//  Yeah... If you define columns inside of the component, then don't memoize them,
//  it will cause an infinite loop and crash the App. Either memoize them:
//
//    const cols = useMemo(() => columns, []);
//
//  Or:
//
//    const columns = useMemo(() => grouped_columns, []);
//
//
//  Or define columns outside of the component.
//
//////////////////////////////////////////////////////////////////////////

export const SortingExample = () => {
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
          setColumns(cols) // groupedColumns | manualGroupedColumns
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
