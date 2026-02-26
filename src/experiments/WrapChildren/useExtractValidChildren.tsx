import { Children, Fragment, isValidElement, useMemo } from 'react'
import type { ComponentType, ReactElement, ReactNode } from 'react'

/* ========================================================================
    
======================================================================== */

type UseExtractValidChildrenProps = {
  children: ReactNode
  customFragmentTypes?: ComponentType<any>[]
  includeTextAndNumbers?: boolean
}

export const useExtractValidChildren = ({
  children,
  customFragmentTypes = [],
  includeTextAndNumbers = false
}: UseExtractValidChildrenProps): ReactNode[] => {
  const isFragment = (element: ReactElement): boolean => {
    return (
      element.type === Fragment ||
      customFragmentTypes.some((type) => element.type === type)
    )
  }

  const extractValidChildren = (children: ReactNode): ReactNode[] => {
    return Children.toArray(children).reduce((acc: ReactNode[], child) => {
      if (isValidElement(child)) {
        if (isFragment(child)) {
          return [
            ...acc,
            ...extractValidChildren((child.props as any).children)
          ]
        }
        return [...acc, child]
      } else if (
        includeTextAndNumbers &&
        (typeof child === 'string' || typeof child === 'number')
      ) {
        return [...acc, child]
      }
      return acc
    }, [])
  }

  return useMemo(
    () => extractValidChildren(children),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, customFragmentTypes, includeTextAndNumbers]
  )
}
