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
  rect: DOMRect | null
  range: EmojiSuggestionRange | null
}

const initialState: EmojiSuggestionState = {
  open: false,
  query: '',
  items: [],
  rect: null,
  range: null
}

let state = initialState
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

/* ========================================================================

======================================================================== */

export const emojiSuggestionStore = {
  getSnapshot: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener) // eslint-disable-line
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

export function useEmojiSuggestionState() {
  return useSyncExternalStore(
    emojiSuggestionStore.subscribe,
    emojiSuggestionStore.getSnapshot,
    emojiSuggestionStore.getSnapshot
  )
}
