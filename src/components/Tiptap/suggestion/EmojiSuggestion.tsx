import { useEffect } from 'react'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating
} from '@floating-ui/react'
import {
  emojiSuggestionStore,
  useEmojiSuggestionState
} from './emojiSuggestionStore'

import type { Editor } from '@tiptap/react'
import type { EmojiSuggestionItem } from './emojiSuggestionStore'

/* =====================
     
====================== */

function getEmojiText(item: EmojiSuggestionItem) {
  return item.emoji || item.shortcodes[0] || `:${item.name}:`
}

/* ========================================================================

======================================================================== */
// The EmojiSuggestion.tsx file defines the React component that consumes the store's state.
// Because this component is not managed by Tiptap's ReactRenderer (as in the documenation example),
// it is not subject to the component.destroy() call that previously caused the popup to vanish.

//# Run the Floating UI implementation past AI to double-check it for accuracy and best practices.
//# Ask it to explain how it works.
//# Ask if there's any suggestions for improvement.

export function EmojiSuggestion({ editor }: { editor: Editor | null }) {
  const state = useEmojiSuggestionState()

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  })

  /* =====================
        useEffect()
  ====================== */
  // Register a virtual element whose getBoundingClientRect calls Tiptap's
  // live clientRect function, so the popup tracks the caret on every scroll
  // or resize cycle that autoUpdate triggers.
  // Use setPositionReference for virtual elements (not setReference, which requires a real DOM element).

  useEffect(() => {
    if (state.clientRect) {
      refs.setPositionReference({
        getBoundingClientRect: () => state.clientRect!() ?? new DOMRect()
      })
    }
  }, [state.clientRect, refs])

  /* =====================
          return
  ====================== */

  if (!state.open || state.items.length === 0) return null

  return (
    <div
      ref={(node) => {
        refs.setFloating(node)
      }}
      className='bg-card rounded-md border p-2 shadow-lg'
      // Prevent clicking an emoji button from stealing focus from the editor,
      // which would itself trigger an onExit.
      onMouseDown={(e) => e.preventDefault()}
      style={floatingStyles}
    >
      <div className='max-h-72 overflow-auto'>
        {state.items.map((item) => {
          const text = getEmojiText(item)

          return (
            <button
              key={item.name}
              className='flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-gray-100'
              onClick={() => {
                if (!editor || !state.range) return
                editor.chain().focus().insertContentAt(state.range, text).run()
                emojiSuggestionStore.reset()
              }}
              type='button'
            >
              <span className='text-lg leading-none'>{item.emoji || text}</span>
              <span className='flex-1 text-sm'>{item.name}</span>
              <span className='text-xs text-gray-500'>
                {item.shortcodes[0] ? `:${item.shortcodes[0]}:` : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
