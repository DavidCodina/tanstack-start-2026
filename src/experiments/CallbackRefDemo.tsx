import * as React from 'react'

type SquareProps = React.ComponentProps<'div'> & {
  show: boolean
}

const Square = ({ ref, show, ...otherProps }: SquareProps) => {
  if (!show) return null
  return (
    <div
      {...otherProps}
      ref={ref}
      className='size-[120px] rounded border border-sky-700 bg-sky-500'
    />
  )
}

/* ========================================================================

======================================================================== */

export const CallbackRefDemo = () => {
  const [show, setShow] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [isMounted, setIsMounted] = React.useState(false)

  /* ======================
  _callbackRef() (triple fire)
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // useCallback() here prevents instance recreation and
  // invocation resulting from other state changes like count.
  // Note: When Square's JSX renders, the callback actually triple fires.
  // This is a known behavior with conditional rendering in React and callback refs.
  //
  //   1. First Render Cycle: The show prop changes to true. Square renders JSX,
  //      and ref callback fires with the DOM node.
  //
  //   2. Reconciliation: React realizes it needs to update and triggers another render.
  //      During reconciliation, React temporarily "detaches" the ref and executes callback with null.
  //
  //   3. Reattachment: React "reattaches" the ref with the same element and executes callback with node again.
  //
  ///////////////////////////////////////////////////////////////////////////

  const _squareCallbackRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) {
        console.log('\nNo node')
      } else {
        console.log('\nNode:', node)
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      // When you return a cleanup function, React 19 changes how it handles the ref callback:
      //   - Without cleanup: React calls your callback with null on unmount (the traditional behavior)
      //   - With cleanup: React skips calling your callback with null and just runs the cleanup function instead.
      //
      // The cleanup function replaces the need for the null call. The logic is:
      //   - If you return cleanup, React assumes you're handling unmount logic there
      //   - The if (!node) branch becomes unreachable/unnecessary
      //
      ///////////////////////////////////////////////////////////////////////////
      return () => {
        console.log('\nSquare cleanup')
      }
    },
    []
  )

  /* ======================
        callbackRef()
  ====================== */

  const squareRef = React.useRef<HTMLDivElement>(null)
  const callbackRef = React.useCallback((node: HTMLDivElement | null) => {
    squareRef.current = node
    setIsMounted(!!node)
  }, [])

  /* ======================
        useEffect()
  ====================== */

  React.useEffect(() => {
    const square = squareRef.current
    if (!square) {
      console.log('\nNo node')
    } else {
      console.log('\nNode:', square)
    }
  }, [isMounted])

  /* ======================
          return
  ====================== */

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        className='min-w-[120px] cursor-pointer rounded border border-sky-700 bg-sky-500 px-2 py-1 text-sm font-bold text-white'
        onClick={() => setCount((v) => v + 1)}
      >
        Count: {count}
      </button>

      <button
        className='min-w-[120px] cursor-pointer rounded border border-sky-700 bg-sky-500 px-2 py-1 text-sm font-bold text-white'
        onClick={() => setShow((v) => !v)}
      >
        {show ? 'Hide' : 'Show'} Square
      </button>

      <Square key='square' ref={callbackRef} show={show} />
    </div>
  )
}
