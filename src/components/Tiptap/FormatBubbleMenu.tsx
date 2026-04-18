import { BubbleMenu } from '@tiptap/react/menus'

// import {
//   EditorContent,
//   findParentNode,
//   posToDOMRect,
//   useEditor,
//   useEditorState
// } from '@tiptap/react'

import {
  Bold,
  Code,
  Highlighter,
  Italic,
  Link,
  Strikethrough,
  Subscript,
  Superscript,
  Underline
} from 'lucide-react'

import { useTiptapContext } from './TiptapContext'

import { cn } from '@/utils'

const HOVER_MIXIN = `
hover:bg-accent
hover:border-[rgba(0,0,0,0.3)]
dark:hover:border-[rgba(255,255,255,0.35)]
`

const FOCUS_MIXIN = `
focus-visible:bg-accent
focus-visible:border-[rgba(0,0,0,0.3)]
dark:focus-visible:border-[rgba(255,255,255,0.35)]
focus-visible:ring-[3px]
focus-visible:ring-black/10
dark:focus-visible:ring-white/20
`

const SELECTED_MIXIN = `
text-white hover:text-white focus-visible:text-white 
bg-blue-500 hover:bg-blue-500 focus-visible:bg-blue-500
border-blue-700 dark:border-blue-300
hover:border-blue-700 dark:hover:border-blue-300
focus-visible:border-blue-700 dark:focus-visible:border-blue-300
focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-500/50
shadow-xs
`

const buttonClasses = `
flex items-center gap-2
px-1 py-1
bg-transparent font-medium leading-none
border border-transparent rounded-lg 
outline-none cursor-pointer
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// BubbleMenu: appears when you select text (i.e. there's a non-empty selection).
// Think of it like the toolbar that bubbles up from highlighted text. This is what
// you want for formatting controls.
//
// FloatingMenu: appears when your cursor is on an empty line with nothing selected.
// The idea is to give the user contextual options for inserting something new — a heading,
// an image block, a divider, etc. It floats near the cursor waiting for input.
//
// A good mental model is to think about intent:
//
//   Bubble = "I have text, I want to transform it"
//   Floating = "I have nothing yet, I want to insert something"
//
// See here line 350 for custom BubbleMenu.
// See here line 480 for custom FloatingMenu.
// https://github.com/thapatechnical/job-portal-nextjs/blob/main/src/components/text-editor.tsx
//
///////////////////////////////////////////////////////////////////////////

export const FormatBubbleMenu = ({ disabled }: { disabled?: boolean }) => {
  const { editor, editorState } = useTiptapContext()

  /* =====================
          return
  ====================== */

  if (!editor || disabled || editorState?.isCustomYoutube) {
    return null
  }

  return (
    <BubbleMenu
      data-slot='tiptap-format-bubble-menu'
      className='bg-card flex gap-1 rounded-lg border p-1 shadow'
      editor={editor}
      ///////////////////////////////////////////////////////////////////////////
      //
      // The demo in the docs has two BubbleMenu instances. One of them
      // specifically targets lists, as shown below. For the current BubbleMenu,
      // this is not necessary, but the feature is nice to know about.
      // https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu
      //
      //   shouldShow={() => editor.isActive('bulletList') || editor.isActive('orderedList') }
      //
      //   getReferencedVirtualElement={() => {
      //     const parentNode = findParentNode(
      //       (node) =>
      //         node.type.name === 'bulletList' || node.type.name === 'orderedList'
      //     )(editor.state.selection)
      //     if (parentNode) {
      //       const domRect = posToDOMRect(
      //         editor.view,
      //         parentNode.start,
      //         parentNode.start + parentNode.node.nodeSize
      //       )
      //       return {
      //         getBoundingClientRect: () => domRect,
      //         getClientRects: () => [domRect]
      //       }
      //     }
      //     return null
      //   }}
      //
      ///////////////////////////////////////////////////////////////////////////

      // https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu#options
      // Under the hood, the BubbleMenu Floating UI. You can control the middleware
      // and positioning of the floating menu with these options.
      options={{
        placement: 'bottom', // 'bottom' avoids possibly blocking the MenuBar.
        offset: 10,
        flip: true
      }}
    >
      <button
        aria-label='toggle bold'
        className={cn(buttonClasses, editorState?.isBold && SELECTED_MIXIN)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title='bold'
        type='button'
      >
        <Bold />
      </button>

      <button
        aria-label='toggle italic'
        className={cn(buttonClasses, editorState?.isItalic && SELECTED_MIXIN)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title='italic'
        type='button'
      >
        <Italic />
      </button>

      <button
        aria-label='toggle underline'
        className={cn(
          buttonClasses,
          editorState?.isUnderline && SELECTED_MIXIN
        )}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title='underline'
        type='button'
      >
        <Underline />
      </button>

      <button
        aria-label='toggle strikethrough'
        className={cn(buttonClasses, editorState?.isStrike && SELECTED_MIXIN)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title='strikethrough'
        type='button'
      >
        <Strikethrough />
      </button>

      <button
        aria-label='toggle highlight'
        className={cn(
          buttonClasses,
          editorState?.isHighlight && SELECTED_MIXIN
        )}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        title='highlight'
        type='button'
      >
        <Highlighter />
      </button>

      <button
        aria-label='toggle code'
        className={cn(buttonClasses, editorState?.isCode && SELECTED_MIXIN)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title='code'
        type='button'
      >
        <Code />
      </button>

      <button
        aria-label='link'
        className={cn(buttonClasses, editorState?.isLink && SELECTED_MIXIN)}
        disabled={disabled}
        onClick={() => {
          if (editorState?.isLink) {
            // Already on a link — edit or remove it
            const currentLinkHref = editorState.currentLinkHref ?? '' // => 'https://www.google.com'

            const url = window.prompt(
              'Edit URL (delete value to remove link)',
              currentLinkHref
            )
            if (url === null) return // The user cancelled.

            if (url === '') {
              editor.chain().focus().unsetLink().run()
              return
            }

            //# Add link validation here, or see how it's done with isAllowedUri.

            editor.chain().focus().setLink({ href: url }).run()
            return
          }

          // Otherwise, there's no link yet, so let's set one.
          const url = window.prompt('Enter URL')
          if (!url) return

          //# Add link validation here, or see how it's done with isAllowedUri.
          editor.chain().focus().setLink({ href: url }).run()
        }}
        ///////////////////////////////////////////////////////////////////////////
        //
        // This is a simpler version of the above.
        //
        //   onClick={() => {
        //     const isLink = editorState?.isLink
        //     if (isLink) {
        //       editor.chain().focus().unsetLink().run()
        //       return
        //     }
        //     const url = window.prompt('Enter URL')
        //     if (!url) return
        //     // Add link validation here.
        //     editor.chain().focus().setLink({ href: url }).run()
        //   }}
        //
        ///////////////////////////////////////////////////////////////////////////
        title='link'
        type='button'
      >
        <Link />
      </button>

      <button
        aria-label='toggle subscript'
        className={cn(
          buttonClasses,
          editorState?.isSubscript && SELECTED_MIXIN
        )}
        disabled={disabled}
        //# Check if superscript and remove.
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        title='subscript'
        type='button'
      >
        <Subscript />
      </button>

      <button
        aria-label='toggle superscript'
        className={cn(
          buttonClasses,
          editorState?.isSuperscript && SELECTED_MIXIN
        )}
        disabled={disabled}
        //# Check if subscript and remove.
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        title='superscript'
        type='button'
      >
        <Superscript />
      </button>
    </BubbleMenu>
  )
}
