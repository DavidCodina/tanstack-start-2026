import './Placeholder.css'
import * as React from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface IPlaceholder {
  children: ReactNode
  className?: string
  style?: CSSProperties
}
/* ========================================================================
  
======================================================================== */

export const Placeholder = ({
  children,
  className,
  style = {}
}: IPlaceholder): React.JSX.Element => {
  return (
    <div className={className || 'rte-placeholder'} style={style}>
      {children}
    </div>
  )
}
