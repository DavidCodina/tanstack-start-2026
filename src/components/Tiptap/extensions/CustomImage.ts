// https://tiptap.dev/docs/editor/extensions/nodes/image
import Image from '@tiptap/extension-image'
import type { SetImageOptions } from '@tiptap/extension-image'

import type { CommandProps } from '@tiptap/core'

export type CustomSetImageOptions = SetImageOptions & {
  margin?: string
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ If you also implement the standard Image extesion simultaneously, it's
// possible that there will be a conflict when it comes to parseHTML(). Why?
// Because the normal Image extension's parseHTML() is greedy:
//
//   parseHTML() {
//     return [
//       { tag: this.options.allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])' }
//     ]
//   }
//
// One could argue that there's no need for the standard Image extension since we now
// have this custom one. However, the standard one could be used specifically for inline
// images. According to AI, the solution is to always register the CustomImage BEFORE the
// standard Image extension in the extensions array.
//
//   Once CustomImage's parseHTML claims an img[src][data-custom-image] element and creates a
//   custom-image node from it, that element is consumed — Image's parseHTML rule never sees it.
//   It's not that Image's rule doesn't fire, it's that the element is no longer available to be matched.
//   Think of it like a queue of unprocessed DOM elements. Each extension gets a chance to claim elements
//   that match its rules. Once an element is claimed, it's removed from the queue.
//
// If that doesn't work, then you may need to implement a CustomImageInline extension that simply
// sets its own data-custom-image-inline and has a more restrictive parseHTML() rule.
//
///////////////////////////////////////////////////////////////////////////

export const CustomImage = Image.extend({
  name: 'custom-image',

  addAttributes() {
    return {
      ...this.parent?.(),
      'data-custom-image': {
        default: ''
      },

      margin: {
        default: '',

        // Read back from inline style so content round-trips correctly
        // (e.g. when loading saved HTML back into the editor).
        parseHTML(element) {
          return element.style.margin || ''
        },

        // Emit as an inline style so the output HTML is valid and
        // doesn't carry a non-standard 'margin' attribute on <img>.
        renderHTML(attributes) {
          if (!attributes.margin) return {}
          return { style: `margin: ${attributes.margin}` }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src][data-custom-image]'
          : 'img[src][data-custom-image]:not([src^="data:"])'
      }
    ]
  },

  addCommands() {
    return {
      setCustomImage: (options: CustomSetImageOptions) => {
        return (commandProps: CommandProps) => {
          const { commands } = commandProps
          return commands.insertContent({
            type: this.name,
            attrs: options
          })
        }
      }
    }
  }
})
