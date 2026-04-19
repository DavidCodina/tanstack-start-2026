import { forwardRef, useEffect, useState } from 'react'
import type { MutableRefObject } from 'react'

type Ref = HTMLDivElement

export type CounterAPI = {
  decrement: () => void
  increment: () => void
  reset: () => void
  value: number
}

type Props = {
  onChange?: (newValue: number) => void
  onMount?: ({ decrement, increment, reset }: CounterAPI) => void
  // export type CounterAPI above for convenience, but DO NOT use it as
  // the apiRef type here. Why? It would make passing a ref to the
  // consumed component's apiRef prop too strict:
  // ❌ MutableRefObject<CounterAPI | null>
  apiRef?: MutableRefObject<unknown>
}

/* ========================================================================
      
======================================================================== */

export const OnMountCounter = forwardRef<Ref, Props>(
  ({ apiRef, onChange, onMount }, ref) => {
    const [value, setValue] = useState(0)

    const decrement = () => setValue((v) => v - 1)
    const reset = () => setValue(0)
    const increment = () => setValue((v) => v + 1)

    if (typeof apiRef !== 'undefined') {
      apiRef.current = {
        decrement,
        increment,
        reset,
        value
      }
    }

    /* ======================
          useEffect()
    ====================== */

    useEffect(() => {
      onChange?.(value)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    /* ======================
          useEffect()
    ====================== */

    useEffect(() => {
      onMount?.({
        decrement,
        increment,
        reset,
        value
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /* ======================
          return
  ====================== */

    return (
      <div ref={ref}>
        <div className='btn-group mx-auto mb-6' style={{ display: 'table' }}>
          <button
            className='btn-blue btn-sm min-w-[100px]'
            onClick={decrement}
            type='button'
          >
            Decrement
          </button>

          <button
            className='btn-blue btn-sm min-w-[100px]'
            onClick={reset}
            type='button'
          >
            Reset
          </button>
          <button
            className='btn-blue btn-sm min-w-[100px]'
            onClick={increment}
            type='button'
          >
            Increment
          </button>
        </div>

        <div className='text-center text-2xl font-bold text-blue-500'>
          Count: {value}
        </div>
      </div>
    )
  }
)

OnMountCounter.displayName = 'OnMountCounter'
