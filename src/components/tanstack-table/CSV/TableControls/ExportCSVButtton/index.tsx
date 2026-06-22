import { Fragment, useRef } from 'react'
// https://www.youtube.com/watch?v=c_pJCw8mLOE
import { CSVLink } from 'react-csv'

import { Button } from '../../../../Button'

import type { ExportCSVButtonProps } from '../../types'

/* ========================================================================
                              ExportCSVButton
======================================================================== */

export const ExportCSVButton = ({
  className = '',
  csvHeaders,
  data,
  disabled = false,
  fileName = '',
  style = {}
}: ExportCSVButtonProps) => {
  const csvLinkRef = useRef<any>(null)

  /* ======================
          return
  ====================== */

  return (
    <Fragment>
      <CSVLink
        data={data}
        // If fileName is provided, but doesn't end in .csv, the package appends it.
        filename={fileName || 'exported-data.csv'}
        // If headers is undefined, then it exports the entire data set.
        headers={csvHeaders}
        ref={csvLinkRef}
        style={{ display: 'none' }}
        target='_blank'
      >
        Hidden CSV Export Link
      </CSVLink>

      <Button
        className={className}
        disabled={disabled}
        onClick={() => {
          if (csvLinkRef?.current && csvLinkRef?.current?.link) {
            csvLinkRef.current.link.click()
          }
        }}
        size='sm'
        style={style}
        type='button'
        variant='primary'
      >
        Export To CSV
      </Button>
    </Fragment>
  )
}
