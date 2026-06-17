import { useEffect, useState, useMemo } from 'react'

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  InitialTableState
  // FilterFn,
  // SortingFn,
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
// Filtering:
//   https://tanstack.com/table/v8/docs/guide/global-filtering
//   https://tanstack.com/table/v8/docs/api/features/global-filtering
//   https://tanstack.com/table/v8/docs/guide/column-filtering
//   https://tanstack.com/table/v8/docs/api/features/column-filtering
//   https://tanstack.com/table/v8/docs/guide/fuzzy-filtering
//   https://tanstack.com/table/v8/docs/framework/react/examples/filters-fuzzy
//   https://github.com/TanStack/table/blob/main/packages/table-core/src/filterFns.ts
//
// Sorting:
//
//   https://tanstack.com/table/v8/docs/guide/sorting
//   https://tanstack.com/table/v8/docs/api/features/sorting
//   https://tanstack.com/table/latest/docs/framework/react/examples/sorting
//   https://github.com/TanStack/table/blob/main/packages/table-core/src/sortingFns.ts
//
///////////////////////////////////////////////////////////////////////////

export const Table = ({
  tableContainerClassName = '',
  tableContainerStyle = {},

  tableClassName = '',
  tableStyle = {},

  headerClassName = '',
  headerStyle = {},
  thClassName = '',
  thStyle = {},
  bodyClassName = '',
  bodyStyle = {},
  tdClassName = '',
  tdStyle = {},
  footerClassName = '',
  footerStyle = {},

  // className & style props for global/column text input search filters.
  globalFilterClassName = '',
  globalFilterStyle = {},
  columnFilterClassName = '',
  columnFilterStyle = {},

  // Table feature style props (akin to Bootstrap table features)
  tableSize,
  tableBordered = false,
  tableBorderless = false,
  tableFlush = false,
  tableStriped = false,
  tableHover = false,
  tableHoverPrimary = false,

  // TanStack table configuration props.
  columns,
  data,
  status,

  // Boolean props for conditionally rendering various UI.

  showColumnFilters = true,
  showGlobalFilter = true,
  showFooter = true
}: any) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  /* ======================
      Derived State
  ====================== */

  // Check the first column to see if it has a footer property.
  // If so, we can assume that all columns have a footer property.
  const firstColumn = Array.isArray(columns) && columns[0] ? columns[0] : {}

  // Used to determine if a footer <th> should be created when building selectableColumn.
  // Also used as part of conditional statement that determines whether or not to render <tfoot>.
  const hasFooter = firstColumn.hasOwnProperty('footer')

  /* ======================
      Memoize Columns 
  ====================== */
  // We can't assume that columns has been memoized, has been stored in state, or
  // is being imported from a static file. For that reason, we still need to wrap
  // it in useMemo() before passing it into the table instance.

  const cols = useMemo(() => {
    return columns
  }, [columns])

  /* ======================
      Initialize Table
  ====================== */

  const initialState: InitialTableState = {}

  const tableInstance = useReactTable({
    columns: cols,
    data: data,

    filterFns: {
      fuzzy: fuzzyFilter // Define as a filter function that can be used in column definitions
    },

    // Note: when a change occurs, it usually entails two renders. Why?
    // Presumably, the table updates its internal state causing a render, then
    // it calls the associated setter. I'm not sure if this is actually the
    // case, but I wittled the Table all the way down to just the sorting feature,
    // and it still double-rendered. Thus, it's not an optimization issue related
    // to how I implemented it. Rather, it's just the way it works with Tanstack table.
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString', // 'fuzzy', // Apply fuzzy filter to the global filter (most common use case for fuzzy filter),

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
    },

    state: {
      columnFilters,
      globalFilter,
      sorting
    },

    // https://tanstack.com/table/v8/docs/api/core/table#initialstate
    initialState: initialState

    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: false
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
  })

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
      getTableClasses()
  ====================== */
  // This function builds the className string for the <table>
  // element based off of the values from associated props.

  const getTableClasses = () => {
    let classes = tableClassName || 'table' // ???

    // Set table size class (There is no 'lg'/'large')
    if (tableSize === 'xs' || tableSize === 'extra-small') {
      classes = `${classes} table-xs`
    } else if (tableSize === 'sm' || tableSize === 'small') {
      classes = `${classes} table-sm`
    }

    // Set bordered or borderless class
    if (tableBordered === true) {
      classes = `${classes} table-bordered`
    } else if (tableBorderless === true) {
      classes = `${classes} table-borderless`
    }

    if (tableFlush === true) {
      classes = `${classes} table-flush`
    }

    if (tableStriped === true) {
      classes = `${classes} table-striped`
    }

    if (tableHoverPrimary === true) {
      //# Doesn't currently exist.
      classes = `${classes} table-hover-primary`
    } else if (tableHover === true) {
      classes = `${classes} table-hover`
    }

    return classes
  }

  /* ======================
    renderGlobalFilter()
  ====================== */

  const renderGlobalFilter = () => {
    if (!showGlobalFilter) {
      return null
    }

    return (
      <GlobalFilter
        style={globalFilterStyle}
        className={globalFilterClassName}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    )
  }

  /* ======================
    renderTableHeader()
  ====================== */

  const renderTableHeader = () => {
    return (
      <thead className={headerClassName} style={headerStyle}>
        {tableInstance.getHeaderGroups().map((headerGroup) => {
          return (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnFilter = (
                  <ColumnFilter
                    style={columnFilterStyle}
                    className={columnFilterClassName}
                    column={header.column}
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
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={thClassName}
                    style={thStyle}
                  >
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
    )
  }

  /* ======================
      renderTableBody()
  ====================== */

  const renderTableBody = () => {
    return (
      <tbody className={bodyClassName} style={bodyStyle}>
        {tableInstance.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={tdClassName} style={tdStyle}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

  /* ======================
    renderTableFooter()
  ====================== */

  const renderTableFooter = () => {
    // Return null when no footer is detected in the column definition, or
    // when the showFooter prop is set to false.
    if (!hasFooter || !showFooter) {
      return null
    }

    return (
      <tfoot className={footerClassName} style={footerStyle}>
        {tableInstance.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className={thClassName}
                style={thStyle}
              >
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
    )
  }

  /* ======================
      renderTable()
  ====================== */

  const renderTable = () => {
    return (
      <div
        style={{ WebkitOverflowScrolling: 'touch', ...tableContainerStyle }}
        className={tableContainerClassName || 'table-container'}
      >
        <table className={getTableClasses()} style={tableStyle}>
          {renderTableHeader()}

          {renderTableBody()}

          {renderTableFooter()}
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
        <div className='my-6 text-center text-3xl font-black leading-none text-violet-800'>
          Loading...
        </div>
      )
    }

    if (!data || !columns) {
      //# Return error Alert indicating that data or columns is not defined
      return null
    }

    return (
      <>
        {renderGlobalFilter()}
        {renderTable()}
      </>
    )
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}

/* ========================================================================

======================================================================== */

export const SortingAndFilteringExample = () => {
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

  return (
    <Table
      tableContainerClassName={
        'table-container bg-white [--table-container-border-color:#409] [--table-container-srollbar-color:#409] rounded-xl shadow'
      }
      tableContainerStyle={{ borderWidth: 1 }}
      // tableClassName='table'
      data={data}
      columns={columns}
      status={status}
      // tableSize='sm'
      tableBordered={true}
      // tableBorderless = false,
      tableFlush={true}
      tableStriped={true}
      tableHover={true}
      // tableHoverPrimary = false

      headerClassName='text-center align-top'
      headerStyle={{}}
      thClassName='whitespace-nowrap'
      thStyle={{}}
      bodyClassName='text-center'
      bodyStyle={{}}
      globalFilterClassName='form-control form-control-sm mx-auto mb-6 max-w-lg'
      globalFilterStyle={{}}
      columnFilterClassName='form-control form-control-sm'
      columnFilterStyle={{
        fontSize: 10,
        lineHeight: 1,
        margin: 0,
        maxWidth: 150,
        minHeight: 0,
        padding: 2
      }}
      showGlobalFilter={true}
    />
  )
}
