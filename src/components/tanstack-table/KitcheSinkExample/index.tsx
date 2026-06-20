import { useEffect, useState } from 'react'

import { Table } from './Table'
import { Switch } from './Switch'

import { columns as cols } from './columns'
import data from '../data.json'
import { sleep } from '@/utils'

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

export const KitchenSinkExample = () => {
  const [data, setData] = useState<any[] | null>(null)
  const [columns, setColumns] = useState<any[] | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('pending')

  const [selection, setSelection] = useState<Record<string, boolean>[] | null>(
    null
  )

  const [titleInfo, setTitleInfo] = useState({
    title: 'Tanstack Table Demo',
    subtitle: 'This is an amazing table!'
  })

  const [columnOrder, setColumnOrder] = useState<string[]>([])

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({ select: false })

  const [showControls, setShowControls] = useState(true)
  const [showGlobalFilter, setShowGlobalFilter] = useState(true)
  const [showPagination, setShowPagination] = useState(true)

  const [showExportCSVButton, setShowExportCSVButton] = useState(true)

  const [showVisibilityChecks, setShowVisibilityChecks] = useState(false)

  const [showColumnFilters, setShowColumnFilters] = useState(true)
  const [showFooter, setShowFooter] = useState(false)

  /* ======================
     toggleColumnOrder() 
  ====================== */

  const toggleColumnOrder = () => {
    if (columnOrder.length === 0) {
      // An arbitrary ordering for demo purposes.
      // Unknown elements are ignored. Unlisted elements fallback
      // to their default order at the end of the list.
      setColumnOrder(['select', 'id', 'age', 'abc123', 'email'])
    } else {
      setColumnOrder([])
    }
  }

  /* ======================
    toggleRowSelect() 
  ====================== */

  const toggleRowSelect = () => {
    setColumnVisibility((previousColumnVisibility) => {
      // The select property could be omitted, which means it is true,
      // assuming onSelectionChange prop has been passed in, thereby
      // enabling the feature.
      if (
        !previousColumnVisibility.hasOwnProperty('select') ||
        previousColumnVisibility.select === true
      ) {
        return {
          ...previousColumnVisibility,
          select: false
        }
      }
      return {
        ...previousColumnVisibility,
        select: true
      }
    })
  }

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
         useEffect()
  ====================== */

  useEffect(() => {
    console.log('Selected data:', selection)
  }, [selection])

  /* ======================
    renderDemoControls()
  ====================== */

  const renderDemoControls = () => {
    return (
      <div className='mb-6 flex flex-wrap justify-center gap-4'>
        <Switch
          checked={showControls}
          id='toggle-controls'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowControls((v) => !v)
          }}
          text='Toggle Controls'
        />

        <Switch
          checked={showControls}
          id='toggle-title'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            if (titleInfo?.title === '') {
              setTitleInfo({
                title: 'An amazing title here!',
                subtitle: "This is an amazing table! It can do lot's of stuff!"
              })
            } else {
              setTitleInfo({
                title: '',
                subtitle: ''
              })
            }
          }}
          text='Toggle Title'
        />

        <Switch
          checked={showGlobalFilter}
          id='toggle-global-filter'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowGlobalFilter((v) => !v)
          }}
          text='Toggle Global Filter'
        />

        <Switch
          id='toggle-pagination'
          checked={showPagination}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowPagination((v) => !v)
          }}
          text='Toggle Pagination'
        />

        {/*  const [showExportCSVButton, setShowExportCSVButton] = useState(true) */}

        <Switch
          id='toggle-csv-button'
          checked={showExportCSVButton}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowExportCSVButton((v) => !v)
          }}
          text='Toggle CSV Button'
        />

        <Switch
          id='toggle-column-selection'
          checked={showVisibilityChecks}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowVisibilityChecks((v) => !v)
          }}
          text='Toggle Column Selection'
        />

        <Switch
          checked={showColumnFilters}
          id='toggle-column-filters'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowColumnFilters((v) => !v)
          }}
          text='Toggle Column Filters'
        />

        <Switch
          checked={columnVisibility?.select !== false}
          id='toggle-select-column'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={toggleRowSelect}
          text='Toggle Row Select'
        />

        <Switch
          id='toggle-footer'
          checked={showFooter}
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={() => {
            setShowFooter((v) => !v)
          }}
          text='Toggle Footer'
        />

        <Switch
          checked={columnOrder.length !== 0}
          id='toggle-column-order'
          labelStyle={{
            fontFamily: 'Inconsolata, monospace'
          }}
          onChange={toggleColumnOrder}
          text='Toggle Column Order'
        />
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      {renderDemoControls()}

      <Table
        // containerClassName and containerStyle are useful for setting like width, margin, etc.
        // The container element wraps controlsContainer and the tableContainer.
        containerClassName='' // [--table-border-color:red]
        containerStyle={{
          backgroundColor: '#fff',
          border: '1px solid #409',
          borderRadius: 15,
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
        titleContainerClassName=''
        titleContainerStyle={{ textAlign: 'center' }}
        titleClassName='outline-strong outline-sky outline-width-1 outline-shadow m-0 mb-2 p-0 leading-none font-bold uppercase'
        titleStyle={{ fontSize: 28 }}
        subtitleClassName='leading-none text-sm p-0 m-0'
        subtitleStyle={{ color: '#409' }}
        controlsClassName=''
        controlsStyle={{}}
        // tableContainer is the div that wraps the actual <table> element.
        // Think of this clike the <div className='table-responsive'> wrapper
        // that is often implemented with bootstrap.
        tableContainerClassName=''
        tableContainerStyle={{}}
        tableClassName='' // table [--table-active-color:#fff] [--table-active-bg:#409]
        tableStyle={{}}
        tableSize='sm'
        tableBordered={true}
        // tableBorderless={true} // Removes row lines (tableBordered has precedence).
        // Removes the outer border of the table (has precedence over tableBordered).
        // tableFlush is generally not needed if already using tableBorderless. Generally,
        // you'd want to remove the border from the actual table, and instead pass in a
        // custom border style to the top-level container using containerStyle

        tableFlush={true}
        tableStriped={true}
        tableHover={true}
        tableHighlightSelectedRows={true}
        headerClassName='text-center align-top'
        headerStyle={{ color: '#444' }}
        thClassName='whitespace-nowrap'
        thStyle={{}}
        tdClassName=''
        tdStyle={{}}
        globalFilterClassName=''
        globalFilterStyle={{}}
        columnFilterClassName=''
        columnFilterStyle={{}}
        // className & style props for pagination.
        paginationClassName=''
        paginationStyle={{}}
        paginationItemClassName=''
        paginationItemStyle={{}}
        paginationButtonClassName=''
        paginationButtonStyle={{}}
        pageNumberInputClassName=''
        pageNumberInputStyle={{}}
        pageSizeSelectClassName=''
        pageSizeSelectStyle={{}}
        exportCSVButtonClassName=''
        exportCSVButtonStyle={{}}
        rowSelectCheckboxClassName=''
        rowSelectCheckboxStyle={{}}
        columnSelectCheckboxGroupClassName=''
        columnSelectCheckboxGroupStyle={{}}
        columnSelectCheckboxClassName=''
        columnSelectCheckboxStyle={{}}
        bodyClassName='text-center align-middle'
        bodyStyle={{}}
        footerClassName='text-center align-middle'
        footerStyle={{}}
        ///////////////////////////////////////////////////////////////////////////
        //
        // Alternative approach: if you want to implement the feature, but not show
        // the column, then you can pass { select: false } to the columnVisibility prop.
        //
        // Internally, table takes the onSelectionChange prop and wraps it in a ref
        // before passing it into useEffect(). This means that there's no need to
        // wrap it in a useCallback() from the consuming environment.
        //
        ///////////////////////////////////////////////////////////////////////////

        data={data}
        columns={columns}
        // columnOrder is an optional prop that allows the consumer to
        // dynamically modify the default order of the columns. It works
        // on mount, and anytime thereafter. columnOrder is never set from
        // within, so there's no need to have a callback prop like
        // to update the external state.
        columnOrder={columnOrder}
        // columnVisibility is an optional prop that allows the consumer to
        // dynamically modify the default visibility of the columns. It works
        // on mount, and anytime thereafter.
        columnVisibility={columnVisibility}
        // If one is controlling visibility externally AND also showing the built-in
        // visibility check UI, then it's best to also pass in an onColumnVisibilityChange
        // callback. That way if the internal visibility state changes, we can pass
        // it back to the consuming environment, so the two states remain in sync.
        onColumnVisibilityChange={(newColumnVisibility: any) => {
          setColumnVisibility(newColumnVisibility)
        }}
        // pageIndex={1}
        // pageSize={5}

        status={status}
        showGlobalFilter={showGlobalFilter} // Default: true.
        // pageSize will revert to the default pageSize when
        // changing showPagination from false to true.
        showPagination={showPagination} // Default: true.
        // Optional: Boolean that allows consumer to opt-in to showing the built-in column
        // select (visibility) checkboxes. Note: it's also possible to build an external
        // checkbox implementation that modifies the external columnVisibility state.
        showExportCSVButton={showExportCSVButton}
        showColumnSelectCheckboxes={showVisibilityChecks} // Default: true
        // If showGlobalFilter, showPagination and showVisibilityChecks are all false,
        // the controls will be hidden. However, a better approach is to use showControls.
        showControls={showControls}
        showColumnFilters={showColumnFilters}
        // If Table does not detect a footer property on the first column in the column
        // definition (i.e., !hasFooter), then showFooter will essentially be disabled.
        showFooter={showFooter} // Default: true
        onSelectionChange={(selectedData: Record<any, any>[]) => {
          setSelection(selectedData)
        }}
        title={titleInfo?.title}
        subtitle={titleInfo?.subtitle}
        // In this demo, we're toggling the select column by changing the columnVisibility.
        // However, assuming that the select column visibility is true, then we could
        // alternatively, use this as a shorthand.
        showRowSelection={true}
        // Provide an optional name for the CSV export. Otherwise it defaults to exported-data.csv
        csvExportFileName='my-csv-export'
        // https://github.com/react-csv/react-csv#nested-json-data
        // Passing in csvHeaders allows you to limit what fields are exported.
        // It also allows you to relabel the properties when being exported.
        csvHeaders={[
          { label: 'id', key: 'id' },
          { label: 'First Name', key: 'first_name' },
          { label: 'Last Name', key: 'last_name' }
        ]}
      />
    </>
  )
}
