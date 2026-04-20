import { mergeAttributes } from '@tiptap/core'
// https://tiptap.dev/docs/editor/extensions/nodes/youtube
import Youtube, { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import type { CommandProps } from '@tiptap/core'

// Note: YoutubeOptions is the type for the extenstion configuration options,
// not for the setYoutubeVideo({ ... }) command options.
// import type { YoutubeOptions } from '@tiptap/extension-youtube'

// import type { DOMOutputSpecArray } from '@tiptap/core'

type Tag = string
type Attributes = Record<string, any>
type Content = [string, Attributes]
type RenderHTMLResult = [Tag, Attributes, Content]

// Taken from source code here:
// https://github.com/ueberdosis/tiptap/blob/main/packages/extension-youtube/src/youtube.ts
export type CustomSetYoutubeVideoOptions = {
  src: string
  width?: number
  height?: number
  start?: number
  justifyContent?: string // Added
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// This custom extension on top of the standar Youtube extension adds the
// ability to align the <ifram> by using `justify-content` on the wrapper <div>.
// The naive approach would be to instead configure the standard Youtube extension
// as follows:
//
//   Youtube.configure({ inline: true })
//
// However, we don't actually want it to be inline (i.e., wrapped in a <p>).
// By doing it this way, we can ALSO use the standar Youtube extension for
// inline implementations.
//
///////////////////////////////////////////////////////////////////////////

export const CustomYoutube = Youtube.extend(
  /*<YoutubeOptions>*/ {
    name: 'custom-youtube', // 👈 Overrides 'youtube'

    addAttributes() {
      return {
        ...this.parent?.(),

        justifyContent: {
          default: '',
          parseHTML: (element) => {
            // The base extension matches `div[data-youtube-video] iframe`,
            // so `element` here is the <iframe>. The justify-content style
            // lives on the parent wrapper <div>, so we must climb up one level.
            return element.parentElement?.style.justifyContent || ''
          },

          // Keeps this out of the iframe's own attributes
          renderHTML: () => ({})
        }
      }
    },

    parseHTML() {
      return [
        {
          tag: 'div[data-custom-youtube-video] iframe'
        }
      ]
    },

    addCommands() {
      return {
        // No need for standard setYoutubeVideo to be included.
        // ❌ ...this.parent?.(),
        setCustomYoutubeVideo: (options: CustomSetYoutubeVideoOptions) => {
          return (commandProps: CommandProps) => {
            const { commands } = commandProps
            if (!isValidYoutubeUrl(options.src)) {
              return false
            }

            return commands.insertContent({
              type: this.name,
              attrs: options
            })
          }
        }
      }
    },

    renderHTML(parameter) {
      const { node, HTMLAttributes } = parameter
      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ Gotcha:
      //
      //   const parentResult = this.parent?.({ node, HTMLAttributes })
      //   ❌ TypeScript error: Type 'DOMOutputSpec | undefined' is not assignable to type 'DOMOutputSpec'.
      //
      // This TypeScript error is a classic case of the compiler being "technically correct" but a bit too cautious.
      // Since renderHTML() is a required return for a Node extension, and this.parent?.() might technically
      // return undefined if no parent method existed, TypeScript flags the mismatch.
      //
      // Since we're extending the official YouTube extension, we KNOW that parent method exists.
      // The cleanest way to satisfy TypeScript is to use the non-null assertion operator (!):
      //
      //   const parentResult = this.parent!({ node, HTMLAttributes })
      //
      // However, in this case I've used type assertion instead.
      //
      ///////////////////////////////////////////////////////////////////////////
      const parentResult = this.parent?.({
        node,
        HTMLAttributes
      }) as RenderHTMLResult

      ///////////////////////////////////////////////////////////////////////////
      //
      // ⚠️ Technically, it's more correct to use: as DOMOutputSpecArray above.
      // However, this allows wrapperAttrs below to potentially be a type of:
      //
      //   0
      //   | Record<string, any>
      //   | [string]
      //   | [string, Record<string, any>]
      //   | [string, 0]
      //   | [string, Record<string, any>, 0
      //   | DOMOutputSpecArray$1]
      //   | [...]
      //
      // which then causes TypeScript to complain about mergeAttributes( ... ).
      // While DOMOutputSpecArray is technically correct, the source code clearly
      // shows that it's literally this: { 'data-youtube-video': '' }
      // See here: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-youtube/src/youtube.ts
      //
      // Is it possible that the maintainer will someday do a bait-and-switch?
      // Yes. Is it likely? Probably not.
      //
      ///////////////////////////////////////////////////////////////////////////

      if (!Array.isArray(parentResult)) {
        return parentResult
      }

      const [tag, wrapperAttributes = {}, content] = parentResult

      if ('data-youtube-video' in wrapperAttributes) {
        delete wrapperAttributes['data-youtube-video']
        wrapperAttributes['data-custom-youtube-video'] = ''
      }

      const newAttributes = node.attrs.justifyContent
        ? {
            style: `display: flex; justify-content: ${node.attrs.justifyContent}`
          }
        : {}

      const mergedWrapperAttributes = mergeAttributes(
        wrapperAttributes,
        newAttributes
      )

      return [tag, mergedWrapperAttributes, content]
    }
  }
)
