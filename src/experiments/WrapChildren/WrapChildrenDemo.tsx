import { Fragment } from 'react'
import { WrapChildren } from './'
import type { ReactNode } from 'react'

export const wrapNode = (child: ReactNode, key: number) => {
  return (
    <div
      key={key}
      className={`inline-block overflow-hidden rounded-lg border-2 border-dashed border-sky-400 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]`}
    >
      {child}
    </div>
  )
}

const CustomFragment = ({ children }: { children: ReactNode }) => children

/* ========================================================================
    
======================================================================== */

export const WrapChildrenDemo = () => {
  const childElements = (
    <>
      <CustomFragment>
        <div className='h-20 w-20 bg-white'></div>
        <div className='h-20 w-20 bg-white'></div>
      </CustomFragment>
      <Fragment>
        <div className='h-20 w-20 bg-white'></div>
        <div className='h-20 w-20 bg-white'></div>
      </Fragment>
      <div className='h-20 w-20 bg-white'></div>
      Some text
      {42}
    </>
  )

  return (
    <div className='flex flex-wrap justify-center gap-4'>
      <WrapChildren
        customFragmentTypes={[CustomFragment]}
        // includeTextAndNumbers={true}
        wrapper={wrapNode}
      >
        {childElements}
      </WrapChildren>
    </div>
  )
}
