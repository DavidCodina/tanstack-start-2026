import { emojiSuggestionStore } from './emojiSuggestionStore'
import type { EmojiItem } from '@tiptap/extension-emoji'
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps
} from '@tiptap/suggestion'

type EmojiStorage = {
  emojis: EmojiItem[]
}

/* ========================================================================

======================================================================== */

function normalizeItems(items: EmojiItem[]) {
  return items.map((item) => ({
    name: item.name,
    shortcodes: item.shortcodes ?? [],
    tags: item.tags ?? [],
    emoji: (item as any).emoji ?? (item as any).native ?? '',
    fallbackImage: (item as any).fallbackImage ?? ''
  }))
}

/* ========================================================================

======================================================================== */
//# Compare all of this to:
//# https://github.com/ueberdosis/tiptap/blob/main/demos/src/Nodes/Emoji/React/suggestion.js
//# What about using: import { computePosition } from '@floating-ui/dom'

export const suggestion: Omit<SuggestionOptions<EmojiItem>, 'editor'> = {
  char: ':',
  allowSpaces: false,
  allowToIncludeChar: true,
  allowedPrefixes: [' ', '\n'],

  items: ({ editor, query }) => {
    const { emojis } = editor.storage.emoji as EmojiStorage
    const q = query.toLowerCase()

    const filtered = emojis.filter(({ shortcodes, tags }) => {
      return (
        shortcodes.some((shortcode) => shortcode.toLowerCase().startsWith(q)) ||
        tags.some((tag) => tag.toLowerCase().startsWith(q))
      )
    })

    const items = normalizeItems(filtered.slice(0, 10))
    emojiSuggestionStore.set({
      open: true,
      query,
      items
    })

    return filtered
  },

  render: () => {
    return {
      onStart(props: SuggestionProps<EmojiItem>) {
        emojiSuggestionStore.set({
          open: true,
          query: props.query,
          items: normalizeItems(props.items),
          rect: props.clientRect?.() ?? null,
          range: props.range
        })
      },

      onUpdate(props: SuggestionProps<EmojiItem>) {
        emojiSuggestionStore.set({
          open: true,
          query: props.query,
          items: normalizeItems(props.items),
          rect: props.clientRect?.() ?? null,
          range: props.range
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          emojiSuggestionStore.reset()
          return true
        }

        return false
      },

      onExit() {
        emojiSuggestionStore.reset()
      }
    }
  }
}
