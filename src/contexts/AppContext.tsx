import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { createContext, useContextSelector } from 'use-context-selector'
import type { ParsedLocation } from '@tanstack/react-router'
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'

type MaybePreviousLocation = ParsedLocation<{
  [x: string]: unknown
}> | null

export interface AppContextValue {
  count: number
  previousLocation: MaybePreviousLocation
  setCount: Dispatch<SetStateAction<number>>
  // [key: string]: any
}

/* ========================================================================

======================================================================== */

export const AppContext = createContext({} as AppContextValue)

// This won't work with use-context-selector:
// https://github.com/dai-shi/use-context-selector?tab=readme-ov-file#limitations
// export const AppConsumer = AppContext.Consumer

export const AppProvider = ({ children }: PropsWithChildren) => {
  const routerState = useRouterState()
  const location = routerState.location

  ///////////////////////////////////////////////////////////////////////////
  //
  // Initially, I was doing this:
  //
  //   ❌ const [hasNavigated, setHasNavigated] = useState(false)
  //
  // Then setHasNavigated(true) in the useEffect() below. The shortcoming of this
  // approach is that it doesn't persist across page refreshes.
  // In contrast, Tanstack Router has
  //
  //   - router.history.canGoBack()
  //   - useCanGoBack()
  //
  // Both of these work acros page refreshes, presumably because window.history.state
  // persists across browser reloads. However, it doens't persist across new browser tabs.
  // Both router.history.canGoBack() and useCanGoBack() are likely checking the __TSR_index.
  // For example:
  //
  //   function useCanGoBack() {
  //     return useRouterState({ select: (s) => s.location.state.__TSR_index !== 0 });
  //   }
  //
  // Basically, when the app loads, it maintains a value for __TSR_index, and it gets
  // updated every time the user navigates. This makes it especially useful for back buttons.
  //
  ///////////////////////////////////////////////////////////////////////////

  const [previousLocation, setPreviousLocation] =
    useState<MaybePreviousLocation>(null)

  const [count, setCount] = useState(0) // Used to test rerender behavior.

  /* ======================
        useEffect()
  ====================== */

  useEffect(() => {
    return () => {
      setPreviousLocation(location)
    }
  }, [location])

  /* ======================
          return
  ====================== */

  return (
    <AppContext.Provider
      value={{
        count,
        previousLocation,
        setCount
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

///////////////////////////////////////////////////////////////////////////
//
// In simple apps, we might to this:
//
//   export function useAppContext() {
//     const value = useContext(AppContext)
//     return value
//   }
//
// There is an issue with this:
// https://github.com/reactjs/rfcs/pull/119
// Basically, two sibling components that both use the same context, but
// different parts of it will still be affected by changes to that context
// and thus rerender unnecessarily. Solution: use-context-selector:
//
// Usage:
//
//   ❌ const { showMenu, setShowMenu} = useAppContext()
//
//  ✅ const showMenu    = useAppContextSelector('showMenu')
//  ✅ const setShowMenu = useAppContextSelector('setShowMenu')
//
///////////////////////////////////////////////////////////////////////////
export const useAppContextSelector = <T extends keyof AppContextValue>(
  key: T
) => {
  const value = useContextSelector(AppContext, (state) => state[key])
  return value
}

/* ======================
    Don't Do This!
====================== */

///////////////////////////////////////////////////////////////////////////
//
// The above version of useAppContextSelector() only allows the consumer to select
// one piece of context at a time.
//
// What I really want is to be able to pass in a key (string) or an array of keys, and then
// get back an object that contains all of the selected key/value pairs. The challenge
// is getting Typescript to come along for the ride and be completely aware.
//
// Initially, I was doing this:
//
//   const partialAppContext: Partial<AppContextValue> = {}
//
// The problem here is that it will make the typed values
// xxx | undefined. This is actually correct, but I don't
// want to deal with the type checking that this will entail.
// Then I did this:
//
//   type PartialAppContext = { [K in keyof AppContextValue]: AppContextValue[K] }
//
// Then typecast it to partialAppContext:
//
// const partialAppContext = {} as PartialAppContext
//
// But really that's just the same as doing:
//
//   const partialAppContext = {} as AppContextValue
//
// So the issue is that I want Typescript to complain if
// we try to destructure a property that was not actually requested.
//
//   const { count, setCount, test } = useAppContextSelector2(['count', 'setCount'])
//   // => Property 'test' does not exist on type 'Pick<AppContextValue, "count" | "setCount">'.
//
// We can actually accomplish this through using Typescript's Pick Utility in conjunction
// with a PartialKeys type that changes dynamically based on what is passed in.
//
// https://dev.to/shakyshane/2-ways-to-create-a-union-from-an-array-in-typescript-1kd6#:~:text=First%20way%20to%20create%20a%20union%20from%20an%20array&text=It%20turns%20out%20that%20using,us%20the%20union%20we%20need.
//
// Thus we can now do this in the consuming component:
//
//  const { count, setCount } = useAppContextSelector(['count', 'setCount'])
//
//! The problem is that we've succeeded at recreating the exact problem that
//! we were trying to avoid with unnecessary rerenders.
// Thus, if create a <Child1 /> component that does this:
//
//   const { test } = useAppContextSelector('test')
//
// It will now rerender every time <ClickCounter /> updates. Whoops!
//
// Moral of the story, you are only allowed to select one piece of state
// at a time for a reason
//
///////////////////////////////////////////////////////////////////////////

/*
export const useBadAppContextSelector = <T extends keyof AppContextValue>(
  key: T | T[]
) => {
  const keys = typeof key === 'string' ? [key] : key

  const value = useContextSelector(AppContext, (state) => {
    type PartialKeys = (typeof keys)[number]
    type PartialAppContext = Pick<AppContextValue, PartialKeys>
    const partialAppContext = {} as PartialAppContext

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i]
      partialAppContext[currentKey] = state[currentKey]
    }
    return partialAppContext
  })

  return value
}
*/
