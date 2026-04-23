import { emojiSuggestionStore } from './emojiSuggestionStore'
import type { EmojiItem } from '@tiptap/extension-emoji'

// See here:
// https://tiptap.dev/docs/editor/api/utilities/suggestion
// https://github.com/ueberdosis/tiptap
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
// Why are we omitting the editor?
// The official Emoji suggestion configuration expects this:
// Omit<SuggestionOptions<any, any>, "editor"> | undefined

export const suggestion: Omit<SuggestionOptions<EmojiItem>, 'editor'> = {
  char: ':',
  allowSpaces: false,
  allowToIncludeChar: true,
  // allowedPrefixes: [' ', '\n'],

  items: ({ editor, query }) => {
    const { emojis } = editor.storage.emoji as EmojiStorage
    const q = query.toLowerCase()

    const filtered = emojis.filter(({ shortcodes, tags }) => {
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
