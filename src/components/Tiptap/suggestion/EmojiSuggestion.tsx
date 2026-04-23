import { useEffect, useId, useRef, useState } from 'react'
import {
  //# It's possible that we can move to a more idiomatic approach by implementing
  //# more from @floating-ui/react. However, Bing AI screwed it up every time.
  //# Try again later, but with Claude.
  // FloatingFocusManager,
  // FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole
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

export function EmojiSuggestion({ editor }: { editor: Editor | null }) {
  const state = useEmojiSuggestionState()
  const id = useId()

  const { refs, floatingStyles, update, context } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  })

  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const listRef = useRef<Array<HTMLElement | null>>([])

  /* =====================
  1. Virtual caret positioning
  ====================== */

  useEffect(() => {
    if (!state.clientRect) {
      refs.setPositionReference(undefined as any)
      return
    }

    const virtualElement = {
      getBoundingClientRect: () => {
        try {
          const rect = state.clientRect!()
          return rect ?? new DOMRect()
        } catch {
          return new DOMRect()
        }
      }
    }

    refs.setPositionReference(virtualElement)
    update?.()

    return () => {
      refs.setPositionReference(undefined as any)
    }
  }, [state.clientRect, refs, update])

  /* =====================
  2. Attach a real DOM reference for interactions (editor)
  ====================== */

  useEffect(() => {
    const editorDom = (editor as any)?.view?.dom ?? null
    if (editorDom) {
      refs.setReference(editorDom)
    } else {
      refs.setReference(undefined as any)
    }

    return () => {
      refs.setReference(undefined as any)
    }
  }, [editor, refs])

  /* =====================
  3. Floating UI interaction hooks
  ====================== */

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex
  })

  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true })
  const role = useRole(context, { role: 'listbox' })

  const { getFloatingProps, getItemProps } = useInteractions([
    listNavigation,
    dismiss,
    role
  ])

  /* =====================
  4. Keep activeIndex in bounds
  ====================== */

  useEffect(() => {
    if (!state.open || state.items.length === 0) {
      setActiveIndex(0) // eslint-disable-line
      listRef.current = []
    } else {
      listRef.current = new Array(state.items.length).fill(null)
      setActiveIndex((i) =>
        i === null ? 0 : Math.min(i, state.items.length - 1)
      )
    }
  }, [state.open, state.items])

  /* =====================
  5. Scroll active item into view
  ====================== */

  useEffect(() => {
    if (activeIndex === null) return
    const el = listRef.current[activeIndex]
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    })
  }, [activeIndex, state.items])

  /* =====================
  6. Editor-scoped key handling (fix for Tiptap consuming keys)
  ====================== */
  // Attach a keydown listener directly to the editor DOM while the
  // suggestion popup is open. This keeps handling local and avoids
  // relying on Floating UI's listeners reaching the editor when
  // the editor consumes events.

  useEffect(() => {
    if (!state.open || state.items.length === 0) return

    const editorDom = (editor as any)?.view?.dom as HTMLElement | undefined
    if (!editorDom) return

    function onEditorKeyDown(e: KeyboardEvent) {
      // Only handle the keys we care about
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min((i ?? 0) + 1, state.items.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max((i ?? 0) - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const idx = activeIndex ?? 0
        const item = state.items[idx]
        if (!item || !editor || !state.range) return
        const text = getEmojiText(item)
        editor.chain().focus().insertContentAt(state.range, text).run()
        emojiSuggestionStore.reset()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        emojiSuggestionStore.reset()
      }
    }

    // Use capture phase to intercept keys before editor handlers if needed
    editorDom.addEventListener('keydown', onEditorKeyDown, { capture: true })

    return () => {
      editorDom.removeEventListener('keydown', onEditorKeyDown, {
        capture: true
      })
    }
  }, [state.open, state.items, activeIndex, editor, state.range])

  /* =====================
          return
  ====================== */

  if (!state.open || state.items.length === 0) return null

  return (
    <div
      ref={(node) => refs.setFloating(node)}
      style={floatingStyles}
      className='bg-card rounded-md border p-2 shadow-lg'
      onMouseDown={(e) => e.preventDefault()}
      {...getFloatingProps({
        role: 'listbox',
        'aria-label': 'Emoji suggestions',
        'aria-activedescendant':
          activeIndex !== null && state.items[activeIndex]
            ? `${id}-emoji-${state.items[activeIndex].name}`
            : undefined,
        tabIndex: -1
      })}
    >
      <div className='max-h-72 overflow-auto'>
        {state.items.map((item, idx) => {
          const text = getEmojiText(item)
          const isActive = idx === activeIndex

          return (
            <button
              id={`${id}-emoji-${item.name}`}
              key={item.name}
              ref={(node) => {
                listRef.current[idx] = node
              }}
              className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-gray-100 ${
                isActive ? 'bg-gray-100' : ''
              }`}
              onClick={() => {
                if (!editor || !state.range) return
                editor.chain().focus().insertContentAt(state.range, text).run()
                emojiSuggestionStore.reset()
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              type='button'
              role='option'
              aria-selected={isActive}
              {...getItemProps()}
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

/* ========================================================================
                            EmojiSuggestion v1
======================================================================== */
/* Note: The initial implementation was significantly less 
complex. However, it did not have full keyboard support nor
was it taking full advantage of Floating UI's features.

import { useEffect } from 'react'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react'
import { emojiSuggestionStore, useEmojiSuggestionState } from './emojiSuggestionStore'
import type { Editor } from '@tiptap/react'
import type { EmojiSuggestionItem } from './emojiSuggestionStore'

function getEmojiText(item: EmojiSuggestionItem) {
  return item.emoji || item.shortcodes[0] || `:${item.name}:`
}

export function EmojiSuggestion({ editor }: { editor: Editor | null }) {
  const state = useEmojiSuggestionState()

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  })

  useEffect(() => {
    if (state.clientRect) {
      refs.setPositionReference({
        getBoundingClientRect: () => state.clientRect!() ?? new DOMRect()
      })
    }
  }, [state.clientRect, refs])

  if (!state.open || state.items.length === 0) return null
  return (
    <div
      ref={(node) => {
        refs.setFloating(node)
      }}
      className='bg-card rounded-md border p-2 shadow-lg'
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
*/
