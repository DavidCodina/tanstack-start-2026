import React from 'react'

export interface IControls {
  controlsClassName: string
  controlsStyle: React.CSSProperties

  globalFilterClassName: string
  globalFilterStyle: React.CSSProperties

  paginationClassName: string
  paginationStyle: React.CSSProperties
  paginationItemClassName: string
  paginationItemStyle: React.CSSProperties
  paginationButtonClassName: string
  paginationButtonStyle: React.CSSProperties
  pageNumberInputClassName: string
  pageNumberInputStyle: React.CSSProperties
  pageSizeSelectClassName: string
  pageSizeSelectStyle: React.CSSProperties

  noControlsShown: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>

  pageSize: number
  pageSizes: number[]
  showControls: boolean
  showGlobalFilter: boolean
  showPagination: boolean

  /** The table instance returned from useReactTable. */
  table: any
}
