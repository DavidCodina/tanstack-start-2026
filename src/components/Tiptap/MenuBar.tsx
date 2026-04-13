import { useEditorState } from '@tiptap/react'
import {
  CornerDownLeft,
  Eraser,
  RotateCcw,
  RotateCw,
  Ruler,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Trash2
} from 'lucide-react'

import { menuBarStateSelector } from './menuBarState'
import { Divider } from './Divider'
import { BlockTypeDropdown } from './BlockTypeDropdown'
import { TextFormatDropdown } from './TextFormatDropdown'

import type { Editor } from '@tiptap/core'
import { cn } from '@/utils'

type MenuBarProps = {
  editor: Editor | null
}

const SOLID_BUTTON_BORDER_MIXIN = `border border-[rgba(0,0,0,0.3)] dark:border-[rgba(255,255,255,0.35)]`

const HOVER_MIXIN = `
hover:bg-[oklch(from_var(--color-accent)_calc(l_-_0.2)_c_h))]
hover:text-white
dark:hover:bg-[oklch(from_var(--color-accent)_calc(l_+_0.15)_c_h))]
`

const FOCUS_MIXIN = `
focus-visible:ring-[3px]
focus-visible:ring-black/10
dark:focus-visible:ring-white/20
`

const SELECTED_MIXIN = `
text-white hover:text-white focus-visible:text-white 
bg-green-500 hover:bg-green-500 focus-visible:bg-green-500
border-green-700 dark:border-green-300
hover:border-green-700 dark:hover:border-green-300
focus-visible:border-green-700 dark:focus-visible:border-green-300
focus-visible:ring-green-500/50 dark:focus-visible:ring-green-500/50
`

const buttonClasses = `
flex items-center gap-2
px-1 py-1
bg-accent font-medium leading-none
rounded-lg outline-none cursor-pointer
shadow-xs
${SOLID_BUTTON_BORDER_MIXIN}
${HOVER_MIXIN}
${FOCUS_MIXIN}
`

/* ========================================================================

======================================================================== */
//# Switch to icons with title attributes, etc.

export const MenuBar = ({ editor }: MenuBarProps) => {
  const editorState = useEditorState({
    // Technically if there's no editor, useEditorState will be fine.
    // However, ctx.editor in menuBarState will end up being undefined.
    // Consequently, one must ensure that all values in menuBarState use
    // optional chaining: ctx.editor?. ...
    editor: editor, // as Editor
    // But actually, there's another way. We can instead return null from selector.
    // If you go this route, make sure to then use optional chaining in the after
    // editorState in this file.
    selector: (ctx) => {
      if (!editor || !ctx.editor) return null
      return menuBarStateSelector(ctx)
    }
    // selector: menuBarStateSelector
  })

  if (!editor /* || !editorState */) {
    return null
  }

  /* =====================
      renderUndoRedo()
  ====================== */

  const renderUndoRedo = () => {
    return (
      <>
        <button
          className={cn(
            buttonClasses,

            !editorState?.canUndo && 'cursor-not-allowed opacity-50'
          )}
          disabled={!editorState?.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
          title='Undo'
          type='button'
        >
          <RotateCcw />
        </button>

        <button
          className={cn(
            buttonClasses,
            !editorState?.canRedo && 'cursor-not-allowed opacity-50'
          )}
          disabled={!editorState?.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
          title='Redo'
          type='button'
        >
          <RotateCw />
        </button>
      </>
    )
  }

  /* =====================
      renderInsert()
  ====================== */

  const renderInsert = () => {
    return (
      <>
        <button
          className={cn(buttonClasses)}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title='horizontal rule'
          type='button'
        >
          <Ruler />
        </button>

        {/*
       //# What does this do?
      */}
        <button
          className={cn(buttonClasses)}
          onClick={() => editor.chain().focus().setHardBreak().run()}
          type='button'
          title='hard break'
        >
          <CornerDownLeft />
        </button>
      </>
    )
  }

  /* =====================
      renderAlignment()
  ====================== */

  const renderAlignment = () => {
    return (
      <>
        <button
          className={cn(
            buttonClasses,
            editorState?.isAlignLeft && SELECTED_MIXIN
          )}
          onClick={() => editor.chain().focus().toggleTextAlign('left').run()}
          title='align left'
          type='button'
        >
          <TextAlignStart />
        </button>

        <button
          className={cn(
            buttonClasses,
            editorState?.isAlignCenter && SELECTED_MIXIN
          )}
          onClick={() => editor.chain().focus().toggleTextAlign('center').run()}
          title='align center'
          type='button'
        >
          <TextAlignCenter />
        </button>

        <button
          className={cn(
            buttonClasses,
            editorState?.isAlignRight && SELECTED_MIXIN
          )}
          onClick={() => editor.chain().focus().toggleTextAlign('right').run()}
          title='align right'
          type='button'
        >
          <TextAlignEnd />
        </button>

        <button
          className={cn(
            buttonClasses,
            editorState?.isAlignJustify && SELECTED_MIXIN
          )}
          onClick={() =>
            editor.chain().focus().toggleTextAlign('justify').run()
          }
          title='align justify'
          type='button'
        >
          <TextAlignJustify />
        </button>
      </>
    )
  }

  /* =====================
  renderClearActions()
  ====================== */

  const renderClearActions = () => {
    return (
      <>
        <button
          className={cn(
            buttonClasses,
            'hover:border-yellow-600 hover:bg-yellow-400 hover:text-white'
          )}
          onClick={() => editor.chain().focus().clearNodes().run()}
          title='remove nodes'
          type='button'
        >
          <Eraser />
        </button>

        {/* Clear (clearContent) — nukes everything, leaving a single empty paragraph. */}

        <button
          className={cn(
            buttonClasses,
            'hover:border-rose-700 hover:bg-rose-500 hover:text-white'
          )}
          onClick={() => editor.chain().focus().clearContent(true).run()}
          title='delete content'
          type='button'
        >
          <Trash2 />
        </button>
      </>
    )
  }

  /* =====================
          return
  ====================== */

  return (
    <div className='flex flex-wrap gap-2 border-b p-2'>
      {renderUndoRedo()}

      <Divider />

      <BlockTypeDropdown
        disabled={false} //# Don't hardcode this
        editor={editor}
        editorState={editorState}
      />

      <Divider />

      <TextFormatDropdown
        disabled={false} //# Don't hardcode this
        editor={editor}
        editorState={editorState}
      />

      <Divider />

      {renderInsert()}

      <Divider />

      {renderAlignment()}

      <Divider />

      {renderClearActions()}

      {/* <button
        className={cn(buttonClasses, editorState?.isLink && SELECTED_MIXIN)}
        disabled={!editorState?.canSetLink && !editorState?.canUnsetLink}
        onClick={() => {
          if (editorState?.isLink) {
            // Already on a link — edit or remove it
            const currentLinkHref = editorState.currentLinkHref ?? '' // => 'https://www.google.com'

            const url = window.prompt('Edit URL', currentLinkHref)
            if (url === null) return // The user cancelled.

            if (url === '') {
              editor.chain().focus().unsetLink().run()
              return
            }

            editor.chain().focus().setLink({ href: url }).run()
            return
          }

          // Otherwise, there's no link yet, so let's set one.
          const url = window.prompt('Enter URL')
          if (!url) return
          editor.chain().focus().setLink({ href: url }).run()
        }}
        title='link'
        type='button'
      >
        Link
      </button> */}
    </div>
  )
}
