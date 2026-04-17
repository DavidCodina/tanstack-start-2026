import { mergeAttributes } from '@tiptap/core'
// https://tiptap.dev/docs/editor/extensions/nodes/youtube
import Youtube, { isValidYoutubeUrl } from '@tiptap/extension-youtube'
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
  textAlign?: 'left' | 'center' | 'right' // Added (see also <root>/tiptap-augmentation.d.ts)
}

/* ========================================================================

======================================================================== */
// YoutubeOptions is the type for the extenstion configuration options,
// not for the setYoutubeVideo({ ... }) command options.

export const CustomYoutube = Youtube.extend(
  /*<YoutubeOptions>*/ {
    addAttributes() {
      return {
        ...this.parent?.(),
        textAlign: {
          parseHTML: (element) => element.style.textAlign || '',
          renderHTML: () => ({})
        }
      }
    },

    addCommands() {
      return {
        setYoutubeVideo:
          (options: CustomSetYoutubeVideoOptions) =>
          ({ commands }) => {
            if (!isValidYoutubeUrl(options.src)) {
              return false
            }

            return commands.insertContent({
              type: this.name,
              attrs: options
            })
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

      if (Array.isArray(parentResult) && node.attrs.textAlign) {
        const [tag, wrapperAttrs = {}, content] = parentResult

        const alignmentAttrs = node.attrs.textAlign
          ? { style: `text-align: ${node.attrs.textAlign}` }
          : {}

        const mergedWrapperAttrs = mergeAttributes(wrapperAttrs, alignmentAttrs)
        return [tag, mergedWrapperAttrs, content]
      }

      return parentResult
    }
  }
)
