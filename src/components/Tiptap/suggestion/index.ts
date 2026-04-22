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

//# Compare all of this to:
//# https://github.com/ueberdosis/tiptap/blob/main/demos/src/Nodes/Emoji/React/suggestion.js

/* ========================================================================

======================================================================== */

function normalizeItems(items: EmojiItem[]) {
  return items.map((item) => ({
    name: item.name,
    shortcodes: item.shortcodes ?? [],
    tags: item.tags ?? [],
    //# What the heck is .native?
    emoji: (item as any).emoji ?? (item as any).native ?? '',

    //# Where in the world would a fallback come from?
    fallbackImage: (item as any).fallbackImage ?? ''
  }))
}

/* ========================================================================

======================================================================== */

export const suggestion: Omit<SuggestionOptions<EmojiItem>, 'editor'> = {
  char: ':',
  allowSpaces: false,
  allowToIncludeChar: true,
  allowedPrefixes: [' ', '\n'], //# What does this do?

  items: ({ editor, query }) => {
    const { emojis } = editor.storage.emoji as EmojiStorage
    const q = query.toLowerCase()

    const filtered = emojis.filter(({ shortcodes, tags }) => {
      //# Note this logic is different from the original implemenation.
      //# https://github.com/ueberdosis/tiptap/blob/main/demos/src/Nodes/Emoji/React/suggestion.js
      return (
        shortcodes.some((shortcode) => shortcode.toLowerCase().startsWith(q)) ||
        tags.some((tag) => tag.toLowerCase().startsWith(q))
      )
    })

    //# Is the slice actually working?
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
          clientRect: props.clientRect ?? null,
          range: props.range
        })
      },

      onUpdate(props: SuggestionProps<EmojiItem>) {
        emojiSuggestionStore.set({
          open: true,
          query: props.query,
          items: normalizeItems(props.items),
          clientRect: props.clientRect ?? null,
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
