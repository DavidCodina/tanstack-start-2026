import { useEffect, useState } from 'react'

export type EmojiSuggestionRange = {
  from: number
  to: number
}

export type EmojiSuggestionItem = {
  name: string
  shortcodes: string[]
  tags: string[]
  emoji?: string
  fallbackImage?: string
}

export type EmojiSuggestionState = {
  open: boolean
  query: string
  items: EmojiSuggestionItem[]
  clientRect: (() => DOMRect | null) | null
  range: EmojiSuggestionRange | null
}

const initialState: EmojiSuggestionState = {
  open: false,
  query: '',
  items: [],
  clientRect: null,
  range: null
}

let state = initialState
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

/* ========================================================================

======================================================================== */
// A minimal, hand-rolled state manager. Because the store is a plain JS module-level object,
// it is completely invisible to React's reconciliation. React cannot reset it, unmount it,
// or interfere with it in any way. It just sits in memory and does its job regardless of
// what the component tree is doing. The useEmojiSuggestionState hook is just a thin
// subscription layer that lets React components peek at it.

export const emojiSuggestionStore = {
  getSnapshot: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener) // eslint-disable-line
    }
  },
  set(next: Partial<EmojiSuggestionState>) {
    state = { ...state, ...next }
    emit()
  },
  reset() {
    state = initialState
    emit()
  }
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Previously, I was using useSyncExternalStore. The useState + useEffect version
// and the useSyncExternalStore version are doing the same job through different APIs.
// Both are just answering the question: "how does a React component know when to re-render
// because something outside React changed?" The answer in both cases is the same — the store
// calls emit(), which notifies registered listeners, which triggers a React state update,
// which causes a re-render.
//
// The only meaningful difference is that useSyncExternalStore is React's official,
// concurrent-mode-safe answer to that question, while useState + useEffect is the
// handmade version that predates it. For your use case they're functionally equivalent.
//
// That said, the current implementation of the store uses a manual useEffect subscription.
// While effective, it is susceptible to "tearing" in React 18 and 19's concurrent rendering modes.
// Replacing the manual hook with useSyncExternalStore is recommended for professional-grade implementations.
//
//   export function useEmojiSuggestionState() {
//     return useSyncExternalStore(
//       emojiSuggestionStore.subscribe,
//       emojiSuggestionStore.getSnapshot,
//       emojiSuggestionStore.getSnapshot
//     )
//   }
//
///////////////////////////////////////////////////////////////////////////

//# Ask AI if it thinks I should switch to useSyncExternalStore.

export function useEmojiSuggestionState() {
  const [state, setState] = useState(emojiSuggestionStore.getSnapshot())
  useEffect(() => {
    return emojiSuggestionStore.subscribe(() => {
      setState(emojiSuggestionStore.getSnapshot())
    })
  }, [])

  return state
}
