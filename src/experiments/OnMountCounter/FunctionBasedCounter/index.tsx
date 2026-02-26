import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type Props = {
  // ...
}

///////////////////////////////////////////////////////////////////////////
//
// We know that the ref actually looks like this:
//
//   type Ref = {
//     internalRef: { current: HTMLDivElement | null }
//     decrement: () => void
//     reset: () => void
//     increment: () => void
//   }
//
// However, if we do this, then it makes it more complicated to type out a
// useRef() statement on the consuming side. In other words, we end up with this:
//
//   const counterRef = useRef<React.Ref<unknown> | null>(null)
//
//   ...
//
//   ref={counterRef}
//   // ❌ Type 'MutableRefObject<Ref<unknown>>' is not assignable to type 'LegacyRef<Ref> | undefined'.
//
// First off, notice how incredibly unclear the problem is. Above, the `Ref` in `LegacyRef<Ref>`is actually
// the custom Ref type above, but it's super unclear because we used a generic type name of 'Ref'.
// In fact, if we scroll through the entire Typescript error, there is absolutely no clear definition
// of what the type should be. One solution to this would be to export type Ref from this file, and
// expect the user to import it and use it, but that's not ideal. Instead, it's just easier to use
// type unkown. By using unknown here, the consumer can type their ref as they see fit:
//
//   const counterRef = useRef<React.Ref<unknown> | null>(null)
//   const counterRef = useRef<HTMLDivElement | null>(null)
//   const counterRef = useRef<any>(null)
//
// Or best of all use:
//
//   expot type CounterRef = {
//     internalRef: { current: HTMLDivElement | null }
//     decrement: () => void
//     reset: () => void
//     increment: () => void
//   }
//
//   const CounterRef = useRef<CounterRef | null>(null)
//
// The fact that we're doing this on the consuming side is great.
// The main point is that we DO NOT want to be this narrow on the
// implemenation side.
//
// We can still export a CounterRef type here, but we don't want to actually
// use it here!
//
///////////////////////////////////////////////////////////////////////////

export type CounterRef = {
  internalRef: { current: HTMLDivElement | null }
  decrement: () => void
  reset: () => void
  increment: () => void
}

/* ========================================================================
      
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
//
// Class-Based Components and Refs:
//
//   In class-based components, refs are often used to directly access the instance of the component.
//   This instance can have methods and properties that are defined within the class, making it
//   straightforward to expose an API for interacting with the component. This is why when you use a
//   ref with react-select, you get back an instance of the Select class, which includes various methods
//   and properties for interacting with the component.
//
// Function Components and useImperativeHandle:
//
//   In function components, we don’t have an instance in the same way as class components.
//   Instead, we use hooks to manage state and side effects. To expose methods and properties
//   to a parent component, we use the useImperativeHandle hook. This hook allows us to customize
//   the instance value that is exposed when using a ref.
//
// Implementing a Similar API in Function Components:
//
//   To achieve a similar API-style object in a function component, you could use useImperativeHandle.
//   This hook allows you to define which methods and properties should be exposed to the parent component
//   when a ref is used.
//
///////////////////////////////////////////////////////////////////////////
export const FunctionBasedCounter = forwardRef<unknown, Props>((props, ref) => {
  const internalRef = useRef<HTMLDivElement | null>(null)
  const [count, setCount] = useState(0)

  const decrement = () => {
    setCount((v) => v - 1)
  }

  const reset = () => {
    setCount(0)
  }

  const increment = () => {
    setCount((v) => v + 1)
  }

  useImperativeHandle(ref, () => ({
    internalRef: internalRef,
    decrement,
    reset,
    increment
  }))

  return (
    <div {...props} ref={internalRef}>
      <div className='btn-group mx-auto mb-6' style={{ display: 'table' }}>
        <button className='btn-blue btn-sm min-w-[100px]' onClick={decrement}>
          Decrement
        </button>

        <button className='btn-blue btn-sm min-w-[100px]' onClick={reset}>
          Reset
        </button>
        <button className='btn-blue btn-sm min-w-[100px]' onClick={increment}>
          Increment
        </button>
      </div>

      <div className='text-center text-2xl font-bold text-blue-500'>
        Count: {count}
      </div>
    </div>
  )
})

FunctionBasedCounter.displayName = 'FunctionBasedCounter'
