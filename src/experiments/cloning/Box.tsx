// https://react.dev/reference/react/cloneElement
// https://react.dev/reference/react/isValidElement
import { cloneElement, isValidElement } from 'react'

const addPropsIfValidElement = (element: any, props: any) => {
  if (isValidElement(element)) {
    const Element = cloneElement(element, props)
    return Element
  }
  return element
}

/* ========================================================================
      
======================================================================== */

const Box = ({ style = {} }: any) => {
  return (
    <div
      style={{
        backgroundColor: 'rgb(21,194,19)',
        height: 50,
        width: 50,
        ...style
      }}
    />
  )
}

const OrangeBox = addPropsIfValidElement(<Box />, {
  style: {
    backgroundColor: '	#FF9933',
    border: '1px solid #333',
    borderRadius: 10,
    boxShadow: '0px 1px 2px rgba(0,0,0,0.25)'
  }
})

export const BoxDemo = () => {
  return (
    <div className='mb-6 flex items-center justify-center gap-6'>
      <Box />

      {OrangeBox}
    </div>
  )
}
