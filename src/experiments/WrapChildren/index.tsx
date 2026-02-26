import { useExtractValidChildren } from './useExtractValidChildren'
import type { ComponentType, JSX, ReactNode } from 'react'

/* ========================================================================
    
======================================================================== */

type Props = {
  children: ReactNode
  customFragmentTypes?: ComponentType<any>[]
  includeTextAndNumbers?: boolean
  wrapper: (child: ReactNode, key: number) => JSX.Element
}

export const WrapChildren = ({
  children,
  customFragmentTypes = [],
  includeTextAndNumbers = false,
  wrapper
}: Props) => {
  const childrenArray = useExtractValidChildren({
    children,
    customFragmentTypes,
    includeTextAndNumbers
  })

  const wrappedChildren = childrenArray.map((child, index) => {
    return wrapper(child, index)
  })

  return <>{wrappedChildren}</>
}
