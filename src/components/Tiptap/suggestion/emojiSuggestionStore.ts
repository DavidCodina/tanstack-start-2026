import { useSyncExternalStore } from 'react'

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
// One can also achieve the same result simply by using useEffect + useState.
//
//   export function useEmojiSuggestionState() {
//     const [state, setState] = useState(emojiSuggestionStore.getSnapshot())
//     useEffect(() => {
//       return emojiSuggestionStore.subscribe(() => {
//         setState(emojiSuggestionStore.getSnapshot())
//       })
//     }, [])
//     return state
//   }
//
// Both versions are essentially doing the same thing. The primary difference is that
// useSyncExternalStore is React's official, concurrent-mode-safe approach.
// That said, the useEffect + useState version may still be susceptible to "tearing",
// which is why useSyncExternalStore is the preferred approach, albeit more cryptic.

///////////////////////////////////////////////////////////////////////////

export function useEmojiSuggestionState() {
  return useSyncExternalStore(
    emojiSuggestionStore.subscribe,
    emojiSuggestionStore.getSnapshot,
    emojiSuggestionStore.getSnapshot
  )
}
