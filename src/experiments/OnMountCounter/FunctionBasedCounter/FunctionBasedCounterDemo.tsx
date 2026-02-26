import { useRef } from 'react'
import { FunctionBasedCounter } from './'
import type { CounterRef } from './'

/* ========================================================================
      
======================================================================== */

export const FunctionBasedCounterDemo = () => {
  const counterRef = useRef<CounterRef | null>(null)

  /* ======================
        handleClick()
  ====================== */

  const handleClick = (action: 'decrement' | 'reset' | 'increment') => {
    const counter = counterRef.current

    if (action === 'decrement') {
      counter?.decrement()
    } else if (action === 'reset') {
      counter?.reset()
    } else if (action === 'increment') {
      counter?.increment()
    }
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='mx-auto max-w-[800px] rounded-lg border border-neutral-400 bg-white p-4 shadow'>
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

        <FunctionBasedCounter ref={counterRef} />
      </div>
    </>
  )
}
