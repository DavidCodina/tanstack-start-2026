import { ReactRenderer } from '@tiptap/react'
import { computePosition } from '@floating-ui/dom'
import { EmojiList } from './EmojiList'

import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps
} from '@tiptap/suggestion'

import type { EmojiItem } from '@tiptap/extension-emoji'

type EmojiStorage = {
  emojis: EmojiItem[]
}

/* ======================

====================== */

function repositionComponent(
  element: HTMLElement,
  clientRect: () => DOMRect | null
): void {
  const rect = clientRect()
  if (!rect) return

  computePosition({ getBoundingClientRect: () => rect }, element, {
    placement: 'bottom-start'
  })
    .then((pos) => {
      Object.assign(element.style, {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        position: pos.strategy === 'fixed' ? 'fixed' : 'absolute'
      })
      return pos
    })
    .catch((err) => err)
}

/* ========================================================================

======================================================================== */
// The official type of suggestion is: Omit<SuggestionOptions<any, any>, "editor">
// This is what  Emoji.configure({ suggestion }) expects.

export const suggestion: Omit<SuggestionOptions<EmojiItem>, 'editor'> = {
  allowSpaces: false,
  char: ':',
  // allowToIncludeChar: true,
  // allowedPrefixes: null,

  items: ({ editor, query }) => {
    const { emojis } = editor.storage.emoji as EmojiStorage

    return emojis
      .filter(({ shortcodes, tags }) => {
        return (
          shortcodes.find((shortcode) => {
            return shortcode.startsWith(query.toLowerCase())
          }) || tags.find((tag) => tag.startsWith(query.toLowerCase()))
        )
      })
      .slice(0, 5)
  },

  render: () => {
    let component: ReactRenderer | null = null

    return {
      onStart(props: SuggestionProps<EmojiItem>) {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor
        })

        document.body.appendChild(component.element)
        repositionComponent(
          component.element,
          props.clientRect as () => DOMRect | null
        )
      },

      onUpdate(props) {
        if (!component) return

        component.updateProps(props)
        repositionComponent(
          component.element,
          props.clientRect as () => DOMRect | null
        )
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (!component) return false

        if (props.event.key === 'Escape') {
          document.body.removeChild(component.element)
          component.destroy()
          component = null // ??? Do we need this?
          return true
        }

        // ??? Why not just do this like the original?
        // return component.ref?.onKeyDown(props)
        //! Temporary any
        return (component.ref as any)?.onKeyDown(props) ?? false
      },

      onExit() {
        if (!component) return
        if (document.body.contains(component.element)) {
          document.body.removeChild(component.element)
        }
        component.destroy()
        component = null // ??? Do we need this?
      }
    }
  }
}
