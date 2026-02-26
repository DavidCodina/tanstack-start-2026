import { useRef } from 'react'
import { OnMountCounter } from './'
import type { CounterAPI } from './'

/* ========================================================================
      
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Since React 16.8, useImperativeHandle has been available to expose
// various pieces of a component's internals to the parent component.
// This is similar to how refs previously worked in class-based components.
// However, we can use a different pattern that calls an onMount callback,
// and passes that data to the parent, which can then set it in a ref.
//
// However, there's an even easier way, which is to simply pass a ref directly
// as a prop to the component, and let the component immediately assign its
// API to that ref.
//
///////////////////////////////////////////////////////////////////////////

export const OnMountCounterDemo = () => {
  const counterRef = useRef<HTMLDivElement | null>(null)

  // One can do this:
  //
  //   const apiRef = useRef<React.Ref<unknown>>(null)
  //
  // but then you will have to add Typescript typeguards below.
  // Instead, it's easiest to use the CounterAPI type.

  const apiRef = useRef<CounterAPI | null>(null)

  /* ======================
        handleClick()
  ====================== */

  const handleClick = (action: 'decrement' | 'reset' | 'increment') => {
    const api = apiRef.current
    if (api === null) {
      return
    }

    // if (
    //   typeof api === 'object' &&
    //   'decrement' in api &&
    //   typeof api.decrement === 'function' &&
    //   'increment' in api &&
    //   typeof api.increment === 'function' &&
    //   'reset' in api &&
    //   typeof api.reset === 'function'
    // ) {

    // Note: value here will always be the current count, BEFORE the
    // action is taken. To get the newValue, use the onChange prop.
    const { decrement, increment, reset /*, value */ } = api

    if (action === 'decrement') {
      decrement()
    } else if (action === 'reset') {
      reset()
    } else if (action === 'increment') {
      increment()
    }

    // }
  }

  /* ======================
      renderControls()
  ====================== */

  const renderControls = () => {
    return (
      <div className='btn-group mx-auto mb-6' style={{ display: 'table' }}>
        <button
          className='btn-gray btn-sm'
          onClick={() => handleClick('decrement')}
        >
          Decrement
        </button>

        <button
          className='btn-gray btn-sm'
          onClick={() => handleClick('reset')}
        >
          Reset
        </button>

        <button
          className='btn-gray btn-sm'
          onClick={() => handleClick('increment')}
        >
          Increment
        </button>
      </div>
    )
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='mx-auto max-w-[800px] rounded-lg border border-neutral-400 bg-white p-4 shadow'>
        {renderControls()}

        <OnMountCounter
          apiRef={apiRef}
          // onMount={(api) => { apiRef.current = api }}
          onChange={(newValue) => {
            console.log('newValue:', newValue)
          }}
          ref={counterRef}
        />
      </div>
    </>
  )
}
