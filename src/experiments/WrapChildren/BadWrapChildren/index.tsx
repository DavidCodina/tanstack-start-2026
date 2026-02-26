import { Children } from 'react'
import type { JSX, ReactNode } from 'react'

type Props = {
  children: ReactNode
  wrapper: (child: ReactNode, key: number) => JSX.Element
}

/* ========================================================================
    
======================================================================== */
// At first glance, this implementation looks like it would work.
// However, in cases where you consume BadWrapChildren and the children
// you pass in are already in a <Fragment> then this implementation breaks.

export const BadWrapChildren = ({ children, wrapper }: Props) => {
  const childrenArray = Children.toArray(children)
  const wrappedChildren = childrenArray.map((child, index) => {
    return wrapper(child, index)
  })
  return <>{wrappedChildren}</>
}
