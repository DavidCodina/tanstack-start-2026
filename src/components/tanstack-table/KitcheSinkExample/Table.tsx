import { CSSProperties, useEffect, useState, useMemo, useRef } from 'react'

import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  InitialTableState,
  ColumnOrderState // string[]
  //  RowSelectionState,
  // VisibilityState
  // PaginationState,
  // FilterFn,
  // SortingFn,
} from '@tanstack/react-table'

import { ColumnFilter } from './ColumnFilter'
import { Controls } from './Controls'
import { IndeterminateCheckbox } from './IndeterminateCheckbox'
import { fuzzyFilter } from './filters'
import { ITable } from './types'

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

function isStringArray(arg: any): arg is string[] {
  if (!Array.isArray(arg)) {
    return false
  }
  return arg.every((item: any) => typeof item === 'string')
}

function isBooleanObject(arg: any): arg is Record<string, boolean> {
  if (typeof arg !== 'object' || arg === null) {
    return false
  }

  for (const key in arg) {
    if (!arg.hasOwnProperty(key)) {
      continue // Skip inherited properties
    }

    const value = arg[key]
    if (typeof value !== 'boolean') {
      return false
    }
  }

  return true
}

/* ========================================================================
                                  Table
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
  containerClassName = '',
  containerStyle = {},

  titleContainerClassName = '',
  titleContainerStyle = {},
  titleClassName = '',
  titleStyle = {},
  subtitleClassName = '',
  subtitleStyle = {},

  controlsClassName = '',
  controlsStyle = {},

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

  // className & style props for row/column selection checkboxes.
  rowSelectCheckboxClassName = '',
  rowSelectCheckboxStyle = {},

  columnSelectCheckboxGroupClassName = '',
  columnSelectCheckboxGroupStyle = {},
  columnSelectCheckboxClassName = '',
  columnSelectCheckboxStyle = {},

  // className & style props for pagination.
  paginationClassName = '',
  paginationStyle = {},
  paginationItemClassName = '',
  paginationItemStyle = {},
  paginationButtonClassName = '',
  paginationButtonStyle = {},
  pageNumberInputClassName = '',
  pageNumberInputStyle = {},
  pageSizeSelectClassName = '',
  pageSizeSelectStyle = {},

  // className & style props for ExportCSVButton.
  exportCSVButtonClassName = '',
  exportCSVButtonStyle = {},

  // Table feature style props (akin to Bootstrap table features)
  tableSize,
  tableBordered = false,
  tableBorderless = false,
  tableFlush = false,
  tableStriped = false,
  tableHover = false,
  tableHighlightSelectedRows = false,

  // TanStack table configuration props.
  columns = [],
  columnOrder: columnOrderProp = [],
  columnVisibility: columnVisibilityProp = {},
  data = [],
  onSelectionChange,
  onColumnVisibilityChange,
  pageIndex = 0,
  pageSize: pageSizeProp = 10,
  pageSizes = [10, 20, 30, 40, 50], // Note: pageSize will also added to the page size <select> during the mapping process.

  // Boolean props for conditionally rendering various UI.
  showControls = true,
  showGlobalFilter = true,
  showColumnFilters = true,
  showPagination = true,
  showExportCSVButton = true,
  showColumnSelectCheckboxes = true,
  // If columnVisibility is { select: false }, then that
  // has precedence over showRowSelection of true.
  showRowSelection = false,

  showFooter = true,

  // showRowSelection can be true, thereby rendering the row selection checkbox column.
  // However, we might want to disable the ability for the user to actually select rows.
  // In this case, we can set enableRowSelection to false.
  enableRowSelection = true,

  // Random
  status,
  title = '',
  subtitle = '',
  csvExportFileName = '',
  csvHeaders
}: ITable) => {
  /* ======================
      Stupid Proofing
  ====================== */
  // It's possible that columns and/or data  might be null or undefined
  // on mount. This could potentially break some of the logic here.

  columns = Array.isArray(columns) ? columns : []
  data = Array.isArray(data) ? data : []

  /* ======================
        State & Refs
  ====================== */

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() => {
    return isStringArray(columnOrderProp) ? columnOrderProp : []
  })

  // Initialize columnVisibility using columnVisibilityProp.
  // Otherwise default to {}. columnVisibility is always an object columnIds
  // keys and boolean values.  A column is visible if the key/value is omitted
  // or if it is set to true. A column is not visible when it's key is listed
  // and the associated value is set to false
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    return isBooleanObject(columnVisibilityProp) ? columnVisibilityProp : {}
  })

  const firstRenderRef = useRef(true)
  const onSelectionChangeRef = useRef<any>(onSelectionChange)
  const onColumnVisibilityChangeRef = useRef<any>(onColumnVisibilityChange)

  /* ======================
        Derived State
  ====================== */

  // Check the first column to see if it has a footer property.
  // If so, we can assume that all columns have a footer property.
  const firstColumn = Array.isArray(columns) && columns[0] ? columns[0] : {}

  // Used to determine if a footer <th> should be created when building selectableColumn.
  // Also used as part of conditional statement that determines whether or not to render <tfoot>.
  const hasFooter = firstColumn.hasOwnProperty('footer')

  const dataLength = data?.length || 0

  const noControlsShown =
    !showGlobalFilter &&
    !showPagination &&
    !showExportCSVButton &&
    !showColumnSelectCheckboxes

  // Because rowSelectCheckboxStyle is an object (i.e., reference type),
  // we have to stringify it before passing it into the useMemo()
  // dependency array. Otherwise, it will cause an infinite rerender.
  const stringifiedRowSelectCheckboxStyle =
    typeof rowSelectCheckboxStyle === 'object'
      ? JSON.stringify(rowSelectCheckboxStyle)
      : JSON.stringify({})

  const stringifiedColumnOrderProp = isStringArray(columnOrderProp)
    ? JSON.stringify(columnOrderProp)
    : JSON.stringify([])

  const stringifiedColumnVisibilityProp = isBooleanObject(columnVisibilityProp)
    ? JSON.stringify(columnVisibilityProp)
    : JSON.stringify({})

  /* ======================
        Pagination
  ====================== */
  // If showPagination is false, then set pageSize to the length of data.
  // This will work during initialization. However, in order to make
  // the showPagination prop dynamically update, we also do this below
  // the table initialization: if (!showPagination) { table.setPageSize(data.length) }

  const pageSize = showPagination === true ? pageSizeProp : dataLength

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

    if (tableHover === true) {
      classes = `${classes} table-hover`
    }

    return classes
  }

  /* ======================
      Memoize Columns
  ====================== */
  // We can't assume that columns has been memoized, has been stored in state, or
  // is being imported from a static file. For that reason, we still need to wrap
  // it in useMemo() before passing it into the table instance.

  const cols = useMemo(() => {
    return columns
  }, [columns])

  const colsPlusSelectable = useMemo(() => {
    // Parse stringifiedRowSelectCheckboxStyle back to an object.
    const parsedRowSelectCheckboxStyle = JSON.parse(
      stringifiedRowSelectCheckboxStyle
    ) as CSSProperties

    const selectableColumn: any = {
      id: 'select',
      header: ({ table }: any) => {
        return (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              className: rowSelectCheckboxClassName || 'form-check-input',
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
              style: { cursor: 'pointer', ...parsedRowSelectCheckboxStyle }
            }}
          />
        )
      },
      cell: ({ row }: any) => {
        return (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              className: rowSelectCheckboxClassName || 'form-check-input',
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
              style: { cursor: 'pointer', ...parsedRowSelectCheckboxStyle }
            }}
          />
        )
      },
      enableSorting: false,
      enableFilter: false
    }

    if (hasFooter) {
      selectableColumn.footer = ({ table }: any) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            className: rowSelectCheckboxClassName || 'form-check-input',
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
            style: { cursor: 'pointer', ...parsedRowSelectCheckboxStyle }
          }}
        />
      )
    }

    return [selectableColumn, ...columns]
  }, [
    columns,
    hasFooter,
    rowSelectCheckboxClassName,
    stringifiedRowSelectCheckboxStyle
  ])

  /* ======================
      Initialize Table
  ====================== */

  const initialState: InitialTableState = {
    pagination: {
      pageIndex: pageIndex,
      pageSize: pageSize
    }
    // Setting default column order here will only work if the
    // columnOrder feature is not implemented. If it is, it will
    // defer to the columnOrder state.
    // columnOrder: []
  }

  const tableInstance = useReactTable({
    data: data,
    // If you add an array in here, then it will cause an infinite rerender.
    // This is why we memoize cols and colsPlusSelectable instead.
    columns: showRowSelection ? colsPlusSelectable : cols,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

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
      sorting,
      rowSelection,
      columnOrder,
      columnVisibility
    },

    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,

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
     Column Visibility 
  ====================== */

  const visibleLeafColumns = tableInstance.getVisibleLeafColumns() // => [ ... ]

  // If no columns are visible then we return null in the JSX instead of showing the table.
  const atLeastOneVisibleColumn =
    Array.isArray(visibleLeafColumns) && visibleLeafColumns.length > 0

  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect watches for changes to stringifiedColumnVisibilityProp
  // such that on change, it will call table.setColumnVisibility(). This
  // allows changes to the visible columns to be dynamically passed in
  // from the consuming environment.
  //
  ///////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const parsedColumnVisibilityProp = JSON.parse(
      stringifiedColumnVisibilityProp
    )

    // Rather than typecasting with parsedColumnVisibilityProp as VisibilityState,
    // we can use a typeguard. Otherwise, we'll get a Typescript complaint:
    // Argument of type 'unknown' is not assignable to parameter of type 'Updater<VisibilityState>'.
    if (isBooleanObject(parsedColumnVisibilityProp)) {
      tableInstance.setColumnVisibility(parsedColumnVisibilityProp)
    }
  }, [stringifiedColumnVisibilityProp, tableInstance])

  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() watches for changes to local columnVisibility state.
  // If it changes AND there is a columnVisibilityChange prop, then
  // it executes that callback, passing the internal columnVisibility state
  // back out to the consuming environment. This allows an externally controlled
  // implementation to stay in sync with any internal state changes. The use
  // of a ref here is merely a hack to bypass the useEffect's dependency array
  // such that the function prop doesn't trigger the useEffect on each rerender.
  //
  ///////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (typeof onColumnVisibilityChangeRef.current !== 'function') {
      return
    }

    const handleColumnVisibilityChange = onColumnVisibilityChangeRef.current
    handleColumnVisibilityChange?.(columnVisibility)
  }, [columnVisibility])

  /* ======================
        useEffect() 
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() watches changes to columnOrder.
  // columnOrder is passed in as an array, but then gets turned into JSON
  // prior to being passed into the useEffect(). Once inside the useEffect(),
  // it gets parsed back to an array. This is another hack to avoid triggering
  // the dependency array on every render.
  //
  // Initially, I was doing this:
  //
  //   useEffect(() => {
  //     const parsedColumnOrderProp = JSON.parse(stringifiedColumnOrderProp)
  //     if (isStringArray(parsedColumnOrderProp)) {
  //       tableInstance.setColumnOrder(parsedColumnOrderProp)
  //     }
  //   }, [stringifiedColumnOrderProp, tableInstance])
  //
  // But we can actually just set the state directly.
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const parsedColumnOrderProp = JSON.parse(stringifiedColumnOrderProp)
    if (isStringArray(parsedColumnOrderProp)) {
      setColumnOrder(parsedColumnOrderProp)
    }
  }, [stringifiedColumnOrderProp])

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // This useEffect() watches for changes to rowSelection, then calls a refed
  // version of the onSelectionChange prop. Initially, I tried to avoid running
  // onSelectionChange() in the useEffect() by doing this directly within
  // useReactTable's onRowSelectionChange confirguration. While it seemed to work,
  // it also caused a warning to occur:
  //
  //   Cannot update a component (`KitchenSinkExample`) while rendering a different component (`Table`).
  //
  //
  // onRowSelectionChange: (value) => {
  //   // The value can be: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
  //   const getSelectedData = (rowSelectionState: RowSelectionState) => {
  //     const allFlatRows = tableInstance.getCoreRowModel().flatRows
  //     const selectedData: Record<string, any>[] = []
  //
  //     for (const key in rowSelectionState) {
  //       if (rowSelectionState[key] === true) {
  //         const flatRow = allFlatRows[parseInt(key)]
  //         if (typeof flatRow !== 'undefined' && 'original' in flatRow) {
  //           selectedData.push(flatRow.original)
  //         }
  //       }
  //     }
  //     return selectedData
  //   }
  //
  //   if (typeof value === 'function') {
  //     setRowSelection((old) => {
  //       const rowSelectionState = value(old)
  //       const selectedData = getSelectedData(rowSelectionState)
  //       onSelectionChange?.(selectedData)
  //       return rowSelectionState
  //     })
  //   } else {
  //     const rowSelectionState = value
  //     const selectedData = getSelectedData(rowSelectionState)
  //     onSelectionChange?.(selectedData)
  //     setRowSelection(value)
  //   }
  // },
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (typeof onSelectionChangeRef.current !== 'function') {
      return
    }
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }
    const flatRows = tableInstance.getSelectedRowModel().flatRows
    const newSelectedData = flatRows.map((flatRow) => {
      return flatRow.original
    })

    const handleSelectionChange = onSelectionChangeRef.current
    handleSelectionChange?.(newSelectedData)
  }, [tableInstance, rowSelection])

  /* ======================
        useEffect()
  ====================== */
  // This useEffect() watches the showPagination prop.

  const setPageSize = tableInstance.setPageSize
  useEffect(() => {
    if (!showPagination) {
      setPageSize(dataLength)
    } else {
      setPageSize(pageSizeProp)
    }
  }, [dataLength, pageSizeProp, showPagination, setPageSize])

  /* ======================
        renderTitle()
  ====================== */

  const renderTitle = () => {
    if (!title) {
      return null
    }

    const titleJSX =
      typeof title === 'string' ? (
        <h2 className={titleClassName} style={titleStyle}>
          {title}
        </h2>
      ) : (
        title
      )

    const subtitleJSX =
      typeof subtitle === 'string' ? (
        <h6 className={subtitleClassName} style={subtitleStyle}>
          {subtitle}
        </h6>
      ) : (
        subtitle
      )

    return (
      <div
        className={titleContainerClassName}
        style={{
          borderBottom: '1px solid #dee2e6',
          padding: 10,
          ...titleContainerStyle
        }}
      >
        {titleJSX}
        {subtitle && subtitleJSX}
      </div>
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
                    className={
                      columnFilterClassName ||
                      'form-control form-control-sm m-0 min-h-0 border-[#dee2e6] p-0.5 text-[10px] leading-none'
                    }
                    column={header.column}
                  />
                )

                // The enableSorting prop will not exist if it hasn't been explicitly defined
                // within the column definition. For that reason, we are checking if the value
                // is exactly false. In that case, we set disableSort to true. Otherwise, we
                // assume that column is sortable and set disableSort to false.
                const disableSort =
                  header?.column?.columnDef?.enableSorting === false
                    ? true
                    : false

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
                          asc: (
                            <div className='flex items-center justify-center gap-1 text-xs leading-none font-normal whitespace-nowrap'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='12'
                                height='12'
                                fill='currentColor'
                                viewBox='0 0 16 16'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z'
                                />
                              </svg>
                            </div>
                          ),
                          desc: (
                            <div className='flex items-center justify-center gap-1 text-xs leading-none font-normal whitespace-nowrap'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='12'
                                height='12'
                                fill='currentColor'
                                viewBox='0 0 16 16'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z'
                                />
                              </svg>
                            </div>
                          )
                        }[header.column.getIsSorted() as string] ??
                          (disableSort ? null : (
                            <div className='flex items-center justify-center gap-1 text-xs leading-none font-normal whitespace-nowrap'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='12'
                                height='12'
                                fill='currentColor'
                                viewBox='0 0 16 16'
                              >
                                <path d='M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435a4.9 4.9 0 0 1 .106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z' />
                              </svg>
                              Sort
                            </div>
                          ))}
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
        {tableInstance.getRowModel().rows.map((row) => {
          const isSelected = row.getIsSelected()

          return (
            <tr
              key={row.id}
              className={
                isSelected && tableHighlightSelectedRows ? 'table-active' : ''
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={tdClassName} style={tdStyle}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          )
        })}
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
    if (!atLeastOneVisibleColumn) {
      return (
        <div className='py-6 text-center text-sm font-medium italic'>
          No Columns Selected!
        </div>
      )
    }

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
        <div className='my-6 text-center text-3xl leading-none font-black text-violet-800'>
          Loading...
        </div>
      )
    }

    if (!data || !columns) {
      //# Return error Alert indicating that data or columns is not defined
      return null
    }

    return (
      <div className={containerClassName} style={containerStyle}>
        {renderTitle()}

        <Controls
          // className & style props.
          controlsClassName={controlsClassName}
          controlsStyle={controlsStyle}
          globalFilterClassName={globalFilterClassName}
          globalFilterStyle={globalFilterStyle}
          //
          paginationClassName={paginationClassName}
          paginationStyle={paginationStyle}
          paginationItemClassName={paginationItemClassName}
          paginationItemStyle={paginationItemStyle}
          paginationButtonClassName={paginationButtonClassName}
          paginationButtonStyle={paginationButtonStyle}
          pageNumberInputClassName={pageNumberInputClassName}
          pageNumberInputStyle={pageNumberInputStyle}
          pageSizeSelectClassName={pageSizeSelectClassName}
          pageSizeSelectStyle={pageSizeSelectStyle}
          //
          exportCSVButtonClassName={exportCSVButtonClassName}
          exportCSVButtonStyle={exportCSVButtonStyle}
          //
          columnSelectCheckboxGroupClassName={
            columnSelectCheckboxGroupClassName
          }
          columnSelectCheckboxGroupStyle={columnSelectCheckboxGroupStyle}
          columnSelectCheckboxClassName={columnSelectCheckboxClassName}
          columnSelectCheckboxStyle={columnSelectCheckboxStyle}
          // Other...
          atLeastOneVisibleColumn={atLeastOneVisibleColumn}
          noControlsShown={noControlsShown}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          pageSize={pageSizeProp}
          pageSizes={pageSizes}
          showControls={showControls}
          showGlobalFilter={showGlobalFilter}
          showPagination={showPagination}
          showExportCSVButton={showExportCSVButton}
          showColumnSelectCheckboxes={showColumnSelectCheckboxes}
          table={tableInstance}
          csvExportFileName={csvExportFileName}
          csvHeaders={csvHeaders}
        />

        {renderTable()}
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return renderContent()
}
