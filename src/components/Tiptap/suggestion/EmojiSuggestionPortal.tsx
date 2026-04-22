import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  emojiSuggestionStore,
  useEmojiSuggestionState
} from './emojiSuggestionStore'

import type { EmojiSuggestionItem } from './emojiSuggestionStore'

/* =====================
     
====================== */

function ensureOverlayRoot() {
  let root = document.getElementById('tiptap-overlay-root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'tiptap-overlay-root'
    root.style.position = 'fixed'
    root.style.inset = '0'
    root.style.zIndex = '9999'
    root.style.pointerEvents = 'none'
    document.body.appendChild(root)
  }
  return root
}

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

export function EmojiSuggestionPortal({ editor }: { editor: any }) {
  const state = useEmojiSuggestionState()
  const [root, setRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setRoot(ensureOverlayRoot()) // eslint-disable-line
  }, [])

  const style = useMemo(() => getPopupStyle(state.rect), [state.rect])

  if (!root || !state.open || state.items.length === 0) return null

  return createPortal(
    <div
      style={style}
      className='bg-card rounded-md border p-2 shadow-lg'
      onMouseDown={(e) => e.preventDefault()}
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
    </div>,
    root
  )
}
