// import { UseDebouncedCallback } from './UseDebouncedCallback'
// import { UseDebouncedValue } from './UseDebouncedValue'
// import { UseDebouncedState } from './UseDebouncedState'
import { UseThrottledCallback } from './UseThrottledCallback'

/* ========================================================================

======================================================================== */
// ⚠️ TanStack Pacer is currently in beta and its API is still subject to change.

///////////////////////////////////////////////////////////////////////////
//
// Hook variations:
// https://tanstack.com/pacer/latest/docs/guides/which-pacer-utility-should-i-choose#which-hook-variation-should-i-use
// If you are using a framework adapter like React, you will see that there are lots of examples with multiple hook variations.
// For example, for debouncing you will see:
//
//   useDebouncer
//   useDebouncedCallback
//   useDebouncedState
//   useDebouncedValue
//
// You will also probably see that you can use the core Debouncer class directly or the core debounce function directly without using a hook.
// These are all variations of the same basic debouncing functionality. So, which one should you use?
// The answer is: It Depends! 🤷‍♂️
//
// But also: It doesn't really matter too much. They all do essentially the same thing. It's mostly a matter of personal preference and how you
// want to interact with the utility. Under the hood, a Debouncer instance is created no matter what you choose.
//
// You can start with the useDebouncer hook if you don't know which one to use. All of the others wrap the useDebouncer hook with different argument
// and return value signatures.
//
///////////////////////////////////////////////////////////////////////////

// https://tanstack.com/pacer/latest
// WDS: https://www.youtube.com/watch?v=nQrUeK0n1qw

// Todo: See WDS at 10:45 for demo on useBatchedCallback

// Todo: Explore useRateLimiter

// Todo: Explore standard useDebouncer and useThrottler

// Todo: Explore useQueuer

// Todo: npm install @tanstack/react-devtools @tanstack/react-pacer-devtools

export const PacerDemos = () => {
  return (
    <>
      <UseThrottledCallback />
    </>
  )
}
