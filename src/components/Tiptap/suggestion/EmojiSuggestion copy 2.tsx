/* ========================================================================
                            EmojiSuggestion v2
======================================================================== */

import { useEffect, useId, useRef, useState } from 'react'
import {
  // FloatingFocusManager,
  // FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  //useDismiss,
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
import { cn } from '@/utils'

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

  const { refs, floatingStyles, context /*, update */ } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate
  })

  const [activeIndex, setActiveIndex] = useState<number | null>(0)
  const listRef = useRef<Array<HTMLElement | null>>([])

  /* =====================
  1. Attach the editor DOM — for interactions (dismiss, keyboard, etc.)
  ====================== */

  useEffect(() => {
    const editorDom = (editor as any)?.view?.dom ?? null
    refs.setReference(editorDom)
    return () => refs.setReference(null)
  }, [editor, refs])

  /* =====================
  2. Virtual caret positioning — controls where the popup appears
  ====================== */

  useEffect(() => {
    if (!state.clientRect) {
      refs.setPositionReference(null)
      return
    }
    refs.setPositionReference({
      getBoundingClientRect: () => {
        try {
          return state.clientRect!() ?? new DOMRect()
        } catch {
          return new DOMRect()
        }
      }
    })
    return () => refs.setPositionReference(null)
  }, [state.clientRect, refs])

  /* =====================
  3. Floating UI interaction hooks
  ====================== */

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    // A callback that is called when the user navigates
    // to a new active item, passed in a new activeIndex.
    onNavigate: setActiveIndex,
    focusItemOnHover: false
    // focusItemOnOpen: false
    // scrollItemIntoView: true
  })

  // ⚠️ Not needed because of Escape logic in useEffect below.
  // const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true })
  const role = useRole(context, { role: 'listbox' })

  const { getFloatingProps, getItemProps /*, getReferenceProps */ } =
    useInteractions([
      listNavigation,
      // dismiss,
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

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ The Critique: useListNavigation is doing almost nothing.
  // This is the core tension in the component. useListNavigation is wired up, but it works by
  // intercepting keyboard events on the focused element. Since focus never leaves the editor
  // (which is the reference element, not the floating element), Floating UI's keyboard handler never fires. All real keyboard work is done by your onEditorKeyDown listener attached directly to the editor DOM.
  //
  // The result is that useListNavigation only contributes its getFloatingProps ARIA attributes
  // — the actual navigation logic is entirely your own. This is fine as a conscious choice,
  // but it means the hook is mostly decorative.
  //
  // You are manually updating setActiveIndex inside a useEffect.
  // While this works, it bypasses the internal logic of useListNavigation.
  //
  // The Fix: Floating UI is designed to handle this via getReferenceProps.
  // Instead of a manual listener that replicates the logic, you can pass the editor's
  // keyboard events directly into Floating UI’s state machine.
  //
  // You have two realistic options:
  //
  //   Option A — Remove useListNavigation entirely and just manage activeIndex yourself
  //   (which you already are). Keep your custom onEditorKeyDown. It's clean, explicit, and honest.
  //
  //   Option B — Use useListNavigation properly by moving focus to the floating element when the popup
  //   opens (via FloatingFocusManager), then relaying editor input from there. This is more complex
  //   and probably not worth it for this use case.
  //
  // As-is, useListNavigation creates a false impression that Floating UI is handling keyboard navigation when it isn't.
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!state.open || state.items.length === 0) return

    const editorDom = editor?.view?.dom
    if (!editorDom) return

    function onEditorKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min((i ?? 0) + 1, state.items.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max((i ?? 0) - 1, 0))
        // ❌ || e.key === ' ' - Most IDEs and editors (Slack, Discord, Notion)
        // do not use Space to select an emoji suggestion. They use Enter or Tab.
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

    // Because Tiptap is "greedy" with events, your capture: true approach is often necessary.
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
              className={cn(
                'flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-gray-100',
                isActive && 'bg-blue-500 text-white'
              )}
              onClick={() => {
                if (!editor || !state.range) return
                editor.chain().focus().insertContentAt(state.range, text).run()
                emojiSuggestionStore.reset()
              }}
              type='button'
              role='option'
              aria-selected={isActive}
              {...getItemProps()}
            >
              <span className='text-lg leading-none'>{item.emoji || text}</span>
              <span className='flex-1 text-sm'>{item.name}</span>
              <span className='text-xs'>
                {item.shortcodes[0] ? `:${item.shortcodes[0]}:` : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

//# It's possible that we can move to a more idiomatic approach by implementing
//# more from @floating-ui/react. However, Bing AI screwed it up every time.
//# Try again later, but with Claude.

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
