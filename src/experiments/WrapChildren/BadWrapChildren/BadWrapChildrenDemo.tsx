import { BadWrapChildren } from './'

import type { ReactNode } from 'react'

export const wrapNode = (child: ReactNode, key: number) => {
  return (
    <div
      key={key}
      className='inline-block overflow-hidden rounded-lg border-2 border-dashed border-sky-400 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]'
    >
      {child}
    </div>
  )
}

/* ========================================================================
    
======================================================================== */

export const BadWrapChildrenDemo = () => {
  const childElements = (
    <>
      <div className='h-20 w-20 bg-white'></div>
      <div className='h-20 w-20 bg-white'></div>
      <div className='h-20 w-20 bg-white'></div>
    </>
  )
  return (
    <div className='flex flex-wrap justify-center gap-4'>
      <BadWrapChildren wrapper={wrapNode}>{childElements}</BadWrapChildren>
    </div>
  )
}
