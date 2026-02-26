import { useState } from 'react'
import { ClickCounter } from './'

/* ========================================================================
      
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This is an example of a component that can be either controlled or uncontrolled.
// In React, a controlled component is one where the parent component fully manages
// the state and passes it down as props, while an uncontrolled component manages its
// own state internally. The ClickCounter component can function in both ways, depending
// on whether the value prop is provided and managed by the parent component. As such, we
// could call this a 'hybrid' component, or just a controlled/uncontrolled component.

// Key Features:

//   - Synchronization: The internal state (internalValue) and the external state (externalValue)
//     are kept in sync using useEffect hooks.

//   - Flexibility: The component can switch between controlled and uncontrolled modes based on
//     the presence of the value prop.
//
///////////////////////////////////////////////////////////////////////////

export const ControlledClickCounterDemo = () => {
  const [externalValue, setExternalValue] = useState(0)

  /* ======================
        controls
  ====================== */

  const controls = (
    <div
      className={`mx-auto mb-6 inline-flex justify-center gap-2 rounded-lg border border-blue-600 bg-blue-500 font-bold text-white [&>button]:min-w-[100px] [&>button]:px-2 [&>button]:py-1`}
      style={{ display: 'table' }}
    >
      <button onClick={() => setExternalValue((v) => v - 1)}>decrement</button>
      <button onClick={() => setExternalValue(0)}>reset</button>
      <button onClick={() => setExternalValue((v) => v + 1)}>increment</button>
    </div>
  )

  /* ======================
          return
  ====================== */

  return (
    <>
      {controls}

      {/* Here we could completely omit value and onChange props to 
      implement ClickCounter as an uncontrolled component. */}
      <ClickCounter
        value={externalValue}
        onChange={(newValue) => {
          setExternalValue(newValue)
        }}
      >
        Clicks:
      </ClickCounter>

      {/* Used to demonstrate that the external count is always in sync with internalCount*/}
      <div className='mb-6 text-center text-3xl leading-none font-bold text-blue-500'>
        {externalValue}
      </div>
    </>
  )
}
