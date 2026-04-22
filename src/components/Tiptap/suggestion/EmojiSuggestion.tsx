import { useMemo } from 'react'

import {
  emojiSuggestionStore,
  useEmojiSuggestionState
} from './emojiSuggestionStore'

import type { EmojiSuggestionItem } from './emojiSuggestionStore'

/* =====================
     
====================== */

function getPopupStyle(rect: DOMRect | null) {
  if (!rect) {
    return {
      display: 'none'
    } as const
  }

  return {
    position: 'fixed' as const,
    left: `${rect.left}px`,
    top: `${rect.bottom + 8}px`,
    pointerEvents: 'auto' as const
  }
}

/* =====================
     
====================== */

function getEmojiText(item: EmojiSuggestionItem) {
  return item.emoji || item.shortcodes[0] || `:${item.name}:`
}

/* ========================================================================

======================================================================== */
// The original version used createPortal(), but we seem not to need it.
//# Can this be modified to use Floating UI?

export function EmojiSuggestion({ editor }: { editor: any }) {
  const state = useEmojiSuggestionState()
  const style = useMemo(() => getPopupStyle(state.rect), [state.rect])

  /* =====================
          return
  ====================== */

  if (!state.open || state.items.length === 0) return null

  return (
    <div
      className='bg-card rounded-md border p-2 shadow-lg'
      onMouseDown={(e) => e.preventDefault()}
      style={style}
    >
      <div className='max-h-72 overflow-auto'>
        {state.items.map((item) => {
          const text = getEmojiText(item)

          return (
            <button
              key={item.name}
              className='flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-gray-100'
              onClick={() => {
                if (!state.range) return

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
